import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import {Pencil, X} from 'lucide-react'

const TaskItem = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editCategory, setEditCategory] = useState(task.category);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDeadline, setEditDeadline] = useState(
    task.deadline ? new Date(task.deadline.seconds * 1000).toISOString().split('T')[0] : ''
  );
  const [loading, setLoading] = useState(false);

  const { updateTask, deleteTask, toggleTaskCompletion } = useTasks();

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!editTitle.trim()) return;

    try {
      setLoading(true);
      await updateTask(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        category: editCategory,
        priority: editPriority,
        deadline: editDeadline ? new Date(editDeadline) : null
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high': return { backgroundColor: '#fee2e2', color: '#7f1d1d' };
      case 'medium': return { backgroundColor: '#fef3c7', color: '#78350f' };
      case 'low': return { backgroundColor: '#dcfce7', color: '#166534' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'work': return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'personal': return { backgroundColor: '#e9d5ff', color: '#6d28d9' };
      case 'health': return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'education': return { backgroundColor: '#e0e7ff', color: '#3730a3' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'No deadline';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString();
  };

  if (isEditing) {
    return (
      <div style={taskItemStyles.editingCard}>
        <form onSubmit={handleSave} style={taskItemStyles.editForm}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={taskItemStyles.editInput}
            required
          />
          
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows="2"
            style={taskItemStyles.editTextarea}
            placeholder="Add description..."
          />

          <div style={taskItemStyles.editGrid}>
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              style={taskItemStyles.editSelect}
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>

            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              style={taskItemStyles.editSelect}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <input
            type="date"
            value={editDeadline}
            onChange={(e) => setEditDeadline(e.target.value)}
            style={taskItemStyles.editInput}
          />

          <div style={taskItemStyles.editButtonContainer}>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={taskItemStyles.editCancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...taskItemStyles.editSaveBtn,
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  const borderColor = task.isCompleted ? '#16a34a' : '#2c3e50';
  const opacity = task.isCompleted ? 0.75 : 1;

  return (
    <div style={{...taskItemStyles.card, borderLeftColor: borderColor, opacity: opacity}}>
      <div style={taskItemStyles.cardContent}>
        <div style={taskItemStyles.checkboxContainer}>
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={() => toggleTaskCompletion(task.id, task.isCompleted)}
            style={taskItemStyles.checkbox}
          />
          <div style={taskItemStyles.taskInfo}>
            <h3 style={{
              ...taskItemStyles.taskTitle,
              textDecoration: task.isCompleted ? 'line-through' : 'none',
              color: task.isCompleted ? '#9ca3af' : '#1f2937'
            }}>
              {task.title}
            </h3>
            {task.description && (
              <p style={taskItemStyles.taskDescription}>{task.description}</p>
            )}
            <div style={taskItemStyles.badgeContainer}>
              <span style={{...taskItemStyles.badge, ...getCategoryStyle(task.category)}}>
                {task.category}
              </span>
              <span style={{...taskItemStyles.badge, ...getPriorityStyle(task.priority)}}>
                {task.priority}
              </span>
              <span style={{...taskItemStyles.badge, backgroundColor: '#f3f4f6', color: '#374151'}}>
                 {formatDate(task.deadline)}
              </span>
            </div>
          </div>
        </div>
        
        <div style={taskItemStyles.buttonGroup}>
          <button
            onClick={() => setIsEditing(true)}
            style={taskItemStyles.editBtn}
            title="Edit task"
          >
            <Pencil color='#6b7280' size={20}/>
          </button>
          <button
            onClick={handleDelete}
            style={taskItemStyles.deleteBtn}
            title="Delete task"
          >
            <X color='#6b7280' size={20}/>
          </button>
        </div>
      </div>
    </div>
  );
};

const taskItemStyles = {
  card: {
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    borderLeft: '4px solid',
    transition: 'opacity 0.2s',
  },
  cardContent: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    flex: 1,
  },
  checkbox: {
    marginTop: '0.25rem',
    width: '1rem',
    height: '1rem',
    cursor: 'pointer',
    accentColor: '#2c3e50',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontWeight: '500',
    margin: 0,
    marginBottom: '0.25rem',
    fontSize: '0.95rem',
  },
  taskDescription: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: '0.25rem 0',
  },
  badgeContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.5rem',
    marginLeft: '1rem',
  },
  editBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    padding: '0.25rem',
    transition: 'opacity 0.2s',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    padding: '0.25rem',
    transition: 'opacity 0.2s',
  },
  editingCard: {
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '0.375rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '2px solid #bfdbfe',
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  editInput: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  editTextarea: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'border-color 0.2s',
  },
  editSelect: {
    padding: '0.25rem 0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
  },
  editGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  editButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
  },
  editCancelBtn: {
    padding: '0.25rem 0.75rem',
    fontSize: '0.875rem',
    color: '#4b5563',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  editSaveBtn: {
    padding: '0.25rem 0.75rem',
    fontSize: '0.875rem',
    color: '#ffffff',
    backgroundColor: '#2c3e50',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default TaskItem;
