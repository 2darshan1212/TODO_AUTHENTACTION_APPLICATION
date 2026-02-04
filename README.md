# Todo App - Full Stack Application

A modern, full-stack todo application built with Node.js, Express, MongoDB, and React. Features user authentication, CRUD operations for todos, and a responsive UI.

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

## 📁 Project Structure

```
todoappassisment/
├── backend/
│   ├── config/
│   │   ├── database.js      # MongoDB connection
│   │   └── env.js           # Environment variables
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication
│   │   ├── errorHandler.js  # Global error handler
│   │   ├── notFound.js      # 404 handler
│   │   └── todoAuth.js      # Todo authorization
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Todo.js          # Todo schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── todos.js         # Todo CRUD routes
│   │   └── index.js         # Route aggregator
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx  # Protected route wrapper
    │   │   └── PublicRoute.jsx     # Public route wrapper
    │   ├── config/
    │   │   └── axios.js            # Axios instance with interceptors
    │   ├── constants/
    │   │   └── index.js             # App constants
    │   ├── context/
    │   │   └── AuthContext.jsx      # Authentication context
    │   ├── pages/
    │   │   ├── Login.jsx            # Login page
    │   │   ├── Register.jsx        # Registration page
    │   │   └── Todos.jsx            # Todo management page
    │   ├── services/
    │   │   └── todoService.js       # Todo API service
    │   ├── utils/
    │   │   └── navigation.js        # Navigation utility
    │   ├── App.jsx                  # Main app component
    │   └── main.jsx                # React entry point
    └── package.json
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/todoapp
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_URL=http://localhost:3000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## ✨ Features

### Authentication
- User registration with email and password
- Secure login with JWT tokens
- Password hashing with bcrypt
- Token-based authentication
- Protected routes
- Automatic token expiration handling

### Todo Management
- Create new todos
- View all todos (filtered by user)
- Update todo status (Pending/Completed)
- Delete todos
- Filter todos by status (All/Pending/Completed)
- Real-time counters (Total/Pending/Completed)
- Empty state messages

### User Experience
- Responsive design (mobile-friendly)
- Loading states
- Error handling with user-friendly messages
- Form validation
- Persistent login (token stored in localStorage)
- Clean, modern UI with Tailwind CSS

## 🔒 Security Features

- Passwords are hashed using bcrypt before storage
- JWT tokens for secure authentication
- User-specific todo access (users can only see their own todos)
- Input validation on both client and server
- CORS configuration for API security
- Environment variables for sensitive data

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Todos
- `GET /api/todos` - Get all todos for authenticated user
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

All todo endpoints require authentication via JWT token in the Authorization header.

## 🧪 Development

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📦 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRATION` - Token expiration time (default: 7d)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:3000/api)

## 🎨 Code Quality

- Consistent error handling
- Clean code structure
- Modular architecture
- Reusable components
- Centralized configuration
- Type-safe constants
- Performance optimizations (useMemo, useCallback)

## 🚀 Deployment

### Frontend (Vercel)

The frontend is configured for easy deployment on Vercel. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**
1. Push your code to GitHub
2. Import project to Vercel
3. Set `VITE_API_URL` environment variable
4. Deploy!

The `vercel.json` file is already configured for optimal deployment.

### Backend

The backend can be deployed on platforms like:
- **Heroku** - Easy Node.js deployment
- **Railway** - Modern deployment platform
- **Render** - Free tier available
- **DigitalOcean App Platform** - Scalable hosting
- **AWS/Google Cloud/Azure** - Enterprise solutions

Make sure to:
- Set all environment variables
- Configure CORS to allow your frontend domain
- Use a production MongoDB instance (MongoDB Atlas recommended)

## 📄 License

ISC

## 👤 Author

Built as a full-stack development project demonstrating modern web development practices.

