import { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export function useTasks() {
  return useContext(TaskContext);
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [sortBy, setSortBy] = useState('createdAt'); // 'createdAt', 'deadline', 'priority'
  const { currentUser } = useAuth();

  // Add a new task
  const addTask = async (taskData) => {
    if (!currentUser) throw new Error('User must be logged in');

    const newTask = {
      ...taskData,
      userId: currentUser.uid,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      return { id: docRef.id, ...newTask };
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  // Update a task
  const updateTask = async (taskId, updates) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (taskId, isCompleted) => {
    await updateTask(taskId, { isCompleted: !isCompleted });
  };

  // Real-time listener for tasks
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Create query based on current user
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(tasksQuery, 
      (querySnapshot) => {
        const tasksData = [];
        querySnapshot.forEach((doc) => {
          tasksData.push({ id: doc.id, ...doc.data() });
        });
        setTasks(tasksData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return unsubscribe;
  }, [currentUser]);

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active':
        return !task.isCompleted;
      case 'completed':
        return task.isCompleted;
      default:
        return true; // 'all'
    }
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'deadline':
        return new Date(a.deadline || 0) - new Date(b.deadline || 0);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Get tasks statistics
  const tasksStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.isCompleted).length,
    active: tasks.filter(task => !task.isCompleted).length
  };

  const value = {
    tasks: sortedTasks,
    allTasks: tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    tasksStats
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}