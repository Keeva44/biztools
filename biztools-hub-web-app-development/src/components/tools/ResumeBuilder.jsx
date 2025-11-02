import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import jsPDF from 'jspdf';

const { FiUser, FiDownload, FiPlus, FiTrash2, FiEye } = FiIcons;

const ResumeBuilder = () => {
  const [resume, setResume] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      linkedin: ''
    },
    summary: '',
    experience: [
      {
        id: 1,
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }
    ],
    education: [
      {
        id: 1,
        institution: '',
        degree: '',
        field: '',
        graduationDate: '',
        gpa: ''
      }
    ],
    skills: [],
    projects: [
      {
        id: 1,
        name: '',
        description: '',
        technologies: '',
        link: ''
      }
    ]
  });

  const [newSkill, setNewSkill] = useState('');

  const addExperience = () => {
    const newId = Math.max(...resume.experience.map(exp => exp.id), 0) + 1;
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: newId,
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    }));
  };

  const removeExperience = (id) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const updateExperience = (id, field, value) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addEducation = () => {
    const newId = Math.max(...resume.education.map(edu => edu.id), 0) + 1;
    setResume(prev => ({
      ...prev,
      education: [...prev.education, {
        id: newId,
        institution: '',
        degree: '',
        field: '',
        graduationDate: '',
        gpa: ''
      }]
    }));
  };

  const removeEducation = (id) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const updateEducation = (id, field, value) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !resume.skills.includes(newSkill.trim())) {
      setResume(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addProject = () => {
    const newId = Math.max(...resume.projects.map(proj => proj.id), 0) + 1;
    setResume(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: newId,
        name: '',
        description: '',
        technologies: '',
        link: ''
      }]
    }));
  };

  const removeProject = (id) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const updateProject = (id, field, value) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const updatePersonalInfo = (field, value) => {
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text(resume.personalInfo.fullName || 'Your Name', 20, yPosition);
    
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Contact Info
    const contactInfo = [];
    if (resume.personalInfo.email) contactInfo.push(resume.personalInfo.email);
    if (resume.personalInfo.phone) contactInfo.push(resume.personalInfo.phone);
    if (resume.personalInfo.address) contactInfo.push(resume.personalInfo.address);
    
    doc.text(contactInfo.join(' | '), 20, yPosition);
    yPosition += 5;
    
    if (resume.personalInfo.website || resume.personalInfo.linkedin) {
      const links = [];
      if (resume.personalInfo.website) links.push(resume.personalInfo.website);
      if (resume.personalInfo.linkedin) links.push(resume.personalInfo.linkedin);
      doc.text(links.join(' | '), 20, yPosition);
    }
    
    yPosition += 15;

    // Summary
    if (resume.summary) {
      doc.setFontSize(14);
      doc.setTextColor(59, 130, 246);
      doc.text('PROFESSIONAL SUMMARY', 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const summaryLines = doc.splitTextToSize(resume.summary, pageWidth - 40);
      doc.text(summaryLines, 20, yPosition);
      yPosition += summaryLines.length * 5 + 10;
    }

    // Experience
    if (resume.experience.some(exp => exp.company || exp.position)) {
      doc.setFontSize(14);
      doc.setTextColor(59, 130, 246);
      doc.text('PROFESSIONAL EXPERIENCE', 20, yPosition);
      yPosition += 10;
      
      resume.experience.forEach(exp => {
        if (exp.company || exp.position) {
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text(`${exp.position || 'Position'} - ${exp.company || 'Company'}`, 20, yPosition);
          yPosition += 5;
          
          if (exp.startDate || exp.endDate) {
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            const dates = `${exp.startDate || 'Start'} - ${exp.current ? 'Present' : exp.endDate || 'End'}`;
            doc.text(dates, 20, yPosition);
            yPosition += 5;
          }
          
          if (exp.description) {
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            const descLines = doc.splitTextToSize(exp.description, pageWidth - 40);
            doc.text(descLines, 20, yPosition);
            yPosition += descLines.length * 4 + 5;
          }
          
          yPosition += 5;
        }
      });
    }

    // Education
    if (resume.education.some(edu => edu.institution || edu.degree)) {
      doc.setFontSize(14);
      doc.setTextColor(59, 130, 246);
      doc.text('EDUCATION', 20, yPosition);
      yPosition += 10;
      
      resume.education.forEach(edu => {
        if (edu.institution || edu.degree) {
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text(`${edu.degree || 'Degree'} in ${edu.field || 'Field'}`, 20, yPosition);
          yPosition += 5;
          
          doc.setFontSize(11);
          doc.text(`${edu.institution || 'Institution'}${edu.graduationDate ? ` - ${edu.graduationDate}` : ''}`, 20, yPosition);
          yPosition += 5;
          
          if (edu.gpa) {
            doc.text(`GPA: ${edu.gpa}`, 20, yPosition);
            yPosition += 5;
          }
          
          yPosition += 5;
        }
      });
    }

    // Skills
    if (resume.skills.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(59, 130, 246);
      doc.text('SKILLS', 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(resume.skills.join(', '), 20, yPosition);
      yPosition += 10;
    }

    // Projects
    if (resume.projects.some(proj => proj.name)) {
      doc.setFontSize(14);
      doc.setTextColor(59, 130, 246);
      doc.text('PROJECTS', 20, yPosition);
      yPosition += 10;
      
      resume.projects.forEach(proj => {
        if (proj.name) {
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text(proj.name, 20, yPosition);
          yPosition += 5;
          
          if (proj.description) {
            doc.setFontSize(11);
            const projLines = doc.splitTextToSize(proj.description, pageWidth - 40);
            doc.text(projLines, 20, yPosition);
            yPosition += projLines.length * 4;
          }
          
          if (proj.technologies) {
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Technologies: ${proj.technologies}`, 20, yPosition);
            yPosition += 4;
          }
          
          if (proj.link) {
            doc.text(`Link: ${proj.link}`, 20, yPosition);
            yPosition += 4;
          }
          
          yPosition += 5;
        }
      });
    }

    doc.save(`${resume.personalInfo.fullName || 'resume'}.pdf`);
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiUser} className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Resume Builder
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Create a professional resume and export as PDF
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={resume.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={resume.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={resume.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={resume.personalInfo.address}
                  onChange={(e) => updatePersonalInfo('address', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <input
                  type="url"
                  placeholder="Website/Portfolio"
                  value={resume.personalInfo.website}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <input
                  type="url"
                  placeholder="LinkedIn Profile"
                  value={resume.personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>
            </motion.div>

            {/* Professional Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Professional Summary</h2>
              <textarea
                placeholder="Write a brief summary of your professional background and key achievements..."
                value={resume.summary}
                onChange={(e) => setResume(prev => ({ ...prev, summary: e.target.value }))}
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
              />
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Work Experience</h2>
                <button
                  onClick={addExperience}
                  className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                  Add Experience
                </button>
              </div>
              
              {resume.experience.map((exp) => (
                <div key={exp.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Experience {exp.id}</h3>
                    {resume.experience.length > 1 && (
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <input
                      type="month"
                      placeholder="Start Date"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="month"
                        placeholder="End Date"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        disabled={exp.current}
                        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                      />
                      <label className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                          className="mr-1"
                        />
                        Current
                      </label>
                    </div>
                  </div>
                  
                  <textarea
                    placeholder="Job description, responsibilities, and achievements..."
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>
              ))}
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h2>
                <button
                  onClick={addEducation}
                  className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                  Add Education
                </button>
              </div>
              
              {resume.education.map((edu) => (
                <div key={edu.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Education {edu.id}</h3>
                    {resume.education.length > 1 && (
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Institution Name"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="Field of Study"
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <input
                      type="month"
                      placeholder="Graduation Date"
                      value={edu.graduationDate}
                      onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="GPA (Optional)"
                      value={edu.gpa}
                      onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Skills</h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-primary-600 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Projects */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
                <button
                  onClick={addProject}
                  className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                  Add Project
                </button>
              </div>
              
              {resume.projects.map((project) => (
                <div key={project.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Project {project.id}</h3>
                    {resume.projects.length > 1 && (
                      <button
                        onClick={() => removeProject(project.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={project.name}
                      onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <input
                      type="url"
                      placeholder="Project Link (Optional)"
                      value={project.link}
                      onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                  </div>
                  
                  <textarea
                    placeholder="Project description..."
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 mb-4"
                  />
                  
                  <input
                    type="text"
                    placeholder="Technologies used (comma separated)"
                    value={project.technologies}
                    onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-20 max-h-screen overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Preview</h2>
              <button
                onClick={generatePDF}
                className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white text-black text-sm">
              {/* Header */}
              <div className="text-center mb-4 border-b pb-4">
                <h1 className="text-xl font-bold text-blue-600 mb-2">
                  {resume.personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="text-xs space-y-1">
                  {resume.personalInfo.email && <div>{resume.personalInfo.email}</div>}
                  {resume.personalInfo.phone && <div>{resume.personalInfo.phone}</div>}
                  {resume.personalInfo.address && <div>{resume.personalInfo.address}</div>}
                  {resume.personalInfo.website && <div>{resume.personalInfo.website}</div>}
                  {resume.personalInfo.linkedin && <div>{resume.personalInfo.linkedin}</div>}
                </div>
              </div>
              
              {/* Summary */}
              {resume.summary && (
                <div className="mb-4">
                  <h2 className="text-sm font-bold text-blue-600 mb-2">PROFESSIONAL SUMMARY</h2>
                  <p className="text-xs leading-relaxed">{resume.summary}</p>
                </div>
              )}
              
              {/* Experience */}
              {resume.experience.some(exp => exp.company || exp.position) && (
                <div className="mb-4">
                  <h2 className="text-sm font-bold text-blue-600 mb-2">PROFESSIONAL EXPERIENCE</h2>
                  {resume.experience.map(exp => (
                    (exp.company || exp.position) && (
                      <div key={exp.id} className="mb-3">
                        <div className="font-semibold text-xs">
                          {exp.position || 'Position'} - {exp.company || 'Company'}
                        </div>
                        {(exp.startDate || exp.endDate) && (
                          <div className="text-xs text-gray-600 mb-1">
                            {exp.startDate || 'Start'} - {exp.current ? 'Present' : exp.endDate || 'End'}
                          </div>
                        )}
                        {exp.description && (
                          <div className="text-xs leading-relaxed">{exp.description}</div>
                        )}
                      </div>
                    )
                  ))}
                </div>
              )}
              
              {/* Education */}
              {resume.education.some(edu => edu.institution || edu.degree) && (
                <div className="mb-4">
                  <h2 className="text-sm font-bold text-blue-600 mb-2">EDUCATION</h2>
                  {resume.education.map(edu => (
                    (edu.institution || edu.degree) && (
                      <div key={edu.id} className="mb-2">
                        <div className="font-semibold text-xs">
                          {edu.degree || 'Degree'} in {edu.field || 'Field'}
                        </div>
                        <div className="text-xs">
                          {edu.institution || 'Institution'}
                          {edu.graduationDate && ` - ${edu.graduationDate}`}
                        </div>
                        {edu.gpa && (
                          <div className="text-xs">GPA: {edu.gpa}</div>
                        )}
                      </div>
                    )
                  ))}
                </div>
              )}
              
              {/* Skills */}
              {resume.skills.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-sm font-bold text-blue-600 mb-2">SKILLS</h2>
                  <div className="text-xs">{resume.skills.join(', ')}</div>
                </div>
              )}
              
              {/* Projects */}
              {resume.projects.some(proj => proj.name) && (
                <div>
                  <h2 className="text-sm font-bold text-blue-600 mb-2">PROJECTS</h2>
                  {resume.projects.map(proj => (
                    proj.name && (
                      <div key={proj.id} className="mb-3">
                        <div className="font-semibold text-xs">{proj.name}</div>
                        {proj.description && (
                          <div className="text-xs leading-relaxed mb-1">{proj.description}</div>
                        )}
                        {proj.technologies && (
                          <div className="text-xs text-gray-600">Technologies: {proj.technologies}</div>
                        )}
                        {proj.link && (
                          <div className="text-xs text-gray-600">Link: {proj.link}</div>
                        )}
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;