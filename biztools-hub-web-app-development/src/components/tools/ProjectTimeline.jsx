import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiCalendar, FiPlus, FiTrash2, FiDownload, FiClock, FiUsers, FiTarget } = FiIcons;

const ProjectTimeline = () => {
  const [project, setProject] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    tasks: [
      {
        id: 1,
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        assignee: '',
        status: 'pending',
        dependencies: []
      }
    ]
  });

  const statusColors = {
    pending: { bg: 'bg-gray-200', text: 'text-gray-800', border: 'border-gray-300' },
    'in-progress': { bg: 'bg-blue-200', text: 'text-blue-800', border: 'border-blue-300' },
    completed: { bg: 'bg-green-200', text: 'text-green-800', border: 'border-green-300' },
    blocked: { bg: 'bg-red-200', text: 'text-red-800', border: 'border-red-300' }
  };

  const addTask = () => {
    const newId = Math.max(...project.tasks.map(task => task.id), 0) + 1;
    setProject(prev => ({
      ...prev,
      tasks: [...prev.tasks, {
        id: newId,
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        assignee: '',
        status: 'pending',
        dependencies: []
      }]
    }));
  };

  const removeTask = (id) => {
    setProject(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== id)
    }));
  };

  const updateTask = (id, field, value) => {
    setProject(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === id ? { ...task, [field]: value } : task
      )
    }));
  };

  const updateProject = (field, value) => {
    setProject(prev => ({ ...prev, [field]: value }));
  };

  const calculateTaskDuration = (task) => {
    if (!task.startDate || !task.endDate) return 0;
    return differenceInDays(new Date(task.endDate), new Date(task.startDate)) + 1;
  };

  const calculateProjectDuration = () => {
    if (!project.startDate || !project.endDate) return 0;
    return differenceInDays(new Date(project.endDate), new Date(project.startDate)) + 1;
  };

  const getTaskProgress = () => {
    const total = project.tasks.length;
    const completed = project.tasks.filter(task => task.status === 'completed').length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const exportTimeline = () => {
    const timelineData = {
      project: {
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        duration: calculateProjectDuration(),
        progress: getTaskProgress()
      },
      tasks: project.tasks.map(task => ({
        id: task.id,
        name: task.name,
        description: task.description,
        startDate: task.startDate,
        endDate: task.endDate,
        duration: calculateTaskDuration(task),
        assignee: task.assignee,
        status: task.status,
        dependencies: task.dependencies
      }))
    };

    const csvHeaders = [
      'Task ID', 'Task Name', 'Description', 'Start Date', 'End Date', 
      'Duration (Days)', 'Assignee', 'Status', 'Dependencies'
    ];

    const csvData = timelineData.tasks.map(task => [
      task.id,
      task.name,
      task.description,
      task.startDate,
      task.endDate,
      task.duration,
      task.assignee,
      task.status,
      task.dependencies.join('; ')
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name || 'project'}-timeline.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateGanttChart = () => {
    if (!project.startDate || !project.endDate) return [];

    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.endDate);
    const totalDays = differenceInDays(projectEnd, projectStart) + 1;

    return project.tasks.map(task => {
      if (!task.startDate || !task.endDate) return null;

      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      
      const startOffset = differenceInDays(taskStart, projectStart);
      const duration = differenceInDays(taskEnd, taskStart) + 1;
      
      const leftPosition = (startOffset / totalDays) * 100;
      const width = (duration / totalDays) * 100;

      return {
        ...task,
        leftPosition: Math.max(0, leftPosition),
        width: Math.min(width, 100 - leftPosition),
        duration
      };
    }).filter(Boolean);
  };

  const ganttTasks = generateGanttChart();

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiCalendar} className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Project Timeline Planner
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Plan and visualize your projects with Gantt-style timelines
          </p>
        </motion.div>

        {/* Project Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-teal-500">
            <div className="flex items-center">
              <SafeIcon icon={FiTarget} className="w-8 h-8 text-teal-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Duration</h3>
                <p className="text-2xl font-bold text-teal-600">{calculateProjectDuration()} days</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <SafeIcon icon={FiClock} className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Tasks</h3>
                <p className="text-2xl font-bold text-blue-600">{project.tasks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <SafeIcon icon={FiUsers} className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progress</h3>
                <p className="text-2xl font-bold text-green-600">{getTaskProgress()}%</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Project Details & Tasks */}
          <div className="xl:col-span-2 space-y-8">
            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Project Details</h2>
                <button
                  onClick={exportTimeline}
                  className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={project.name}
                  onChange={(e) => updateProject('name', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={project.startDate}
                    onChange={(e) => updateProject('startDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="date"
                    value={project.endDate}
                    onChange={(e) => updateProject('endDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <textarea
                placeholder="Project Description"
                value={project.description}
                onChange={(e) => updateProject('description', e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
              />
            </motion.div>

            {/* Tasks */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h2>
                <button
                  onClick={addTask}
                  className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                  Add Task
                </button>
              </div>
              
              <div className="space-y-4">
                <AnimatePresence>
                  {project.tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Task {task.id}
                        </h3>
                        {project.tasks.length > 1 && (
                          <button
                            onClick={() => removeTask(task.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Task Name"
                          value={task.name}
                          onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                        />
                        <input
                          type="text"
                          placeholder="Assignee"
                          value={task.assignee}
                          onChange={(e) => updateTask(task.id, 'assignee', e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                          type="date"
                          value={task.startDate}
                          onChange={(e) => updateTask(task.id, 'startDate', e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <input
                          type="date"
                          value={task.endDate}
                          onChange={(e) => updateTask(task.id, 'endDate', e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <select
                          value={task.status}
                          onChange={(e) => updateTask(task.id, 'status', e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="blocked">Blocked</option>
                        </select>
                      </div>
                      
                      <textarea
                        placeholder="Task Description"
                        value={task.description}
                        onChange={(e) => updateTask(task.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                      />
                      
                      {/* Task Status Badge */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status].bg} ${statusColors[task.status].text}`}>
                          {task.status.replace('-', ' ').toUpperCase()}
                        </span>
                        {task.startDate && task.endDate && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Duration: {calculateTaskDuration(task)} days
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Gantt Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Timeline View</h2>
            
            {project.startDate && project.endDate ? (
              <div className="space-y-4">
                {/* Timeline Header */}
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex justify-between">
                    <span>{format(new Date(project.startDate), 'MMM dd, yyyy')}</span>
                    <span>{format(new Date(project.endDate), 'MMM dd, yyyy')}</span>
                  </div>
                </div>

                {/* Gantt Bars */}
                <div className="space-y-3">
                  {ganttTasks.map((task, index) => (
                    <div key={task.id} className="relative">
                      <div className="flex items-center mb-2">
                        <div className="w-32 truncate text-sm font-medium text-gray-900 dark:text-white">
                          {task.name || `Task ${task.id}`}
                        </div>
                        <div className="flex-1 ml-4">
                          <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded">
                            <div
                              className={`absolute h-full rounded ${
                                statusColors[task.status].bg.replace('200', '400')
                              }`}
                              style={{
                                left: `${task.leftPosition}%`,
                                width: `${task.width}%`
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 ml-36">
                        <span>{task.startDate}</span>
                        <span>{task.assignee}</span>
                        <span>{task.endDate}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Overall Progress
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {getTaskProgress()}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getTaskProgress()}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <SafeIcon icon={FiCalendar} className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Set project start and end dates to view timeline</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;