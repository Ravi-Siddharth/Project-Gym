
import { useNavigate } from "react-router-dom";

import {
  Dumbbell,
  Activity,
  Flame,
  BicepsFlexed,
  Zap,
  Footprints,
  Target,
  Plus,
  History,
  Salad,
  ArrowUpRight
} from "lucide-react";

import Sidebar from "./Sidebar";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const workouts = [
    {
      name: "Chest",
      icon: Dumbbell,
      description:
        "Build upper-body strength, chest density and balanced muscle development.",
      color: "purple"
    },
    {
      name: "Back",
      icon: Activity,
      description:
        "Develop back width, thickness and a powerful V-shaped physique.",
      color: "blue"
    },
    {
      name: "Shoulder",
      icon: Flame,
      description:
        "Strengthen your shoulders with controlled pressing and rotation movements.",
      color: "orange"
    },
    {
      name: "Biceps",
      icon: BicepsFlexed,
      description:
        "Build stronger arms with focused curls and pulling exercises.",
      color: "pink"
    },
    {
      name: "Triceps",
      icon: Zap,
      description:
        "Improve arm thickness and pressing strength with triceps training.",
      color: "cyan"
    },
    {
      name: "Legs",
      icon: Footprints,
      description:
        "Build powerful quads, hamstrings, glutes and lower-body strength.",
      color: "green"
    },
    {
      name: "Core",
      icon: Target,
      description:
        "Improve abdominal strength, stability and overall core control.",
      color: "yellow"
    }
  ];

  return (
    <div className="dashboard">

      <Sidebar />

      <main className="dashboard-content">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>
            <span className="dashboard-eyebrow">
              FITNESS OVERVIEW
            </span>

            <h1>Workout Dashboard</h1>

            <p>
              Push your limits. Build strength. Stay consistent.
            </p>
          </div>

          <button
            className="add-workout-btn"
            onClick={() => navigate("/add-workout")}
          >
            <Plus size={19} />
            Add Workout
          </button>

        </header>

        {/* WELCOME BANNER */}

        <section className="welcome-card">

          <div className="welcome-content">

            <span className="welcome-label">
              YOUR FITNESS JOURNEY
            </span>

            <h2>
              Train Hard.
              <br />
              Stay Consistent.
            </h2>

            <p>
              Every workout brings you one step closer
              to your strongest self.
            </p>

            <button
              className="welcome-button"
              onClick={() => navigate("/add-workout")}
            >
              Start Training
              <ArrowUpRight size={18} />
            </button>

          </div>

          <div className="welcome-visual">
            <div className="welcome-circle welcome-circle-one"></div>
            <div className="welcome-circle welcome-circle-two"></div>

            <Dumbbell
              className="welcome-dumbbell"
              size={125}
              strokeWidth={1.2}
            />
          </div>

          <div className="welcome-decoration"></div>

        </section>

        {/* WORKOUT CATEGORIES */}

        <section className="workout-section">

          <div className="section-heading">

            <div>
              <span className="section-eyebrow">
                TRAINING PROGRAM
              </span>

              <h2>Workout Categories</h2>

              <p>
                Choose your muscle group and start your session.
              </p>
            </div>

            <span className="category-count">
              {workouts.length} Categories
            </span>

          </div>

          <div className="workout-grid">

            {workouts.map((workout) => {

              const Icon = workout.icon;

              return (
                <div
                  className={`workout-card ${workout.color}`}
                  key={workout.name}
                >

                  <div className="workout-card-top">

                    <div className="workout-icon">
                      <Icon size={27} strokeWidth={1.8} />
                    </div>

                    <span className="workout-card-arrow">
                      <ArrowUpRight size={19} />
                    </span>

                  </div>

                  <h3>{workout.name}</h3>

                  <p>{workout.description}</p>

                  <button
                    onClick={() =>
                      navigate(
                        `/add-workout?category=${encodeURIComponent(workout.name)}`
                      )
                    }
                  >
                    Start Workout
                    <ArrowUpRight size={16} />
                  </button>

                </div>
              );
            })}

          </div>

        </section>

        {/* QUICK ACTIONS */}

        <section className="quick-actions">

          <div className="section-heading">

            <div>
              <span className="section-eyebrow">
                QUICK ACCESS
              </span>

              <h2>Manage Your Fitness</h2>

              <p>
                Access your workout records and nutrition plans.
              </p>
            </div>

          </div>

          <div className="quick-action-buttons">

            <button
              onClick={() => navigate("/workout-history")}
            >
              <span className="quick-action-icon history-icon">
                <History size={22} />
              </span>

              <span className="quick-action-text">
                <strong>Workout History</strong>
                <small>Review your training sessions</small>
              </span>

              <ArrowUpRight size={19} className="quick-action-arrow" />
            </button>

            <button
              onClick={() => navigate("/diet-planner")}
            >
              <span className="quick-action-icon diet-icon">
                <Salad size={22} />
              </span>

              <span className="quick-action-text">
                <strong>Diet Planner</strong>
                <small>Manage your daily nutrition</small>
              </span>

              <ArrowUpRight size={19} className="quick-action-arrow" />
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;
