import type { TaskStatusFilter } from '../../types/task'
import './TaskFilters.css'

type TaskFiltersProps = {
  filterText: string
  statusFilter: TaskStatusFilter
  totalCount: number
  importantCount: number
  completedCount: number
  filteredCount: number
  hasActiveFilter: boolean
  onFilterTextChange: (value: string) => void
  onStatusFilterChange: (value: TaskStatusFilter) => void
}

const statusOptions = [
  { value: 'all', title: 'Все', subtitle: 'Полный список' },
  { value: 'important', title: 'Важные', subtitle: 'Главные задачи' },
  { value: 'completed', title: 'Выполненные', subtitle: 'Готовые задачи' },
] as const

export function TaskFilters({
  filterText,
  statusFilter,
  totalCount,
  importantCount,
  completedCount,
  filteredCount,
  hasActiveFilter,
  onFilterTextChange,
  onStatusFilterChange,
}: TaskFiltersProps) {
  const counts: Record<TaskStatusFilter, number> = {
    all: totalCount,
    important: importantCount,
    completed: completedCount,
  }

  return (
    <>
      <fieldset className="status-filters">
        <legend>Показать задачи</legend>

        {statusOptions.map((option) => (
          <label className="status-filter-card" key={option.value}>
            <input
              type="radio"
              name="status-filter"
              value={option.value}
              checked={statusFilter === option.value}
              onChange={() => onStatusFilterChange(option.value)}
            />
            <span className="status-filter-content">
              <span className="status-filter-icon" aria-hidden="true">
                {option.value === 'all' && (
                  <svg viewBox="0 0 20 20">
                    <path d="M5 5h10M5 10h10M5 15h10" />
                  </svg>
                )}
                {option.value === 'important' && (
                  <svg viewBox="0 0 20 20">
                    <path d="M10 2.8 12 7l4.6.7-3.3 3.2.8 4.5-4.1-2.1-4.1 2.1.8-4.5-3.3-3.2L8 7l2-4.2Z" />
                  </svg>
                )}
                {option.value === 'completed' && (
                  <svg viewBox="0 0 20 20">
                    <path d="m4.5 10 3.2 3.2L15.5 5.5" />
                  </svg>
                )}
              </span>
              <span className="status-filter-copy">
                <strong>{option.title}</strong>
                <small>{option.subtitle}</small>
              </span>
              <span className="status-filter-count">{counts[option.value]}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <form
        className="filter-form"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="task-filter">Найти задачу</label>

        <div className="filter-input-wrap">
          <svg className="filter-search-icon" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="m13 13 4 4" />
          </svg>
          <input
            id="task-filter"
            name="task-filter"
            type="search"
            value={filterText}
            onChange={(event) => onFilterTextChange(event.target.value)}
            placeholder="Введите название или его часть"
            autoComplete="off"
            aria-describedby="filter-result"
          />
          {filterText.length > 0 && (
            <button
              className="filter-clear"
              type="button"
              onClick={() => onFilterTextChange('')}
              aria-label="Очистить фильтр"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="m6 6 8 8M14 6l-8 8" />
              </svg>
            </button>
          )}
        </div>

        <p className="filter-result" id="filter-result" aria-live="polite">
          {hasActiveFilter
            ? `Найдено: ${filteredCount} из ${totalCount}`
            : `Всего задач: ${totalCount}`}
        </p>
      </form>
    </>
  )
}
