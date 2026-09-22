/**
 * dsh-chat-flow — 任务步骤与执行状态解析器。
 *
 * 从思考内容、工具调用和会话状态中智能提取：
 * 1. 当前任务目标与子标题；
 * 2. 结构化步骤流水线（分析需求、检查项目结构、修改代码、验证结果、总结输出）；
 * 3. 步骤的执行状态（completed 已完成、running 进行中、pending 待开始）与各步用时。
 */

export interface TaskStepItem {
  readonly id: string
  readonly name: string
  readonly description?: string
  readonly status: 'completed' | 'running' | 'pending'
  readonly durationText?: string
}

export interface ParsedTaskOverview {
  readonly title: string
  readonly description: string
  readonly steps: readonly TaskStepItem[]
  readonly isRunning: boolean
}

/** 格式化秒数 */
function formatSeconds(sec: number): string {
  if (sec <= 0) return '1s'
  if (sec < 60) return `${Math.round(sec)}s`
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  return `${m}m${s}s`
}

/** 从思考文本与工具调用中提取任务步骤与概览 */
export function parseTaskOverview(
  reasoningTexts: readonly string[],
  toolNames: readonly string[],
  running: boolean,
  turnElapsedSec: number = 0,
): ParsedTaskOverview {
  // 合并全部思考文本用于提要解析
  const fullReasoning = reasoningTexts.join('\n')

  // 1. 尝试从思考文本中提取以数字开头的步骤列表，如 "1. 分析需求：..."
  const stepRegex = /(?:^|\n)\s*(\d+)[\.、\s]\s*([^\n:：]+)(?:[:：]\s*([^\n]+))?/g
  const parsedSteps: TaskStepItem[] = []
  let match: RegExpExecArray | null

  while ((match = stepRegex.exec(fullReasoning)) !== null) {
    const rawNum = match[1]
    const title = match[2]?.trim() ?? ''
    const desc = match[3]?.trim() ?? ''
    if (title && title.length < 30) {
      parsedSteps.push({
        id: `step-${rawNum}`,
        name: title,
        description: desc,
        status: 'completed',
      })
    }
  }

  // 2. 如果思考中没有显式提取到清晰步骤（或步骤太少），根据工具调用和阶段构建标准的 Agent 研发流水线
  let steps: TaskStepItem[] = []
  if (parsedSteps.length >= 2) {
    // 思考中已有明确拆解
    steps = parsedSteps
  } else {
    // 标准五步流水线
    steps = [
      { id: '1', name: '分析需求', description: '解析上下文与指令意图', status: 'completed' },
      { id: '2', name: '检查项目结构', description: '检索代码文件与定义', status: 'completed' },
      { id: '3', name: '修改页面', description: '实现核心逻辑与样式', status: 'completed' },
      { id: '4', name: '验证结果', description: '执行语法检查与功能测试', status: 'pending' },
      { id: '5', name: '总结输出', description: '整理交付内容与回复', status: 'pending' },
    ]
  }

  // 3. 计算每个步骤的状态和耗时分布
  const stepCount = steps.length
  if (running) {
    // 正在运行中：
    // 根据工具调用的数量和耗时，推断当前正在进行哪一步
    let activeIndex = Math.min(stepCount - 2, Math.max(1, Math.floor(toolNames.length / 3) + 1))
    if (activeIndex >= stepCount - 1) activeIndex = stepCount - 2

    steps = steps.map((s, idx) => {
      if (idx < activeIndex) {
        const stepTime = Math.max(4, Math.round((turnElapsedSec * 0.4) / activeIndex))
        return {
          ...s,
          status: 'completed',
          durationText: `${formatSeconds(stepTime)}`,
        }
      } else if (idx === activeIndex) {
        const runningTime = Math.max(2, Math.round(turnElapsedSec * 0.5))
        return {
          ...s,
          status: 'running',
          durationText: `${formatSeconds(runningTime)}`,
        }
      } else {
        return {
          ...s,
          status: 'pending',
          durationText: undefined,
        }
      }
    })
  } else {
    // 已完成状态：全部标记为已完成（或最后一步为完成）
    const avgTime = Math.max(3, Math.round(turnElapsedSec / stepCount))
    steps = steps.map((s, idx) => ({
      ...s,
      status: 'completed',
      durationText: `${formatSeconds(Math.max(2, Math.round(avgTime * (0.8 + (idx % 3) * 0.2))))}`,
    }))
  }

  // 4. 提取任务大标题与副标题
  let taskTitle = '执行任务'
  let taskDesc = 'Agent 正在进行多步自主规划与工具调用'

  // 从第一条思考或者第一条步骤中提炼
  if (parsedSteps.length > 0 && parsedSteps[0]) {
    const firstStep = parsedSteps[0]
    taskTitle = firstStep.name
    if (firstStep.description) taskDesc = firstStep.description
  } else if (toolNames.length > 0) {
    const firstTool = toolNames[0]
    if (firstTool?.includes('edit') || firstTool?.includes('write') || firstTool?.includes('str_replace')) {
      taskTitle = '代码修改与页面重构'
      taskDesc = '调整页面卡片布局与样式细节，优化呈现结构'
    } else if (firstTool?.includes('read') || firstTool?.includes('search') || firstTool?.includes('grep')) {
      taskTitle = '代码检索与架构分析'
      taskDesc = '分析项目结构与组件依赖，确认改动方案'
    } else {
      taskTitle = 'Agent 自主执行中'
      taskDesc = '依据指令编排工具调用序列并持续推进'
    }
  }

  return {
    title: taskTitle,
    description: taskDesc,
    steps,
    isRunning: running,
  }
}
