import type { Task, TaskStatusFilter } from '../../types/task'
import { TaskFilters } from '../TaskFilters/TaskFilters'
import { TaskItem } from '../TaskItem/TaskItem'
import './TaskList.css'

type TaskListProps = {
  tasks: Task[]
  filteredTasks: Task[]
  filterText: string
  statusFilter: TaskStatusFilter
  editingTaskId: string | null
  editingText: string
  importantCount: number
  completedCount: number
  hasActiveFilter: boolean
  onFilterTextChange: (value: string) => void
  onStatusFilterChange: (value: TaskStatusFilter) => void
  onResetFilters: () => void
  onStartEditing: (task: Task) => void
  onEditingTextChange: (value: string) => void
  onCancelEditing: () => void
  onSaveEditing: (task: Task, text: string) => void
  onToggleImportant: (id: string) => void
  onToggleCompleted: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskList({
  tasks,
  filteredTasks,
  filterText,
  statusFilter,
  editingTaskId,
  editingText,
  importantCount,
  completedCount,
  hasActiveFilter,
  onFilterTextChange,
  onStatusFilterChange,
  onResetFilters,
  onStartEditing,
  onEditingTextChange,
  onCancelEditing,
  onSaveEditing,
  onToggleImportant,
  onToggleCompleted,
  onDelete,
}: TaskListProps) {
  return (
    <section className="tasks-section" aria-labelledby="tasks-title">
      <div className="tasks-header">
        <div>
          <p className="tasks-kicker">В фокусе</p>
          <h2 id="tasks-title">Ваши задачи</h2>
        </div>
        <span
          className="tasks-count"
          aria-label={
            hasActiveFilter
              ? `Найдено задач: ${filteredTasks.length} из ${tasks.length}`
              : `Количество задач: ${tasks.length}`
          }
        >
          {filteredTasks.length.toString().padStart(2, '0')}
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
        <>
          <TaskFilters
            filterText={filterText}
            statusFilter={statusFilter}
            totalCount={tasks.length}
            importantCount={importantCount}
            completedCount={completedCount}
            filteredCount={filteredTasks.length}
            hasActiveFilter={hasActiveFilter}
            onFilterTextChange={onFilterTextChange}
            onStatusFilterChange={onStatusFilterChange}
          />

          {filteredTasks.length === 0 ? (
            <div className="empty-state filter-empty-state">
              <span className="empty-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="10" cy="10" r="6" />
                  <path d="m14.5 14.5 5 5" />
                </svg>
              </span>
              <div>
                <strong>Совпадений не найдено</strong>
                <p>Попробуйте изменить запрос или очистить фильтр.</p>
              </div>
              <button type="button" onClick={onResetFilters}>
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <ol className="task-list">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isEditing={editingTaskId === task.id}
                  editingText={editingText}
                  onStartEditing={onStartEditing}
                  onEditingTextChange={onEditingTextChange}
                  onCancelEditing={onCancelEditing}
                  onSaveEditing={onSaveEditing}
                  onToggleImportant={onToggleImportant}
                  onToggleCompleted={onToggleCompleted}
                  onDelete={onDelete}
                />
              ))}
            </ol>
          )}
        </>
      )}
    </section>
  )
}
