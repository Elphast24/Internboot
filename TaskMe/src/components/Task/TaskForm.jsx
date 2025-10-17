import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';

const TaskForm = ({ onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('personal');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { addTask } = useTasks();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await addTask({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        deadline: deadline ? new Date(deadline) : null
      });

      setTitle('');
      setDescription('');
      setCategory('personal');
      setPriority('medium');
      setDeadline('');
      
      if (onCancel) onCancel();
    } catch (error) {
      setError('Failed to create task: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={taskFormStyles.form}>
      <h2 style={taskFormStyles.title}>Add New Task</h2>
      
      {error && (
        <div style={taskFormStyles.errorBox}>
          {error}
        </div>
      )}

      <div style={taskFormStyles.container}>
        <div>
          <label style={taskFormStyles.label}>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={taskFormStyles.input}
            placeholder="What needs to be done?"
            required
          />
        </div>

        <div>
          <label style={taskFormStyles.label}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            style={taskFormStyles.textarea}
            placeholder="Add some details..."
          />
        </div>

        <div style={taskFormStyles.gridContainer}>
          <div>
            <label style={taskFormStyles.label}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={taskFormStyles.select}
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label style={taskFormStyles.label}>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={taskFormStyles.select}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label style={taskFormStyles.label}>Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              style={taskFormStyles.input}
            />
          </div>
        </div>

        <div style={taskFormStyles.buttonContainer}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={taskFormStyles.cancelBtn}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !title.trim()}
            style={{
              ...taskFormStyles.submitBtn,
              opacity: loading || !title.trim() ? 0.5 : 1
            }}
          >
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </div>
    </form>
  );
};

const taskFormStyles = {
  form: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '0.375rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    marginBottom: '1rem',
    margin: 0,
    color: '#1f2937',
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    color: '#991b1b',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.25rem',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  textarea: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  select: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    paddingTop: '1rem',
  },
  cancelBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#4b5563',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  submitBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#ffffff',
    backgroundColor: '#2c3e50',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default TaskForm;