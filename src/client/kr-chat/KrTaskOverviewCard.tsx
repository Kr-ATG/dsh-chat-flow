/**
 * dsh-chat-flow — 任务概览卡片（一个卡片框统领全部任务项）。
 * 呈现 DSH 官方真实的 todo / task 列表。
 * 若当前轮次或对话未产生任何任务，则完全不显示本卡片。
 */
import { memo, useState } from 'react'

export interface DshTaskItem {
  readonly id: string
  readonly content: string
  readonly status: 'pending' | 'in_progress' | 'completed'
}

export interface TaskOverviewCardProps {
  readonly tasks: readonly DshTaskItem[]
  readonly isRunning?: boolean
}

export const KrTaskOverviewCard = memo(function KrTaskOverviewCard({
  tasks,
  isRunning = false,
}: TaskOverviewCardProps) {
  const [collapsed, setCollapsed] = useState(false)

  // 核心规则：若对话中没有任务，直接返回 null，不占用任何视觉空间
  if (!tasks || tasks.length === 0) {
    return null
  }

  const doneCount = tasks.filter((t) => t.status === 'completed').length
  const activeCount = tasks.filter((t) => t.status === 'in_progress').length
  const allDone = doneCount === tasks.length
  const percent = Math.round((doneCount / tasks.length) * 100)

  const progressText = allDone
    ? `${tasks.length} 项已完成`
    : activeCount > 0
    ? `${doneCount}/${tasks.length} 完成 · 进行中`
    : `${doneCount}/${tasks.length} 完成`

  return (
    <div className="kr-card kr-card--task">
      {/* 卡片头部 */}
      <div className="kr-card__header" onClick={() => setCollapsed(!collapsed)}>
        <span className="kr-card__icon">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M13.328 9.7v1.28H7.28V9.7h6.048zM13.328 2.97v1.28H7.28V2.97h6.048z" fill="currentColor"/>
            <path d="M4.645 10.336a1.283 1.283 0 1 1-2.566 0 1.283 1.283 0 0 1 2.566 0zm1.28 0c0 1.415-1.148 2.563-2.563 2.563A2.563 2.563 0 0 1 .8 10.336c0-1.415 1.147-2.562 2.562-2.562 1.415 0 2.563 1.147 2.563 2.562z" fill="currentColor"/>
            <path d="M4.645 3.612a1.283 1.283 0 1 1-2.565 0 1.283 1.283 0 0 1 2.565 0zm1.28 0C5.925 5.027 4.778 6.175 3.362 6.175A2.563 2.563 0 0 1 .8 3.612C.8 2.197 1.947 1.05 3.362 1.05c1.416 0 2.563 1.147 2.563 2.562z" fill="currentColor"/>
          </svg>
        </span>
        <span className="kr-card__title">任务概览</span>
        <span className={`kr-card__badge ${isRunning || activeCount > 0 ? 'kr-card__badge--running' : 'kr-card__badge--done'}`}>
          {progressText}
        </span>
        <span className="kr-card__chevron" data-collapsed={collapsed ? 'true' : 'false'}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2.5 4.5 6 8 9.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* 极简细平滑进度条（2.5px，轻量雅致） */}
      {!collapsed && (
        <div className="kr-task-progress-line">
          <div
            className="kr-task-progress-line__fill"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      {/* 任务列表（整洁单层卡片排布，无俄式套盒，去除非必要重复徽标） */}
      {!collapsed && (
        <div className="kr-task-list">
          {tasks.map((task, index) => {
            const isCompleted = task.status === 'completed'
            const isInProgress = task.status === 'in_progress'

            return (
              <div
                key={task.id || index}
                className={`kr-task-item kr-task-item--${task.status}`}
              >
                <span className="kr-task-item__icon">
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <circle cx="7" cy="7" r="6.2" stroke="currentColor" strokeWidth="1.2" />
                      <path
                        d="M10.963 5.714L7.702 8.976c-.222.221-.424.425-.61.574-.194.157-.429.303-.728.35a1.29 1.29 0 0 1-.479 0c-.3-.047-.534-.193-.729-.35-.185-.149-.387-.353-.61-.574L3.035 7.464l.928-.928 1.512 1.512c.242.242.387.386.504.48.107.086.13.079.111.076.045.007.091.007.136 0-.019.003.004-.004.111-.076.117-.094.262-.238.504-.48l3.262-3.262.928.928z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : isInProgress ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'kr-spin 1.2s linear infinite' }}>
                      <circle cx="7" cy="7" r="6.2" stroke="currentColor" strokeWidth="1.2" strokeDasharray="7 7" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6.2" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2.4 2.4" />
                    </svg>
                  )}
                </span>

                <div className="kr-task-item__content">
                  {task.content}
                </div>

                {/* 仅在进行中时提供微小状态标识，已完成依靠对勾图标自然传达，杜绝视觉垃圾 */}
                {isInProgress && (
                  <span className="kr-task-item__tag kr-task-item__tag--running">
                    进行中
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
})
