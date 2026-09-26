/**
 * 内置技能物化：把随包分发的技能装进 `<dshHome>/skills`。
 *
 * 为什么要有这层：插件自带的技能如果不落到某个 skill root 里，DSH 根本
 * 看不见它。`dsh-skill-filesystem` 提供的 root 有四个——项目级 `.dsh/skills`
 * 与 `.agents/skills`（跟工作区走）、用户级 `~/.dsh/skills` 与 `~/.agents/skills`，
 * 外加配置驱动的 `customSkillDirs` / `bundledSkillDir`。后两个要么写死在静态
 * 配置里（插件安装路径是动态的，配置写不了解析式路径），要么得让用户手改
 * profile 配置（机器绑定，重装即失效）。
 *
 * 所以走物化：启动时把 `assets/skills/<name>` 同步到 `~/.dsh/skills/<name>`。
 * 这条 root 在 dsh-skill-filesystem 里的 source 是 `user-dsh`（带
 * `skipSystem`），是用户级技能的正统位置，不是临时目录。
 *
 * 「内置 / 不可删除」的语义由三点共同保证：
 *  1. 缺失即装——用户删掉目录，下次启动自己回来；
 *  2. 内容漂移即还原——用户改了内置技能里的文件，下次启动覆盖回随包版本
 *     （内置能力的定义就是「由插件版本决定」，不是「由用户副本决定」）。
 *     判据是**重算目标目录的实际内容**再跟 stamp 比对，不是只读 stamp——
 *     只读 stamp 等于用户改坏了也永远发现不了；
 *  3. 内容 hash 比对——同版本不重写，212 个文件 / 2.9MB 的复制只在真正
 *     变化时发生（源目录内容变了才重装，忘了 bump 版本号也不会漏）。
 *
 * 安全阀：如果目标目录存在但没有本模块写的 stamp，说明那是用户自己放的同名
 * 技能而不是本插件的产物——绝不覆盖，只告警。误毁用户资产比"内置没装上"
 * 严重得多。
 *
 * 全程容错：任何一步失败只记日志，插件其余能力照常。技能装不上不该让
 * 整个 DSH 起不来。
 */

import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { copyFile, cp, mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

/** 物化目标 root（与 dsh-skill-filesystem 的 user-dsh root 同址）。 */
function dshSkillsRoot(): string {
  return join(process.env.DSH_HOME ?? join(homedir(), '.dsh'), 'skills')
}

/**
 * 随包分发的技能源目录。
 *
 * 路径要兼容两种产物形态：tsdown 把 host 打成单文件 lib/index.js（`..` 即包根），
 * tsc 则保留目录结构 lib/triad/bundled-skills.js（`../..` 才是包根）。
 * 同一手法见 shot/renderer.ts 的 MERMAID_GZ。
 */
function bundledRoot(): string | undefined {
  const candidates = [
    join(fileURLToPath(new URL('..', import.meta.url)), 'assets', 'skills'),
    join(fileURLToPath(new URL('../..', import.meta.url)), 'assets', 'skills'),
  ]
  return candidates.find(path => existsSync(path))
}

/** 装到目标目录下的标记文件。记录内容 hash，是「这个目录归本插件管」的凭据。 */
const STAMP_NAME = '.dsh-chat-plus-bundled.json'

interface Stamp {
  /** 写入时的技能名（目录名）。 */
  readonly skill: string
  /** 源目录全部文件的相对路径 + 内容 hash（按路径排序后串起来再 hash 一次）。 */
  readonly digest: string
  /** 随包文件数，仅供人读排查。 */
  readonly files: number
}

interface SourceFile {
  /** 相对源根的路径，统一用 posix 分隔符（跨平台稳定）。 */
  readonly rel: string
  readonly abs: string
}

/** 递归列出目录下所有文件（跳过标记文件自身——它不属于技能内容）。 */
async function listFiles(root: string, current = root): Promise<SourceFile[]> {
  const entries = await readdir(current, { withFileTypes: true })
  const out: SourceFile[] = []
  for (const entry of entries) {
    if (entry.name === STAMP_NAME) continue
    const abs = join(current, entry.name)
    if (entry.isDirectory()) {
      out.push(...await listFiles(root, abs))
    } else if (entry.isFile()) {
      out.push({ rel: relative(root, abs).split(sep).join('/'), abs })
    }
  }
  return out.sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0))
}

