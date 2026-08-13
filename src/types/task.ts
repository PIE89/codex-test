export type Task = {
  id: string
  text: string
  isImportant: boolean
  isCompleted: boolean
}

export type TaskStatusFilter = 'all' | 'important' | 'completed'
