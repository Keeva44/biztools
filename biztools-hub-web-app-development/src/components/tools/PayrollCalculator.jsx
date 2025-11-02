import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiDollarSign, FiCalculator, FiDownload, FiUser } = FiIcons;

const PayrollCalculator = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: '',
      hourlyRate: 0,
      hoursWorked: 0,
      overtimeHours: 0,
      deductions: {
        federal: 0,
        state: 0,
        social: 0,
        medicare: 0,
        insurance: 0,
        retirement: 0
      }
    }
  ]);

  const addEmployee = () => {
    const newId = Math.max(...employees.map(e => e.id), 0) + 1;
    setEmployees(prev => [...prev, {
      id: newId,
      name: '',
      hourlyRate: 0,
      hoursWorked: 0,
      overtimeHours: 0,
      deductions: {
        federal: 0,
        state: 0,
        social: 0,
        medicare: 0,
        insurance: 0,
        retirement: 0
      }
    }]);
  };

  const removeEmployee = (id) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const updateEmployee = (id, field, value) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, [field]: value } : emp
    ));
  };

  const updateDeduction = (id, deductionType, value) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id 
        ? { ...emp, deductions: { ...emp.deductions, [deductionType]: value } }
        : emp
    ));
  };

  const calculateGrossPay = (employee) => {
    const regularPay = employee.hourlyRate * employee.hoursWorked;
    const overtimePay = employee.overtimeHours * employee.hourlyRate * 1.5;
    return regularPay + overtimePay;
  };

  const calculateTotalDeductions = (employee) => {
    return Object.values(employee.deductions).reduce((sum, deduction) => sum + deduction, 0);
  };

  const calculateNetPay = (employee) => {
    return calculateGrossPay(employee) - calculateTotalDeductions(employee);
  };

  const exportPayroll = () => {
    const payrollData = employees.map(emp => ({
      name: emp.name,
      hourlyRate: emp.hourlyRate,
      hoursWorked: emp.hoursWorked,
      overtimeHours: emp.overtimeHours,
      grossPay: calculateGrossPay(emp),
      totalDeductions: calculateTotalDeductions(emp),
      netPay: calculateNetPay(emp),
      ...emp.deductions
    }));

    const csvHeaders = [
      'Name', 'Hourly Rate', 'Hours Worked', 'Overtime Hours', 'Gross Pay',
      'Federal Tax', 'State Tax', 'Social Security', 'Medicare', 'Insurance', 
      'Retirement', 'Total Deductions', 'Net Pay'
    ];

    const csvData = payrollData.map(emp => [
      emp.name,
      emp.hourlyRate,
      emp.hoursWorked,
      emp.overtimeHours,
      emp.grossPay.toFixed(2),
      emp.federal.toFixed(2),
      emp.state.toFixed(2),
      emp.social.toFixed(2),
      emp.medicare.toFixed(2),
      emp.insurance.toFixed(2),
      emp.retirement.toFixed(2),
      emp.totalDeductions.toFixed(2),
      emp.netPay.toFixed(2)
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payroll-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalGrossPay = employees.reduce((sum, emp) => sum + calculateGrossPay(emp), 0);
  const totalDeductions = employees.reduce((sum, emp) => sum + calculateTotalDeductions(emp), 0);
  const totalNetPay = employees.reduce((sum, emp) => sum + calculateNetPay(emp), 0);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiDollarSign} className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Payroll Calculator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Calculate employee wages and deductions with detailed breakdown
          </p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Gross Pay</h3>
            <p className="text-3xl font-bold text-green-600">${totalGrossPay.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Deductions</h3>
            <p className="text-3xl font-bold text-red-600">${totalDeductions.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Net Pay</h3>
            <p className="text-3xl font-bold text-blue-600">${totalNetPay.toFixed(2)}</p>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Payroll</h2>
            <div className="flex space-x-4">
              <button
                onClick={addEmployee}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <SafeIcon icon={FiUser} className="w-4 h-4 mr-2" />
                Add Employee
              </button>
              <button
                onClick={exportPayroll}
                disabled={employees.length === 0}
                className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </motion.div>

        {/* Employee Cards */}
        <div className="space-y-6">
          {employees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Employee #{employee.id}
                </h3>
                {employees.length > 1 && (
                  <button
                    onClick={() => removeEmployee(employee.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Basic Info */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Employee Name
                      </label>
                      <input
                        type="text"
                        value={employee.name}
                        onChange={(e) => updateEmployee(employee.id, 'name', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter employee name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hourly Rate ($)
                      </label>
                      <input
                        type="number"
                        value={employee.hourlyRate}
                        onChange={(e) => updateEmployee(employee.id, 'hourlyRate', parseFloat(e.target.value) || 0)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Regular Hours Worked
                      </label>
                      <input
                        type="number"
                        value={employee.hoursWorked}
                        onChange={(e) => updateEmployee(employee.id, 'hoursWorked', parseFloat(e.target.value) || 0)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Overtime Hours (1.5x rate)
                      </label>
                      <input
                        type="number"
                        value={employee.overtimeHours}
                        onChange={(e) => updateEmployee(employee.id, 'overtimeHours', parseFloat(e.target.value) || 0)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Deductions ($)</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Federal Tax
                      </label>
                      <input
                        type="number"
                        value={employee.deductions.federal}
                        onChange={(e) => updateDeduction(employee.id, 'federal', parseFloat(e.target.value) || 0)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State Tax
                      </label>
                      <input
                        type="number"
                        value={employee.deductions.state}
                        onChange={(e) => updateDeduction(employee.id, 'state', parseFloat(e.target.value) || 0)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Social Security
                      </label>
                      <input
                        type="number"
                        value={employee.deductions.social}
                        onChange={(e) => updateDeduction(employee.id, 'social', parseFloat(e.target.value) || 0)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Medicare
                      </label>
                      <input
                        type="number"
                        value={employee.deductions.medicare}
                        onChange={(e) => updateDeduction(employee.id, 'medicare', parseFloat(e.target.value) || 0)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Insurance
                      </label>
                      <input
                        type="number"
                        value={employee.deductions.insurance}
                        onChange={(e) => updateDeduction(employee.id, 'insurance', parseFloat(e.target.value) || 0)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Retirement/401k
                      </label>
                      <input
                        type="number"
                        value={employee.deductions.retirement}
                        onChange={(e) => updateDeduction(employee.id, 'retirement', parseFloat(e.target.value) || 0)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Calculations */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Pay Summary</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Regular Pay:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${(employee.hourlyRate * employee.hoursWorked).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Overtime Pay:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${(employee.overtimeHours * employee.hourlyRate * 1.5).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
                      <span className="font-semibold text-gray-900 dark:text-white">Gross Pay:</span>
                      <span className="font-bold text-green-600">
                        ${calculateGrossPay(employee).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Total Deductions:</span>
                      <span className="font-medium text-red-600">
                        -${calculateTotalDeductions(employee).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
                      <span className="font-semibold text-gray-900 dark:text-white">Net Pay:</span>
                      <span className="font-bold text-blue-600 text-lg">
                        ${calculateNetPay(employee).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PayrollCalculator;