/**
 * 源目录内容指纹。
 *
 * 刻意用「内容 hash」而不是 mtime 或文件数：Windows 复制会重写 mtime，
 * 而改了内容不改文件数是最常见的漏更新方式。只有内容进指纹，才谈得上
 * "改了源就一定重装"。
 */
async function digestOf(files: readonly SourceFile[]): Promise<string> {
  const hash = createHash('sha256')
  for (const file of files) {
    hash.update(file.rel)
    hash.update('\0')
    hash.update(await readFile(file.abs))
    hash.update('\0')
  }
  return hash.digest('hex')
}

async function readStamp(dir: string): Promise<Stamp | undefined> {
  try {
    const raw = await readFile(join(dir, STAMP_NAME), 'utf8')
    const parsed = JSON.parse(raw) as Partial<Stamp>
    return typeof parsed.digest === 'string' ? (parsed as Stamp) : undefined
  } catch {
    return undefined
  }
}

/** 目录是否像是个技能（有 SKILL.md）。用于区分「残留空目录」与「用户资产」。 */
async function looksLikeSkill(dir: string): Promise<boolean> {
  return existsSync(join(dir, 'SKILL.md'))
}

export interface BundledSkillResult {
  readonly skill: string
  /** installed = 全新装上；updated = 版本漂移后覆盖；skipped = 已是最新。 */
  readonly action: 'installed' | 'updated' | 'skipped'
  /** 用户同名资产被保护、未被覆盖。 */
  readonly protectedUserCopy?: boolean
  readonly error?: string
}

/**
 * 同步单个技能。返回结果供调用方记日志，自身不抛——失败不是致命问题。
 */
export async function installBundledSkill(
  sourceDir: string,
  name: string,
  targetRoot: string,
): Promise<BundledSkillResult> {
  const target = join(targetRoot, name)
  try {
    const files = await listFiles(sourceDir)
    if (files.length === 0) return { skill: name, action: 'skipped', error: '源目录为空' }
    const digest = await digestOf(files)
    const stamp: Stamp = { skill: name, digest, files: files.length }
    const existing = await readStamp(target)

    if (existing !== undefined) {
      // 三个条件全满足才跳过：stamp 记的版本 == 随包版本，且目标目录的
      // **实际内容**确实还是当初装进去的那份。
      //
      // 第二个条件不能省：只比 stamp 就等于「用户改坏了也发现不了」——stamp
      // 不会自己变，重算目标内容才会发现漂移。这是「内置即由插件版本决定」
      // 这条语义的落点，也是本模块最贵的一步（212 文件 / 2.9MB 的 hash，
      // 几十毫秒，每次启动一次）。
      if (existing.digest === digest) {
        const current = await digestOf(await listFiles(target))
        if (current === existing.digest) return { skill: name, action: 'skipped' }
      }
    } else if (await looksLikeSkill(target)) {
      // 目标有 SKILL.md 但没有我们的 stamp：用户自己放的同名技能。
      // 覆盖它等于毁掉用户资产，宁可内置这次没装上。
      return { skill: name, action: 'skipped', protectedUserCopy: true }
    } else if (existsSync(target)) {
      // 残留的空壳目录（上次装到一半崩了），直接清掉重来。
      await rm(target, { recursive: true, force: true })
    }

    // 先把完整内容铺到同盘暂存目录，落盘失败不会污染已装好的技能。
    await mkdir(targetRoot, { recursive: true })
    const staging = await mkdtemp(join(targetRoot, `.${name}-staging-`))
    try {
      for (const file of files) {
        const dest = join(staging, file.rel)
        await mkdir(dirname(dest), { recursive: true })
        await copyFile(file.abs, dest)
      }
      await writeFile(join(staging, STAMP_NAME), JSON.stringify(stamp, null, 2), 'utf8')
      // 换装既有目录：清空目标的内容再铺新的，**不动目标目录本身**。
      //
      // 曾试过「rename 旧目录到 .retired → rename 暂存到正式名」，语义更
      // 原子，但在 Windows 上必挂：刚被 rename 走的目录句柄尚未释放，紧接
      // 着往同一路径 rename 就 EPERM（Linux/macOS 无此问题）。所以退到
      // 「原目录保留 + 内容整体替换」。
      //
      // 半成品窗口由 stamp 收口：stamp 在复制全部完成后才出现在目标目录，
      // 中途崩溃留下的残缺目录 stamp 要么缺失、要么与实况不符，下次启动
      // 必然重装。
      await mkdir(target, { recursive: true })
      for (const entry of await readdir(target)) {
        await rm(join(target, entry), { recursive: true, force: true })
      }
      await cp(staging, target, { recursive: true, force: true })
    } finally {
      await rm(staging, { recursive: true, force: true }).catch(() => undefined)
    }
    return { skill: name, action: existing === undefined ? 'installed' : 'updated' }
  } catch (error) {
    return { skill: name, action: 'skipped', error: error instanceof Error ? error.message : String(error) }
  }
}

