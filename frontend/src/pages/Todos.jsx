import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { todoService } from '../services/todoService';
import { FILTER_OPTIONS, TODO_STATUS } from '../constants';

const Todos = () => {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(FILTER_OPTIONS.ALL);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await todoService.getAllTodos();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos. Please try again.');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    
    if (!newTodoTitle.trim()) {
      setError('Todo title cannot be empty.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const newTodo = await todoService.createTodo(newTodoTitle.trim());
      setTodos([newTodo, ...todos]);
      setNewTodoTitle('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create todo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const updatedTodo = await todoService.toggleTodoStatus(id, currentStatus);
      setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update todo. Please try again.');
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete todo. Please try again.');
    }
  };

  // Filter and calculate stats using useMemo for performance
  const { filteredTodos, pendingCount, completedCount, totalCount } = useMemo(() => {
    const filtered = todos.filter(todo => {
      if (filter === FILTER_OPTIONS.ALL) return true;
      return todo.status === filter;
    });

    return {
      filteredTodos: filtered,
      pendingCount: todos.filter(todo => todo.status === TODO_STATUS.PENDING).length,
      completedCount: todos.filter(todo => todo.status === TODO_STATUS.COMPLETED).length,
      totalCount: todos.length,
    };
  }, [todos, filter]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={logout}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Add Todo Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleCreateTodo} className="flex gap-2">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !newTodoTitle.trim()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            {error}
            <button
              onClick={() => setError('')}
              className="float-right text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Counters */}
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-gray-600">Total: </span>
                <span className="font-semibold text-gray-900">{totalCount}</span>
              </div>
              <div>
                <span className="text-gray-600">Pending: </span>
                <span className="font-semibold text-yellow-600">{pendingCount}</span>
              </div>
              <div>
                <span className="text-gray-600">Completed: </span>
                <span className="font-semibold text-green-600">{completedCount}</span>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {Object.values(FILTER_OPTIONS).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === filterOption
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Todo List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading todos...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === FILTER_OPTIONS.ALL && totalCount === 0
                ? 'No todos yet'
                : filter === FILTER_OPTIONS.PENDING
                ? 'No pending todos'
                : 'No completed todos'}
            </h3>
            <p className="text-gray-500">
              {filter === FILTER_OPTIONS.ALL && totalCount === 0
                ? 'Get started by adding your first todo above!'
                : `Try switching to the "${filter === FILTER_OPTIONS.PENDING ? FILTER_OPTIONS.COMPLETED : FILTER_OPTIONS.PENDING}" filter.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <div
                key={todo._id}
                className={`bg-white rounded-lg shadow-sm p-4 flex items-start gap-4 transition-all ${
                  todo.status === TODO_STATUS.COMPLETED ? 'opacity-75' : ''
                }`}
              >
                {/* Toggle Status Checkbox */}
                <button
                  onClick={() => handleToggleStatus(todo._id, todo.status)}
                  className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    todo.status === TODO_STATUS.COMPLETED
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-indigo-500'
                  }`}
                  aria-label={`Mark as ${todo.status === TODO_STATUS.PENDING ? TODO_STATUS.COMPLETED : TODO_STATUS.PENDING}`}
                >
                  {todo.status === TODO_STATUS.COMPLETED && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>

                {/* Todo Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-lg font-medium ${
                      todo.status === TODO_STATUS.COMPLETED
                        ? 'line-through text-gray-500'
                        : 'text-gray-900'
                    }`}
                  >
                    {todo.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        todo.status === TODO_STATUS.PENDING
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {todo.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteTodo(todo._id)}
                  className="flex-shrink-0 text-red-600 hover:text-red-800 p-2 transition-colors"
                  aria-label="Delete todo"
                >
                  <svg
                    className="w-5 h-5"
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Todos;

