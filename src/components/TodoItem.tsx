interface Todo {
  id: number;
  title: string;
  description: string | null;
  is_completed: number;
  due_date: Date | null;
  created_at: Date;
  updated_at: Date;
  username: string;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, isCompleted: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = todo.due_date && new Date(todo.due_date) < new Date() && !todo.is_completed;

  return (
    <div
      className={`group relative flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
        todo.is_completed
          ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
      }`}
    >
      <input
        type="checkbox"
        checked={todo.is_completed === 1}
        onChange={() => onToggle(todo.id, todo.is_completed)}
        className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />

      <div className="flex-1 min-w-0">
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {todo.username}
          </span>
        </div>
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`text-base font-medium ${
              todo.is_completed
                ? 'line-through text-gray-500 dark:text-gray-400'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {todo.title}
          </h3>
          <button
            onClick={() => onDelete(todo.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            aria-label="Delete todo"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        {todo.description && (
          <p
            className={`mt-1 text-sm ${
              todo.is_completed
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {todo.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
          {todo.due_date && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium ${
                isOverdue
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              }`}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatDate(todo.due_date)}
              {isOverdue && ' (Overdue)'}
            </span>
          )}
          <span className="text-gray-400 dark:text-gray-500">
            Created {formatDate(todo.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
