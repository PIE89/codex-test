import { useState, type FormEvent } from 'react'
import './App.css'

const MAX_TASK_LENGTH = 80

function App() {
  const [taskText, setTaskText] = useState('')
  const [submittedTask, setSubmittedTask] = useState('')

  const normalizedTaskText = taskText.trim()
  const canSubmit =
    normalizedTaskText.length > 0 &&
    normalizedTaskText.length <= MAX_TASK_LENGTH

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    setSubmittedTask(normalizedTaskText)
    setTaskText('')
  }

  const handleTaskChange = (value: string) => {
    setTaskText(value.slice(0, MAX_TASK_LENGTH))
    setSubmittedTask('')
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
          Task tracker · Этап 01
        </div>
      </header>

      <section className="task-card" aria-labelledby="page-title">
        <div className="card-copy">
          <p className="eyebrow">
            <span>01</span>
            Новая задача
          </p>

          <h1 id="page-title">
            Что важно сделать <em>сегодня?</em>
          </h1>

          <p className="intro">
            Сформулируйте задачу коротко и ясно. Первый шаг к выполненному делу —
            записать его.
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
                maxLength={MAX_TASK_LENGTH}
                placeholder="Например, закончить презентацию"
                autoComplete="off"
                aria-describedby={
                  submittedTask ? 'task-hint task-status' : 'task-hint'
                }
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

          {submittedTask && (
            <div
              id="task-status"
              className="success-message is-visible"
              role="status"
              aria-live="polite"
            >
              <span className="success-icon" aria-hidden="true">
                <svg viewBox="0 0 20 20">
                  <path d="m5 10 3 3 7-7" />
                </svg>
              </span>
              <span>
                Задача <strong>«{submittedTask}»</strong> принята. Список появится
                на следующем этапе.
              </span>
            </div>
          )}
        </div>

        <div className="card-footer" aria-hidden="true">
          <span>Планируйте.</span>
          <span>Фокусируйтесь.</span>
          <span>Выполняйте.</span>
        </div>
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
