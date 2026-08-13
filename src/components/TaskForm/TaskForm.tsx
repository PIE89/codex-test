import { useState, type FormEvent } from 'react'
import { MAX_TASK_LENGTH } from '../../constants/task'
import './TaskForm.css'

type TaskFormProps = {
  onAddTask: (text: string) => void
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [taskText, setTaskText] = useState('')
  const normalizedTaskText = taskText.trim()
  const canSubmit =
    normalizedTaskText.length > 0 &&
    normalizedTaskText.length <= MAX_TASK_LENGTH

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    onAddTask(normalizedTaskText)
    setTaskText('')
  }

  return (
    <div className="form-panel">
      <form id="task-form" className="task-form" onSubmit={handleSubmit}>
        <label htmlFor="task-input">Название задачи</label>

        <div className="input-row">
          <input
            id="task-input"
            name="task"
            type="text"
            value={taskText}
            onChange={(event) =>
              setTaskText(event.target.value.slice(0, MAX_TASK_LENGTH))
            }
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
  )
}
