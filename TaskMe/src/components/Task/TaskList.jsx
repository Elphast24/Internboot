import { useTasks } from '../../context/TaskContext';
import TaskItem from './TaskItem';

const TaskList = () => {
  const { tasks, loading, filter, setFilter, sortBy, setSortBy, tasksStats } = useTasks();

  if (loading) {
    return (
      <div style={taskListStyles.spinnerContainer}>
        <div style={taskListStyles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={taskListStyles.container}>
      {/* Stats and Filters */}
      <div style={taskListStyles.statsCard}>
        <div style={taskListStyles.statsWrapper}>
          <div style={taskListStyles.statsRow}>
            <div style={taskListStyles.statItem}>
              <div style={taskListStyles.statValue}>{tasksStats.total}</div>
              <div style={taskListStyles.statLabel}>Total</div>
            </div>
            <div style={taskListStyles.statItem}>
              <div style={{...taskListStyles.statValue, color: '#16a34a'}}>{tasksStats.completed}</div>
              <div style={taskListStyles.statLabel}>Completed</div>
            </div>
            <div style={taskListStyles.statItem}>
              <div style={{...taskListStyles.statValue, color: '#0284c7'}}>{tasksStats.active}</div>
              <div style={taskListStyles.statLabel}>Active</div>
            </div>
          </div>

          <div style={taskListStyles.filterRow}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={taskListStyles.select}
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={taskListStyles.select}
            >
              <option value="createdAt">Newest First</option>
              <option value="deadline">Deadline</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div style={taskListStyles.emptyState}>
          <div style={taskListStyles.emptyIcon}>📝</div>
          <h3 style={taskListStyles.emptyTitle}>No tasks found</h3>
          <p style={taskListStyles.emptyText}>
            {filter === 'all' 
              ? "Get started by creating your first task!" 
              : `No ${filter} tasks found.`}
          </p>
        </div>
      ) : (
        <div style={taskListStyles.taskList}>
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

const taskListStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '3rem',
    paddingBottom: '3rem',
  },
  spinner: {
    width: '3rem',
    height: '3rem',
    border: '2px solid #e5e7eb',
    borderTop: '2px solid #2c3e50',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '0.375rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  statsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  statsRow: {
    display: 'flex',
    gap: '2.5rem',
    flexWrap: 'wrap',
  },
  statItem: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#9ca3af',
  },
  filterRow: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  select: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '0.375rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '3.75rem',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.125rem',
    fontWeight: '500',
    color: '#1f2937',
    margin: '0.5rem 0',
  },
  emptyText: {
    color: '#6b7280',
    margin: 0,
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
};

export default TaskList;