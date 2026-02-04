const { Todo } = require('../models');

// Middleware to ensure todo belongs to the authenticated user
const authorizeTodo = async (req, res, next) => {
  try {
    const todoId = req.params.id || req.body.id;
    
    if (!todoId) {
      return next(); // Let the route handler validate required fields
    }

    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found.',
      });
    }

    // Check if todo belongs to the authenticated user
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to access this todo.',
      });
    }

    req.todo = todo;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error authorizing todo access.',
    });
  }
};

// Middleware to automatically set user ID on todo creation/updates
const setTodoUser = (req, res, next) => {
  // Ensure todos are always linked to the logged-in user
  req.body.user = req.user._id;
  next();
};

module.exports = { authorizeTodo, setTodoUser };

