import { type KeyboardEvent } from 'react'
import { MAX_TASK_LENGTH } from '../../constants/task'
import type { Task } from '../../types/task'
import './TaskItem.css'

type TaskItemProps = {
  task: Task
  isEditing: boolean
  editingText: string
  onStartEditing: (task: Task) => void
  onEditingTextChange: (value: string) => void
  onCancelEditing: () => void
  onSaveEditing: (task: Task, text: string) => void
  onToggleImportant: (id: string) => void
  onToggleCompleted: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskItem({
  task,
  isEditing,
  editingText,
  onStartEditing,
  onEditingTextChange,
  onCancelEditing,
  onSaveEditing,
  onToggleImportant,
  onToggleCompleted,
  onDelete,
}: TaskItemProps) {
  const normalizedEditingText = editingText.trim()
  const canSave =
    normalizedEditingText.length > 0 && normalizedEditingText !== task.text

  const startEditing = () => {
    onStartEditing(task)
  }

  const saveEditing = () => {
    if (!canSave) {
      return
    }

    onSaveEditing(task, normalizedEditingText)
  }

  const handleEditingKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      saveEditing()
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      onCancelEditing()
    }
  }

  return (
    <li
      className={`task-item ${task.isImportant ? 'is-important' : ''} ${task.isCompleted ? 'is-completed' : ''}`}
    >
      <label className="completion-control">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onToggleCompleted(task.id)}
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

      {isEditing ? (
        <div className="task-edit-field">
          <label htmlFor={`task-edit-${task.id}`}>Новое название задачи</label>
          <input
            id={`task-edit-${task.id}`}
            type="text"
            value={editingText}
            onChange={(event) =>
              onEditingTextChange(event.target.value.slice(0, MAX_TASK_LENGTH))
            }
            onKeyDown={handleEditingKeyDown}
            maxLength={MAX_TASK_LENGTH}
            aria-describedby={`task-edit-hint-${task.id}`}
            autoFocus
          />
          <span id={`task-edit-hint-${task.id}`}>
            {editingText.length} / {MAX_TASK_LENGTH}
          </span>
        </div>
      ) : (
        <span className="task-text">
          <span className="task-text-active" aria-hidden={task.isCompleted}>
            {task.text}
          </span>
          <span className="task-text-completed" aria-hidden={!task.isCompleted}>
            {task.text}
          </span>
        </span>
      )}

      <div className="task-actions">
        {isEditing ? (
          <>
            <button
              className="save-button"
              type="button"
              onClick={saveEditing}
              disabled={!canSave}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="m4.5 10 3.2 3.2L15.5 5.5" />
              </svg>
              <span>Сохранить</span>
            </button>
            <button className="cancel-button" type="button" onClick={onCancelEditing}>
              <span>Отмена</span>
            </button>
          </>
        ) : (
          <button
            className="edit-button"
            type="button"
            onClick={startEditing}
            aria-label={`Редактировать задачу «${task.text}»`}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="m4 14-.7 3 3-.7L15 7.6 12.4 5 4 14Z" />
              <path d="m10.8 6.6 2.6 2.6" />
            </svg>
            <span>Редактировать</span>
          </button>
        )}

        <button
          className="important-button"
          type="button"
          onClick={() => onToggleImportant(task.id)}
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
          onClick={() => onDelete(task.id)}
          aria-label={`Удалить задачу «${task.text}»`}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4 6h12M8 3h4l1 3H7l1-3ZM6 6l.7 10h6.6L14 6M8.5 9v4M11.5 9v4" />
          </svg>
          <span>Удалить</span>
        </button>
      </div>
    </li>
  )
}