/** 清掉上次崩溃残留的暂存/退役目录。 */
async function sweepStaging(targetRoot: string): Promise<void> {
  let entries: string[]
  try {
    entries = await readdir(targetRoot)
  } catch {
    return
  }
  for (const entry of entries) {
    if (entry.includes('.staging-') || entry.includes('.retired-')) {
      await rm(resolve(targetRoot, entry), { recursive: true, force: true }).catch(() => undefined)
    }
  }
}

/**
 * 物化全部随包技能。由 triad host 在装配时调用。
 *
 * 刻意做成"尽力而为"：读不到源目录（开发态没跑 build、源码树直接跑）就
 * 安静跳过，不当成错误——本地开发时 assets 本来就不该被强制物化。
 */
export async function installBundledSkills(
  logger: { info?: (message: string) => void; warn?: (message: string) => void } | undefined,
): Promise<BundledSkillResult[]> {
  const source = bundledRoot()
  if (source === undefined) {
    logger?.info?.('[dsh-chat-plus] bundled skills: source dir absent, skipped')
    return []
  }
  const targetRoot = dshSkillsRoot()
  await sweepStaging(targetRoot).catch(() => undefined)
  const results: BundledSkillResult[] = []
  let entries: import('node:fs').Dirent[]
  try {
    entries = await readdir(source, { withFileTypes: true })
  } catch (error) {
    logger?.warn?.(`[dsh-chat-plus] bundled skills: read source failed: ${error instanceof Error ? error.message : String(error)}`)
    return []
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const sourceDir = join(source, entry.name)
    const isSkill = await stat(join(sourceDir, 'SKILL.md')).then(() => true).catch(() => false)
    if (!isSkill) continue
    const result = await installBundledSkill(sourceDir, entry.name, targetRoot)
    results.push(result)
    if (result.protectedUserCopy === true) {
      logger?.warn?.(
        `[dsh-chat-plus] bundled skill "${entry.name}": ${join(targetRoot, entry.name)} 已存在且不是本插件安装的，`
        + '已跳过以免覆盖你自己的技能',
      )
    } else if (result.error !== undefined) {
      logger?.warn?.(`[dsh-chat-plus] bundled skill "${entry.name}" install failed: ${result.error}`)
    } else if (result.action !== 'skipped') {
      logger?.info?.(`[dsh-chat-plus] bundled skill "${entry.name}" ${result.action} -> ${join(targetRoot, entry.name)}`)
    }
  }
  return results
}
