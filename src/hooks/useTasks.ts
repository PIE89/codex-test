import { useEffect, useState } from 'react'
import type { Task } from '../types/task'
import { loadTasks, saveTasks } from '../utils/taskStorage'

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = (text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      isImportant: false,
      isCompleted: false,
    }

    setTasks((currentTasks) => [...currentTasks, newTask])
  }

  const updateTask = (id: string, text: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === id ? { ...task, text } : task)),
    )
  }

  const toggleImportant = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, isImportant: !task.isImportant }
          : task,
      ),
    )
  }

  const toggleCompleted = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, isCompleted: !task.isCompleted }
          : task,
      ),
    )
  }

  const deleteTask = (id: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
  }

  return {
    tasks,
    addTask,
    updateTask,
    toggleImportant,
    toggleCompleted,
    deleteTask,
  }
}
