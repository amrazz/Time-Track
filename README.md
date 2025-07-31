# 🚀 FastTrack Tasks – Learning FastAPI Through Practice

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

> **💡 Learning Journey:** As a Django/DRF developer, I built this mini full-stack task management application to explore and understand FastAPI's approach to building modern APIs. This project showcases the differences and similarities between FastAPI and Django REST Framework.

---

## 🎯 Project Overview

**FastTrack Tasks** is a simple yet comprehensive task management application featuring:
- ✨ User authentication with JWT tokens
- 📝 Full CRUD operations for tasks
- 🔍 Advanced filtering and search capabilities
- 📅 Due date management
- 🎨 Modern, responsive UI with smooth animations
- 🔒 Protected routes and secure API endpoints

### 🧠 What I Learned Coming from Django/DRF

| Feature | Django/DRF | FastAPI |
|---------|------------|---------|
| **API Documentation** | Manual setup with drf-spectacular | Auto-generated with OpenAPI |
| **Type Hints** | Optional | Core feature with Pydantic |
| **Async Support** | Django 3.1+ with some limitations | Native async/await support |
| **Request Validation** | DRF Serializers | Pydantic models |
| **Dependency Injection** | Custom implementation | Built-in DI system |

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation using Python type annotations
- **JWT** - JSON Web Token for authentication
- **Uvicorn** - Lightning-fast ASGI server

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **Axios** - Promise-based HTTP client

---

## 📁 Project Structure

```
FastTrack-Tasks/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   └── security.py          # JWT & password handling
│   │   ├── database/
│   │   │   ├── db_config.py         # Database connection
│   │   │   └── schemas/
│   │   │       ├── auth.py          # Auth Pydantic models
│   │   │       ├── tasks.py         # Task Pydantic models
│   │   │       └── token.py         # Token models
│   │   ├── routers/
│   │   │   ├── auth.py              # Authentication endpoints
│   │   │   ├── tasks.py             # Task CRUD endpoints
│   │   │   └── users.py             # User management
│   │   ├── utils/
│   │   │   └── counter.py           # Utility functions
│   │   ├── deps.py                  # Dependency injection
│   │   └── main.py                  # FastAPI app instance
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── Components/
    │   │   ├── CalendarCom.jsx      # Date picker component
    │   │   ├── CreateTaskModal.jsx  # Task creation modal
    │   │   ├── DeleteConfirmationModal.jsx
    │   │   ├── EditTaskModal.jsx    # Task editing modal
    │   │   ├── Nav.jsx              # Navigation component
    │   │   └── TaskList.jsx         # Task display component
    │   ├── Pages/
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx        # Login page
    │   │   │   └── Register.jsx     # Registration page
    │   │   └── Dashboard.jsx        # Main dashboard
    │   ├── api/
    │   │   └── useApi.jsx           # API hooks and Axios config
    │   ├── context/
    │   │   └── AuthProvider.jsx     # Authentication context
    │   ├── routes/
    │   │   ├── ProtectedRoute.jsx   # Auth-protected routes
    │   │   └── PublicRoute.jsx      # Public routes
    │   └── assets/                  # Images and static files
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **npm or yarn**

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the FastAPI server:**
   ```bash
   uvicorn app.main:app --reload
   ```

   🎉 **Backend running at:** `http://localhost:8000`  
   📖 **API Documentation:** `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   🎉 **Frontend running at:** `http://localhost:5173`

---

## ✨ Features

### 🔐 Authentication System
- User registration and login
- JWT token-based authentication
- Protected API endpoints
- Automatic token refresh handling

### 📋 Task Management
- **Create** new tasks with title, description, and due date
- **Read** all tasks with filtering options
- **Update** existing tasks
- **Delete** tasks with confirmation modal
- **Search** tasks by title or description
- **Filter** by priority level and completion status

### 🎨 User Interface
- Clean, modern design with Tailwind CSS
- Responsive layout for all screen sizes
- Smooth animations with Framer Motion
- Interactive modals for task operations
- Calendar component for date selection

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | User registration |
| `POST` | `/auth/login` | User login |
| `GET` | `/tasks/get-task` | Get all user tasks |
| `POST` | `/tasks/create-task` | Create new task |
| `PUT` | `/tasks/update-task/{task_id}` | Update task |
| `DELETE` | `/tasks/delete-task/{task_id}` | Delete task |
| `GET` | `/users/me` | Get current user info |

---

## 🎓 Key Learning Outcomes

### FastAPI vs Django/DRF Insights

1. **Automatic Documentation**: FastAPI's auto-generated interactive docs are incredibly helpful for development and testing.

2. **Type Safety**: Pydantic models provide excellent request/response validation and IDE support.

3. **Performance**: FastAPI's async capabilities make it naturally faster for I/O-heavy operations.

4. **Developer Experience**: The combination of type hints, automatic validation, and interactive docs creates a smooth development workflow.

5. **Dependency Injection**: FastAPI's DI system is more explicit and flexible than Django's approach.

### Frontend Integration

- **API Integration**: Connected React frontend to FastAPI backend using Axios
- **State Management**: Implemented authentication context and protected routing
- **Component Architecture**: Built reusable components with proper separation of concerns
- **Modern React**: Used hooks, context API, and functional components throughout

---

## 🔮 Future Enhancements

- [ ] Task categories and labels
- [ ] Task assignment to other users
- [ ] Email notifications for due dates
- [ ] Drag-and-drop task reordering
- [ ] Task templates
- [ ] Data export functionality
- [ ] Dark/light theme toggle

---

## 🤝 Contributing

This is a learning project, but contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Share feedback

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 💭 Final Thoughts

Building this project helped me appreciate both FastAPI and Django/DRF for different use cases. FastAPI excels in:
- **Rapid prototyping** with automatic documentation
- **Type safety** and modern Python features
- **High performance** async applications
- **Microservices** architecture

While Django/DRF remains excellent for:
- **Complex business logic** with rich ORM features
- **Admin interfaces** and content management
- **Large-scale applications** with established patterns
- **Rapid development** with batteries-included approach

---

<div align="center">

**⭐ If this project helped you learn FastAPI, please give it a star!**

Made with ❤️ for learning and sharing knowledge

</div>