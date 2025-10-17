import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TaskForm from './Task/TaskForm';
import TaskList from './Task/TaskList';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [showTaskForm, setShowTaskForm] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={styles.navFlex}>
            <div style={styles.navLeft}>
              <h1 style={styles.navTitle}>Task Manager</h1>
            </div>
            <div style={styles.navRight}>
              <span style={styles.userEmail}>Welcome, {currentUser?.email}</span>
              <button
                onClick={handleLogout}
                style={styles.logoutBtn}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.mainContent}>
          {/* Header and Add Task Button */}
          <div style={styles.headerSection}>
            <div>
              <h2 style={styles.pageTitle}>My Tasks</h2>
              <p style={styles.pageSubtitle}>Manage your daily tasks efficiently</p>
            </div>
            <button
              onClick={() => setShowTaskForm(true)}
              style={styles.addTaskBtn}
            >
              <span>+</span>
              <span style={styles.addTaskText}>Add Task</span>
            </button>
          </div>

          {/* Task Form Modal */}
          {showTaskForm && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <TaskForm onCancel={() => setShowTaskForm(false)} />
              </div>
            </div>
          )}

          {/* Task List */}
          <TaskList />
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  nav: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
  },
  navContent: {
    maxWidth: '100%',
    margin: '0 auto',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
  },
  navFlex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '4rem',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: 0,
    color: '#1f2937',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  userEmail: {
    color: '#4b5563',
    fontSize: '0.95rem',
  },
  logoutBtn: {
    backgroundColor: '#2c3e50',
    color: '#ffffff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
  },
  main: {
    maxWidth: '56rem',
    margin: '0 auto',
    paddingTop: '1.5rem',
    paddingBottom: '1.5rem',
  },
  mainContent: {
    paddingLeft: '1rem',
    paddingRight: '1rem',
  },
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  pageTitle: {
    fontSize: '1.875rem',
    fontWeight: '700',
    margin: 0,
    color: '#1f2937',
  },
  pageSubtitle: {
    fontSize: '0.95rem',
    color: '#6b7280',
    margin: '0.25rem 0 0 0',
  },
  addTaskBtn: {
    backgroundColor: '#2c3e50',
    color: '#ffffff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
  },
  addTaskText: {
    display: 'inline-block',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    zIndex: 50,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    maxWidth: '28rem',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
};

export default Dashboard;