import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiPieChart, FiPlus, FiTrash2, FiDownload } = FiIcons;

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

const BudgetPlanner = () => {
  const [budget, setBudget] = useState({
    income: 0,
    categories: [
      { name: 'Housing', amount: 0, color: COLORS[0] },
      { name: 'Food', amount: 0, color: COLORS[1] },
      { name: 'Transportation', amount: 0, color: COLORS[2] },
      { name: 'Entertainment', amount: 0, color: COLORS[3] },
      { name: 'Savings', amount: 0, color: COLORS[4] }
    ]
  });

  const addCategory = () => {
    const newColor = COLORS[budget.categories.length % COLORS.length];
    setBudget(prev => ({
      ...prev,
      categories: [...prev.categories, { name: '', amount: 0, color: newColor }]
    }));
  };

  const removeCategory = (index) => {
    setBudget(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const updateCategory = (index, field, value) => {
    setBudget(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === index ? { ...cat, [field]: value } : cat
      )
    }));
  };

  const totalExpenses = budget.categories.reduce((sum, cat) => sum + cat.amount, 0);
  const remaining = budget.income - totalExpenses;

  const chartData = budget.categories
    .filter(cat => cat.amount > 0)
    .map(cat => ({
      name: cat.name,
      value: cat.amount,
      color: cat.color
    }));

  const exportData = () => {
    const data = {
      income: budget.income,
      totalExpenses,
      remaining,
      categories: budget.categories
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'budget-plan.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiPieChart} className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Budget Planner
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Plan and visualize your budget with interactive charts
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Budget Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Budget Details</h2>
              <button
                onClick={exportData}
                className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>

            {/* Income */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monthly Income
              </label>
              <input
                type="number"
                value={budget.income}
                onChange={(e) => setBudget(prev => ({ ...prev, income: parseFloat(e.target.value) || 0 }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your monthly income"
              />
            </div>

            {/* Categories */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Expense Categories</h3>
                <button
                  onClick={addCategory}
                  className="flex items-center bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>

              <div className="space-y-3">
                {budget.categories.map((category, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => updateCategory(index, 'name', e.target.value)}
                      placeholder="Category name"
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    <input
                      type="number"
                      value={category.amount}
                      onChange={(e) => updateCategory(index, 'amount', parseFloat(e.target.value) || 0)}
                      placeholder="Amount"
                      className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    <button
                      onClick={() => removeCategory(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Budget Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Total Income:</span>
                  <span className="font-medium text-gray-900 dark:text-white">${budget.income.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Total Expenses:</span>
                  <span className="font-medium text-gray-900 dark:text-white">${totalExpenses.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
                  <span className="font-semibold text-gray-900 dark:text-white">Remaining:</span>
                  <span className={`font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${remaining.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Expense Ratio:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {budget.income > 0 ? ((totalExpenses / budget.income) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chart Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Budget Visualization</h2>

            {chartData.length > 0 ? (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <SafeIcon icon={FiPieChart} className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Add budget categories to see visualization</p>
                </div>
              </div>
            )}

            {/* Budget Tips */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Budget Tips</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Aim to save at least 20% of your income</li>
                <li>• Housing should not exceed 30% of income</li>
                <li>• Track your expenses regularly</li>
                <li>• Build an emergency fund</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;