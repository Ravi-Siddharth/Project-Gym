
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Dumbbell,
  LogOut,
  Users,
  ShieldCheck,
  Trash2,
  Eye,
  ArrowLeft,
  Activity,
  Salad,
  Calendar,
  Clock
} from "lucide-react";

import "./Admin.css";


function Admin() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [deletingId, setDeletingId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // GET TOKEN FROM CURRENT BROWSER TAB
  const token = sessionStorage.getItem("token");

  // LOAD USERS
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const loadUsers = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setUsers(response.data.users || []);

      } catch (err) {
        const status = err.response?.status;

        if (status === 401) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }

        setError(
          status === 403
            ? "Access denied. Only administrators can view this page."
            : err.response?.data?.message ||
            "Unable to load users."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [navigate, token]);

  // VIEW INDIVIDUAL USER DETAILS
  const handleViewDetails = async (user) => {
    setSelectedUser(user);
    setUserDetails(null);
    setError("");
    setMessage("");
    setDetailsLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/api/admin/users/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUserDetails(response.data);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load user details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // BACK TO USERS
  const handleBack = () => {
    setSelectedUser(null);
    setUserDetails(null);
    setError("");
  };

  // DELETE USER
  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Delete this user and all their workout and diet records?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      setDeletingId(userId);

      await axios.delete(
        `${API_URL}api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers((previous) =>
        previous.filter((user) => user._id !== userId)
      );

      if (selectedUser?._id === userId) {
        handleBack();
      }

      setMessage(
        "User and their records deleted successfully."
      );

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete this user."
      );
    } finally {
      setDeletingId("");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // FORMAT DATE
  const formatDate = (date) => {
    return date
      ? new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC"
      })
      : "—";
  };

  if (loading) {
    return (
      <div className="admin-loading">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-brand">
          <Dumbbell size={30} strokeWidth={2.2} />
          <h2>Fit Tracker</h2>
        </div>

        <div className="admin-role-label">
          ADMIN PANEL
        </div>

        <nav className="admin-navigation">
          <button className="admin-nav-active">
            <Users size={19} />
            <span>View Users</span>
          </button>
        </nav>

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-content">

        {/* HEADER */}
        <header className="admin-header">

          <div>
            <h1>
              {selectedUser
                ? "User Details"
                : "Admin Dashboard"}
            </h1>

            <p>
              {selectedUser
                ? "View complete workout and diet history."
                : "Manage users and monitor their individual activity."}
            </p>
          </div>

          <span className="admin-badge">
            <ShieldCheck size={17} />
            Administrator
          </span>

        </header>

        {/* MESSAGES */}
        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {message && (
          <div className="admin-success">
            {message}
          </div>
        )}

        {!selectedUser ? (

          <>
            {/* TOTAL USERS */}
            <section className="admin-stats">

              <div className="admin-stat-card">
                <div className="admin-stat-icon admin-users-icon">
                  <Users size={27} />
                </div>

                <div>
                  <p>Total Users</p>
                  <h2>{users.length}</h2>
                </div>
              </div>

            </section>

            {/* USERS TABLE */}
            <section className="admin-users-section">

              <div className="admin-section-header">
                <div>
                  <h2>Registered Users</h2>
                  <p>View individual workout and diet activity.</p>
                </div>

                <span className="admin-user-count">
                  {users.length} users
                </span>
              </div>

              {users.length === 0 ? (

                <div className="admin-empty">
                  {error
                    ? "User information is unavailable."
                    : "No registered users found."}
                </div>

              ) : (

                <div className="admin-table-wrapper">

                  <table className="admin-users-table">

                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Workouts</th>
                        <th>Diet Plans</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((user) => (

                        <tr key={user._id}>

                          <td>
                            <div className="admin-user-info">

                              <div className="admin-user-avatar">
                                {(
                                  `${user.firstName?.charAt(0) || ""}` +
                                  `${user.lastName?.charAt(0) || ""}`
                                ).toUpperCase() || "U"}
                              </div>

                              <strong>
                                {user.firstName} {user.lastName}
                              </strong>

                            </div>
                          </td>

                          <td>{user.email}</td>

                          <td>
                            <span className="admin-count-badge">
                              <Activity size={15} />
                              {user.workoutCount ?? 0}
                            </span>
                          </td>

                          <td>
                            <span className="admin-count-badge">
                              <Salad size={15} />
                              {user.dietPlanCount ?? 0}
                            </span>
                          </td>

                          <td>{formatDate(user.createdAt)}</td>

                          <td>
                            <div className="admin-action-buttons">

                              <button
                                className="admin-view-button"
                                onClick={() => handleViewDetails(user)}
                              >
                                <Eye size={16} />
                                View Details
                              </button>

                              <button
                                className="admin-delete-button"
                                onClick={() => handleDeleteUser(user._id)}
                                disabled={deletingId === user._id}
                              >
                                <Trash2 size={16} />

                                {deletingId === user._id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>

                            </div>
                          </td>

                        </tr>

                      ))}
                    </tbody>

                  </table>

                </div>
              )}

            </section>
          </>

        ) : (

          /* INDIVIDUAL USER DETAILS */
          <section className="admin-user-details">

            <button
              className="admin-back-button"
              onClick={handleBack}
            >
              <ArrowLeft size={18} />
              Back to Users
            </button>

            {/* USER INFORMATION */}
            <div className="admin-detail-user-card">

              <div className="admin-user-avatar admin-large-avatar">
                {(
                  `${selectedUser.firstName?.charAt(0) || ""}` +
                  `${selectedUser.lastName?.charAt(0) || ""}`
                ).toUpperCase() || "U"}
              </div>

              <div>
                <h2>
                  {selectedUser.firstName} {selectedUser.lastName}
                </h2>

                <p>{selectedUser.email}</p>

                <span className="admin-role">
                  {selectedUser.role || "user"}
                </span>
              </div>

            </div>

            {detailsLoading ? (

              <div className="admin-empty">
                Loading user records...
              </div>

            ) : userDetails ? (

              <>

                {/* INDIVIDUAL COUNTS */}
                <div className="admin-user-counts">

                  <div className="admin-stat-card">
                    <Activity size={25} />

                    <div>
                      <p>Total Workouts</p>
                      <h2>{userDetails.workoutCount}</h2>
                    </div>
                  </div>

                  <div className="admin-stat-card">
                    <Salad size={25} />

                    <div>
                      <p>Total Diet Plans</p>
                      <h2>{userDetails.dietPlanCount}</h2>
                    </div>
                  </div>

                </div>

                {/* WORKOUT HISTORY */}
                <div className="admin-history-section">

                  <div className="admin-history-heading">
                    <h2>
                      <Dumbbell size={22} />
                      Workout History
                    </h2>

                    <span>
                      {userDetails.workouts?.length || 0} records
                    </span>
                  </div>

                  {userDetails.workouts?.length > 0 ? (

                    userDetails.workouts.map((workout) => (

                      <div
                        className="admin-history-card"
                        key={workout._id}
                      >

                        <div className="admin-history-card-header">

                          <div>
                            <h3>{workout.sessionName}</h3>
                            <p>{workout.category}</p>
                          </div>

                          <span className="admin-history-date">
                            <Calendar size={15} />
                            {formatDate(workout.workoutDate)}
                          </span>

                        </div>

                        <div className="admin-workout-duration">
                          <Clock size={16} />
                          {workout.duration} minutes
                        </div>

                        <h4>Exercises</h4>

                        {workout.exercises?.map((exercise, index) => (

                          <div
                            className="admin-exercise-item"
                            key={exercise._id || index}
                          >

                            <strong>{exercise.exerciseName}</strong>

                            <div className="admin-set-list">

                              {exercise.sets?.map((set, setIndex) => (

                                <div
                                  className="admin-set-row"
                                  key={set._id || setIndex}
                                >
                                  <span>Set {setIndex + 1}</span>
                                  <span>{set.reps} reps</span>
                                  <span>{set.weight} kg</span>
                                </div>

                              ))}

                            </div>

                          </div>

                        ))}

                      </div>

                    ))

                  ) : (

                    <div className="admin-empty">
                      No workout records found for this user.
                    </div>

                  )}

                </div>

                {/* DIET HISTORY */}
                <div className="admin-history-section">

                  <div className="admin-history-heading">
                    <h2>
                      <Salad size={22} />
                      Diet History
                    </h2>

                    <span>
                      {userDetails.diets?.length || 0} plans
                    </span>
                  </div>

                  {userDetails.diets?.length > 0 ? (

                    userDetails.diets.map((diet) => (

                      <div
                        className="admin-history-card"
                        key={diet._id}
                      >

                        <div className="admin-history-card-header">
                          <div>
                            <h3>{diet.planName}</h3>
                            <p>{formatDate(diet.planDate)}</p>
                          </div>
                        </div>

                        <h4>Meals</h4>

                        {diet.meals?.map((meal, index) => (

                          <div
                            className="admin-diet-meal"
                            key={meal._id || index}
                          >

                            <div>
                              <strong>{meal.mealType}</strong>
                              <p>{meal.foodName}</p>
                              <small>{meal.quantity}</small>
                            </div>

                            <span>
                              {meal.calories} kcal
                            </span>

                          </div>

                        ))}

                        <div className="admin-diet-total">
                          Total Calories:{" "}
                          {diet.meals?.reduce(
                            (total, meal) =>
                              total + Number(meal.calories || 0),
                            0
                          )} kcal
                        </div>

                      </div>

                    ))

                  ) : (

                    <div className="admin-empty">
                      No diet plans found for this user.
                    </div>

                  )}

                </div>

              </>

            ) : (

              <div className="admin-empty">
                Unable to display user records.
              </div>

            )}

          </section>

        )}

      </main>

    </div>
  );
}

export default Admin;
