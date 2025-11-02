import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiFileText, FiReceipt, FiDollarSign, FiPieChart, FiCalculator,
  FiUser, FiCreditCard, FiCalendar, FiFile, FiCheckSquare, 
  FiSend, FiArrowRight, FiSearch
} = FiIcons;

const tools = [
  {
    id: 'invoice-generator',
    title: 'Invoice Generator',
    description: 'Create professional invoices with PDF export functionality',
    icon: FiFileText,
    color: 'bg-blue-500',
    path: '/tools/invoice-generator',
    category: 'Finance'
  },
  {
    id: 'receipt-generator',
    title: 'Receipt Generator',
    description: 'Generate receipts for expenses and purchases',
    icon: FiReceipt,
    color: 'bg-green-500',
    path: '/tools/receipt-generator',
    category: 'Finance'
  },
  {
    id: 'payroll-calculator',
    title: 'Payroll Calculator',
    description: 'Calculate employee wages and deductions',
    icon: FiDollarSign,
    color: 'bg-purple-500',
    path: '/tools/payroll-calculator',
    category: 'Finance'
  },
  {
    id: 'budget-planner',
    title: 'Budget Planner',
    description: 'Plan and visualize your budget with interactive charts',
    icon: FiPieChart,
    color: 'bg-yellow-500',
    path: '/tools/budget-planner',
    category: 'Finance'
  },
  {
    id: 'loan-calculator',
    title: 'Loan Calculator',
    description: 'Calculate loan payments and interest rates',
    icon: FiCalculator,
    color: 'bg-red-500',
    path: '/tools/loan-calculator',
    category: 'Finance'
  },
  {
    id: 'resume-builder',
    title: 'Resume Builder',
    description: 'Build professional resumes with PDF export',
    icon: FiUser,
    color: 'bg-indigo-500',
    path: '/tools/resume-builder',
    category: 'HR'
  },
  {
    id: 'business-card',
    title: 'Business Card Generator',
    description: 'Design and download professional business cards',
    icon: FiCreditCard,
    color: 'bg-pink-500',
    path: '/tools/business-card',
    category: 'Marketing'
  },
  {
    id: 'project-timeline',
    title: 'Project Timeline',
    description: 'Plan projects with Gantt-style timelines',
    icon: FiCalendar,
    color: 'bg-teal-500',
    path: '/tools/project-timeline',
    category: 'Project Management'
  },
  {
    id: 'contract-generator',
    title: 'Contract Generator',
    description: 'Generate contracts and agreements with PDF export',
    icon: FiFile,
    color: 'bg-orange-500',
    path: '/tools/contract-generator',
    category: 'Legal'
  },
  {
    id: 'todo-list',
    title: 'To-Do List',
    description: 'Manage tasks with deadlines and CSV export',
    icon: FiCheckSquare,
    color: 'bg-cyan-500',
    path: '/tools/todo-list',
    category: 'Productivity'
  },
  {
    id: 'proposal-generator',
    title: 'Proposal Generator',
    description: 'Create professional proposals and quotations',
    icon: FiSend,
    color: 'bg-emerald-500',
    path: '/tools/proposal-generator',
    category: 'Sales'
  }
];

const categories = ['All', 'Finance', 'HR', 'Marketing', 'Project Management', 'Legal', 'Productivity', 'Sales'];

const Tools = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Business Tools
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover our comprehensive collection of free tools designed to help your business grow and operate efficiently.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Link
                to={tool.path}
                className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 h-full"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`${tool.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <SafeIcon icon={tool.icon} className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full mb-2">
                        {tool.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {tool.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm flex-1">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                      Try it now
                    </span>
                    <SafeIcon 
                      icon={FiArrowRight} 
                      className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" 
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredTools.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              <SafeIcon icon={FiSearch} className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No tools found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Tools;