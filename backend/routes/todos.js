const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { setTodoUser, authorizeTodo } = require('../middleware/todoAuth');
const { Todo } = require('../models');

// Create todo for authenticated user
router.post('/', authenticate, setTodoUser, async (req, res) => {
  try {
    const { title, status } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required.',
      });
    }

    const todo = await Todo.create({
      title: title.trim(),
      status: status || 'Pending',
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Todo created successfully.',
      data: todo,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(' '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating todo. Please try again.',
    });
  }
});

// Fetch all todos belonging only to the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching todos. Please try again.',
    });
  }
});

// Update todo title or status with ownership verification
router.put('/:id', authenticate, authorizeTodo, async (req, res) => {
  try {
    const { title, status } = req.body;
    const todo = req.todo;

    // Validate at least one field is provided
    if (!title && !status) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (title or status) is required for update.',
      });
    }

    // Validate title if provided
    if (title !== undefined) {
      if (!title || title.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Title cannot be empty.',
        });
      }
      todo.title = title.trim();
    }

    // Validate status if provided
    if (status !== undefined) {
      if (!['Pending', 'Completed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be either "Pending" or "Completed".',
        });
      }
      todo.status = status;
    }

    await todo.save();

    res.json({
      success: true,
      message: 'Todo updated successfully.',
      data: todo,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(' '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating todo. Please try again.',
    });
  }
});

// Delete todo with strict user ownership check
router.delete('/:id', authenticate, authorizeTodo, async (req, res) => {
  try {
    const todo = req.todo;

    await Todo.findByIdAndDelete(todo._id);

    res.json({
      success: true,
      message: 'Todo deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting todo. Please try again.',
    });
  }
});

module.exports = router;

