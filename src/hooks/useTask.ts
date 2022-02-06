import { useState } from 'react'

export type TaskState<TaskResult> =
  | {
      taskStatus: 'taskNotInitialized'
    }
  | { taskStatus: 'taskActive' }
  | {
      taskStatus: 'taskSuccessful'
      taskResult: TaskResult
    }
  | { taskStatus: 'taskError'; taskError: any }

export function useTask<
  SomeTask extends (...args: Array<any>) => Promise<any> = (
    ...args: Array<any>
  ) => Promise<any>,
  TaskResult = ReturnType<SomeTask> extends Promise<infer T> ? T : never
>(
  someTask: SomeTask
): [TaskState<TaskResult>, (...args: Parameters<typeof someTask>) => void] {
  const [taskState, setTaskState] = useState<TaskState<TaskResult>>({
    taskStatus: 'taskNotInitialized',
  })
  const triggerTask: (...args: Parameters<typeof someTask>) => void = (
    ...args
  ) => {
    someTask(...args)
      .then((taskResult) => {
        setTaskState({
          taskResult,
          taskStatus: 'taskSuccessful',
        })
      })
      .catch((taskError) => {
        setTaskState({
          taskError,
          taskStatus: 'taskError',
        })
      })
    setTaskState({
      taskStatus: 'taskActive',
    })
  }
  return [taskState, triggerTask]
}
