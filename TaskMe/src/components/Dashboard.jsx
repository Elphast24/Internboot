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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Task Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {currentUser?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Header and Add Task Button */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
              <p className="text-gray-600">Manage your daily tasks efficiently</p>
            </div>
            <button
              onClick={() => setShowTaskForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            >
              <span>+</span>
              <span>Add Task</span>
            </button>
          </div>

          {/* Task Form Modal */}
          {showTaskForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
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

export default Dashboard;