import { MAX_TASK_LENGTH, TASKS_STORAGE_KEY } from '../constants/task'
import type { Task } from '../types/task'

const parseTask = (value: unknown): Task | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const task = value as Partial<Task>

  if (
    typeof task.id !== 'string' ||
    task.id.length === 0 ||
    typeof task.text !== 'string' ||
    task.text.trim().length === 0 ||
    task.text.length > MAX_TASK_LENGTH ||
    typeof task.isImportant !== 'boolean' ||
    (task.isCompleted !== undefined && typeof task.isCompleted !== 'boolean')
  ) {
    return null
  }

  return {
    id: task.id,
    text: task.text,
    isImportant: task.isImportant,
    isCompleted: task.isCompleted ?? false,
  }
}

export const loadTasks = (): Task[] => {
  try {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY)

    if (!storedTasks) {
      return []
    }

    const parsedTasks: unknown = JSON.parse(storedTasks)

    if (!Array.isArray(parsedTasks)) {
      return []
    }

    return parsedTasks
      .map(parseTask)
      .filter((task): task is Task => task !== null)
  } catch {
    return []
  }
}

export const saveTasks = (tasks: Task[]) => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // The app remains usable if browser storage is unavailable or full.
  }
}
