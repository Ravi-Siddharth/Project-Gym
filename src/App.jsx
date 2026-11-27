
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Dashboard from "./Dashboard";
import AddWorkout from "./AddWorkout";
import WorkoutHistory from "./WorkoutHistory";
import DietPlanner from "./DietPlanner";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import Profile from "./Profile";
import Admin from "./Admin";

import "./App.css";

// GET SAVED USER
function getSavedUser() {
  try {
    return JSON.parse(sessionStorage.getItem("user") || "null");
  } catch (error) {
    return null;
  }
}

// USER ROUTE PROTECTION
function UserRoute({ children }) {
  const token = sessionStorage.getItem("token");
  const user = getSavedUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

// ADMIN ROUTE PROTECTION
function AdminRoute({ children }) {
  const token = sessionStorage.getItem("token");
  const user = getSavedUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT PAGE */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* AUTHENTICATION PAGES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* USER PAGES */}
        <Route
          path="/dashboard"
          element={
            <UserRoute>
              <Dashboard />
            </UserRoute>
          }
        />

        <Route
          path="/add-workout"
          element={
            <UserRoute>
              <AddWorkout />
            </UserRoute>
          }
        />

        <Route
          path="/workout-history"
          element={
            <UserRoute>
              <WorkoutHistory />
            </UserRoute>
          }
        />

        <Route
          path="/diet-planner"
          element={
            <UserRoute>
              <DietPlanner />
            </UserRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <UserRoute>
              <Profile />
            </UserRoute>
          }
        />

        {/* ADMIN PAGE */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        {/* UNKNOWN ROUTES */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
