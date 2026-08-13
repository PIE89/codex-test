import { useState } from 'react'
import { TaskForm } from './components/TaskForm/TaskForm'
import { TaskList } from './components/TaskList/TaskList'
import { useTasks } from './hooks/useTasks'
import type { Task, TaskStatusFilter } from './types/task'
import './App.css'

function App() {
  const {
    tasks,
    addTask,
    updateTask,
    toggleImportant,
    toggleCompleted,
    deleteTask,
  } = useTasks()
  const [filterText, setFilterText] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('all')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  const normalizedFilterText = filterText.trim().toLocaleLowerCase('ru')
  const hasActiveFilter =
    normalizedFilterText.length > 0 || statusFilter !== 'all'
  const importantTasksCount = tasks.filter((task) => task.isImportant).length
  const completedTasksCount = tasks.filter((task) => task.isCompleted).length
  const filteredTasks = tasks.filter((task) => {
    const matchesText = task.text
      .toLocaleLowerCase('ru')
      .includes(normalizedFilterText)
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'important' && task.isImportant) ||
      (statusFilter === 'completed' && task.isCompleted)

    return matchesText && matchesStatus
  })

  const cancelEditing = () => {
    setEditingTaskId(null)
    setEditingText('')
  }

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id)
    setEditingText(task.text)
  }

  const handleStatusFilterChange = (value: TaskStatusFilter) => {
    setStatusFilter(value)
    cancelEditing()
  }

  const resetFilters = () => {
    setFilterText('')
    setStatusFilter('all')
    cancelEditing()
  }

  const saveEditing = (task: Task, text: string) => {
    updateTask(task.id, text)
    cancelEditing()
  }

  const handleDelete = (id: string) => {
    deleteTask(id)

    if (editingTaskId === id) {
      cancelEditing()
    }
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#task-form" aria-label="Focus — к форме задачи">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
          </span>
          <span>FOCUS</span>
        </a>

        <div className="stage-badge">
          <span className="stage-dot" aria-hidden="true" />
          Task tracker · Этап 08
        </div>
      </header>

      <section className="task-card" aria-labelledby="page-title">
        <div className="task-card-top">
          <div className="card-copy">
            <p className="eyebrow">
              <span>08</span>
              Компонентная структура
            </p>

            <h1 id="page-title">
              Что важно сделать <em>сегодня?</em>
            </h1>

            <p className="intro">
              Добавляйте задачи, отмечайте главное и освобождайте список от
              выполненного.
            </p>
          </div>

          <TaskForm onAddTask={addTask} />
        </div>

        <TaskList
          tasks={tasks}
          filteredTasks={filteredTasks}
          filterText={filterText}
          statusFilter={statusFilter}
          editingTaskId={editingTaskId}
          editingText={editingText}
          importantCount={importantTasksCount}
          completedCount={completedTasksCount}
          hasActiveFilter={hasActiveFilter}
          onFilterTextChange={setFilterText}
          onStatusFilterChange={handleStatusFilterChange}
          onResetFilters={resetFilters}
          onStartEditing={startEditing}
          onEditingTextChange={setEditingText}
          onCancelEditing={cancelEditing}
          onSaveEditing={saveEditing}
          onToggleImportant={toggleImportant}
          onToggleCompleted={toggleCompleted}
          onDelete={handleDelete}
        />
      </section>

      <footer className="site-footer">
        <span>Одна задача за раз</span>
        <span className="footer-line" aria-hidden="true" />
        <span>2026</span>
      </footer>
    </main>
  )
}

export default App
