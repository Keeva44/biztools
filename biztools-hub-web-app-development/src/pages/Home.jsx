import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiFileText, FiReceipt, FiDollarSign, FiPieChart, FiCalculator,
  FiUser, FiCreditCard, FiCalendar, FiFile, FiCheckSquare, 
  FiSend, FiArrowRight, FiStar, FiUsers, FiTrendingUp
} = FiIcons;

const tools = [
  {
    id: 'invoice-generator',
    title: 'Invoice Generator',
    description: 'Create professional invoices with PDF export',
    icon: FiFileText,
    color: 'bg-blue-500',
    path: '/tools/invoice-generator'
  },
  {
    id: 'receipt-generator',
    title: 'Receipt Generator',
    description: 'Generate receipts for expenses and purchases',
    icon: FiReceipt,
    color: 'bg-green-500',
    path: '/tools/receipt-generator'
  },
  {
    id: 'payroll-calculator',
    title: 'Payroll Calculator',
    description: 'Calculate employee wages and deductions',
    icon: FiDollarSign,
    color: 'bg-purple-500',
    path: '/tools/payroll-calculator'
  },
  {
    id: 'budget-planner',
    title: 'Budget Planner',
    description: 'Plan and visualize your budget with charts',
    icon: FiPieChart,
    color: 'bg-yellow-500',
    path: '/tools/budget-planner'
  },
  {
    id: 'loan-calculator',
    title: 'Loan Calculator',
    description: 'Calculate loan payments and interest',
    icon: FiCalculator,
    color: 'bg-red-500',
    path: '/tools/loan-calculator'
  },
  {
    id: 'resume-builder',
    title: 'Resume Builder',
    description: 'Build professional resumes with PDF export',
    icon: FiUser,
    color: 'bg-indigo-500',
    path: '/tools/resume-builder'
  },
  {
    id: 'business-card',
    title: 'Business Card Generator',
    description: 'Design and download business cards',
    icon: FiCreditCard,
    color: 'bg-pink-500',
    path: '/tools/business-card'
  },
  {
    id: 'project-timeline',
    title: 'Project Timeline',
    description: 'Plan projects with Gantt-style timelines',
    icon: FiCalendar,
    color: 'bg-teal-500',
    path: '/tools/project-timeline'
  },
  {
    id: 'contract-generator',
    title: 'Contract Generator',
    description: 'Generate contracts and agreements',
    icon: FiFile,
    color: 'bg-orange-500',
    path: '/tools/contract-generator'
  },
  {
    id: 'todo-list',
    title: 'To-Do List',
    description: 'Manage tasks with deadlines and CSV export',
    icon: FiCheckSquare,
    color: 'bg-cyan-500',
    path: '/tools/todo-list'
  },
  {
    id: 'proposal-generator',
    title: 'Proposal Generator',
    description: 'Create professional proposals and quotations',
    icon: FiSend,
    color: 'bg-emerald-500',
    path: '/tools/proposal-generator'
  }
];

const stats = [
  { label: 'Active Users', value: '10,000+', icon: FiUsers },
  { label: 'Tools Available', value: '11', icon: FiStar },
  { label: 'Documents Generated', value: '50,000+', icon: FiTrendingUp }
];

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Free Business Tools for
              <span className="block text-primary-200">Small Businesses</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Everything you need to run your business efficiently. Generate invoices, 
              track expenses, plan projects, and more - all completely free.
            </p>
            <Link
              to="/tools"
              className="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors duration-200"
            >
              Explore Tools
              <SafeIcon icon={FiArrowRight} className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={stat.icon} className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Tools for Your Business
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose from our collection of professional-grade tools designed specifically 
              for small businesses and freelancers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
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
                  className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`${tool.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <SafeIcon icon={tool.icon} className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {tool.description}
                      </p>
                    </div>
                    <SafeIcon 
                      icon={FiArrowRight} 
                      className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" 
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Streamline Your Business?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of small businesses using our free tools to save time and increase productivity.
            </p>
            <Link
              to="/tools"
              className="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors duration-200"
            >
              Get Started Now
              <SafeIcon icon={FiArrowRight} className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;