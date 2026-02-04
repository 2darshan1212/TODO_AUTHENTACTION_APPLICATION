import api from '../config/axios';

export const todoService = {
  // Get all todos
  getAllTodos: async () => {
    const response = await api.get('/todos');
    return response.data.data;
  },

  // Create a new todo
  createTodo: async (title, status = 'Pending') => {
    const response = await api.post('/todos', { title, status });
    return response.data.data;
  },

  // Update a todo
  updateTodo: async (id, updates) => {
    const response = await api.put(`/todos/${id}`, updates);
    return response.data.data;
  },

  // Delete a todo
  deleteTodo: async (id) => {
    await api.delete(`/todos/${id}`);
    return id;
  },

  // Toggle todo status
  toggleTodoStatus: async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    const response = await api.put(`/todos/${id}`, { status: newStatus });
    return response.data.data;
  },
};

