import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react'
import './App.css'

const MAX_TASK_LENGTH = 80
const TASKS_STORAGE_KEY = 'focus.task-tracker.tasks'

type Task = {
  id: string
  text: string
  isImportant: boolean
  isCompleted: boolean
}

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

const loadTasks = (): Task[] => {
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

function App() {
  const [taskText, setTaskText] = useState('')
  const [tasks, setTasks] = useState<Task[]>(loadTasks)

  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // The app remains usable if browser storage is unavailable or full.
    }
  }, [tasks])

  const normalizedTaskText = taskText.trim()
  const canSubmit =
    normalizedTaskText.length > 0 &&
    normalizedTaskText.length <= MAX_TASK_LENGTH

  const addTask = () => {
    if (!canSubmit) {
      return
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: normalizedTaskText,
      isImportant: false,
      isCompleted: false,
    }

    setTasks((currentTasks) => [...currentTasks, newTask])
    setTaskText('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    addTask()
  }

  const handleTaskKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addTask()
    }
  }

  const handleTaskChange = (value: string) => {
    setTaskText(value.slice(0, MAX_TASK_LENGTH))
  }

  const handleToggleImportant = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, isImportant: !task.isImportant }
          : task,
      ),
    )
  }

  const handleToggleCompleted = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, isCompleted: !task.isCompleted }
          : task,
      ),
    )
  }

  const handleDelete = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id),
    )
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
          Task tracker · Этап 04
        </div>
      </header>

      <section className="task-card" aria-labelledby="page-title">
        <div className="task-card-top">
          <div className="card-copy">
            <p className="eyebrow">
              <span>04</span>
              Выполнение задач
            </p>

            <h1 id="page-title">
              Что важно сделать <em>сегодня?</em>
            </h1>

            <p className="intro">
              Добавляйте задачи, отмечайте главное и освобождайте список от
              выполненного.
            </p>
          </div>

          <div className="form-panel">
            <form id="task-form" className="task-form" onSubmit={handleSubmit}>
              <label htmlFor="task-input">Название задачи</label>

              <div className="input-row">
                <input
                  id="task-input"
                  name="task"
                  type="text"
                  value={taskText}
                  onChange={(event) => handleTaskChange(event.target.value)}
                  onKeyDown={handleTaskKeyDown}
                  maxLength={MAX_TASK_LENGTH}
                  placeholder="Например, закончить презентацию"
                  autoComplete="off"
                  aria-describedby="task-hint"
                />

                <button type="submit" disabled={!canSubmit}>
                  <span>Добавить</span>
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4 10h12M11 5l5 5-5 5" />
                  </svg>
                </button>
              </div>

              <div className="form-meta" id="task-hint">
                <span>
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12Z" />
                    <path d="M8 7.2v3.3M8 5.1h.01" />
                  </svg>
                  До {MAX_TASK_LENGTH} символов
                </span>
                <span className={taskText.length === MAX_TASK_LENGTH ? 'at-limit' : ''}>
                  {taskText.length} / {MAX_TASK_LENGTH}
                </span>
              </div>
            </form>
          </div>
        </div>

        <section className="tasks-section" aria-labelledby="tasks-title">
          <div className="tasks-header">
            <div>
              <p className="tasks-kicker">В фокусе</p>
              <h2 id="tasks-title">Ваши задачи</h2>
            </div>
            <span className="tasks-count" aria-label={`Количество задач: ${tasks.length}`}>
              {tasks.length.toString().padStart(2, '0')}
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M7 7h10M7 12h7M7 17h4" />
                  <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
                </svg>
              </span>
              <div>
                <strong>Задач пока нет</strong>
                <p>Добавьте первую — она появится здесь.</p>
              </div>
            </div>
          ) : (
            <ol className="task-list">
              {tasks.map((task) => (
                <li
                  className={`task-item ${task.isImportant ? 'is-important' : ''} ${task.isCompleted ? 'is-completed' : ''}`}
                  key={task.id}
                >
                  <label className="completion-control">
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => handleToggleCompleted(task.id)}
                      aria-label={
                        task.isCompleted
                          ? `Вернуть задачу «${task.text}» в работу`
                          : `Отметить задачу «${task.text}» выполненной`
                      }
                    />
                    <span className="completion-indicator" aria-hidden="true">
                      <span className="task-number" />
                      <svg viewBox="0 0 20 20">
                        <path d="m5 10 3.2 3.2L15.5 6" />
                      </svg>
                    </span>
                  </label>

                  <span className="task-text">
                    <span
                      className="task-text-active"
                      aria-hidden={task.isCompleted}
                    >
                      {task.text}
                    </span>
                    <span
                      className="task-text-completed"
                      aria-hidden={!task.isCompleted}
                    >
                      {task.text}
                    </span>
                  </span>

                  <div className="task-actions">
                    <button
                      className="important-button"
                      type="button"
                      onClick={() => handleToggleImportant(task.id)}
                      aria-pressed={task.isImportant}
                    >
                      <svg viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M10 2.8 12 7l4.6.7-3.3 3.2.8 4.5-4.1-2.1-4.1 2.1.8-4.5-3.3-3.2L8 7l2-4.2Z" />
                      </svg>
                      <span>{task.isImportant ? 'Отменить' : 'Важно'}</span>
                    </button>

                    <button
                      className="delete-button"
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      aria-label={`Удалить задачу «${task.text}»`}
                    >
                      <svg viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M4 6h12M8 3h4l1 3H7l1-3ZM6 6l.7 10h6.6L14 6M8.5 9v4M11.5 9v4" />
                      </svg>
                      <span>Удалить</span>
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
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
