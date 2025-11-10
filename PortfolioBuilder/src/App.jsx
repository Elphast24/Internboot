import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useProjects } from './hooks/useProjects';
import AuthForm from './components/Auth/AuthForm';
import Navbar from './components/Layout/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import ProfileEditor from './components/Profile/ProfileEditor';
import ProjectsList from './components/Projects/ProjectsList';
import ProjectForm from './components/Projects/ProjectForm';
import PortfolioPreview from './components/Preview/PortfolioPreview';
import Loading from './components/Common/Loading';
import { TABS } from './utils/constants';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from './utils/constants';

function AppContent() {
  const { user, profile, loading: authLoading } = useAuth();
  const {
    projects,
    loading: projectsLoading,
    addProject,
    editProject,
    removeProject
  } = useProjects();

  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Handle add project
  const handleAddProject = () => {
    setEditingProject(null);
    setShowProjectForm(true);
    setActiveTab(TABS.PROJECTS);
  };

  // Handle edit project
  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  // Handle delete project
  const handleDeleteProject = async (projectId) => {
    const { success, error } = await removeProject(projectId);
    if (success) {
      alert(SUCCESS_MESSAGES.PROJECT_DELETED);
    } else {
      alert(ERROR_MESSAGES.PROJECT_DELETE_FAILED + ': ' + error);
    }
  };

  // Handle save project
  const handleSaveProject = async (projectData) => {
    let result;
    
    if (editingProject) {
      result = await editProject(editingProject.id, projectData);
      if (result.success) {
        alert(SUCCESS_MESSAGES.PROJECT_UPDATED);
      }
    } else {
      result = await addProject(projectData);
      if (result.success) {
        alert(SUCCESS_MESSAGES.PROJECT_CREATED);
      }
    }

    if (result.success) {
      setShowProjectForm(false);
      setEditingProject(null);
    } else {
      alert(
        (editingProject ? ERROR_MESSAGES.PROJECT_UPDATE_FAILED : ERROR_MESSAGES.PROJECT_CREATE_FAILED) +
        ': ' + result.error
      );
    }
  };

  // Handle preview
  const handlePreview = () => {
    setShowPreview(true);
  };

  if (authLoading) {
    return <Loading message="Loading Portfolio Builder..." />;
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="app">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPreview={handlePreview}
      />

      <div className="container">
        {activeTab === TABS.DASHBOARD && (
          <Dashboard
            projects={projects}
            setActiveTab={setActiveTab}
            onAddProject={handleAddProject}
            onPreview={handlePreview}
          />
        )}

        {activeTab === TABS.PROFILE && <ProfileEditor />}

        {activeTab === TABS.PROJECTS && (
          <ProjectsList
            projects={projects}
            onAdd={handleAddProject}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
          />
        )}
      </div>

      {showProjectForm && (
        <ProjectForm
          project={editingProject}
          onSave={handleSaveProject}
          onCancel={() => {
            setShowProjectForm(false);
            setEditingProject(null);
          }}
        />
      )}

      {showPreview && (
        <PortfolioPreview
          profile={profile}
          projects={projects}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;