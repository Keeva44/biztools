import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { FiCalculator, FiDollarSign, FiTrendingDown, FiPieChart } = FiIcons;

const LoanCalculator = () => {
  const [loan, setLoan] = useState({
    principal: 100000,
    interestRate: 5.0,
    termYears: 30,
    downPayment: 0,
    extraPayment: 0
  });

  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalInterest: 0,
    totalPayment: 0,
    payoffDate: '',
    schedule: []
  });

  useEffect(() => {
    calculateLoan();
  }, [loan]);

  const calculateLoan = () => {
    const { principal, interestRate, termYears, downPayment, extraPayment } = loan;
    
    const loanAmount = principal - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = termYears * 12;
    
    if (loanAmount <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      setResults({
        monthlyPayment: 0,
        totalInterest: 0,
        totalPayment: 0,
        payoffDate: '',
        schedule: []
      });
      return;
    }

    // Calculate monthly payment using the formula
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    // Generate amortization schedule
    let balance = loanAmount;
    let totalInterestPaid = 0;
    const schedule = [];
    let month = 0;
    const currentDate = new Date();

    while (balance > 0.01 && month < numberOfPayments * 2) { // Safety limit
      month++;
      const interestPayment = balance * monthlyRate;
      let principalPayment = monthlyPayment - interestPayment + extraPayment;
      
      if (principalPayment > balance) {
        principalPayment = balance;
      }
      
      balance -= principalPayment;
      totalInterestPaid += interestPayment;
      
      const paymentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + month, currentDate.getDate());
      
      schedule.push({
        month,
        payment: principalPayment + interestPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
        date: paymentDate.toLocaleDateString()
      });
      
      if (balance <= 0.01) break;
    }

    const payoffDate = schedule.length > 0 ? schedule[schedule.length - 1].date : '';
    const totalPayment = monthlyPayment * numberOfPayments + (extraPayment * schedule.length);

    setResults({
      monthlyPayment: monthlyPayment,
      totalInterest: totalInterestPaid,
      totalPayment: totalPayment,
      payoffDate,
      schedule: schedule.slice(0, 60) // Show first 5 years for chart
    });
  };

  const exportSchedule = () => {
    const headers = ['Month', 'Payment Date', 'Payment Amount', 'Principal', 'Interest', 'Balance'];
    const csvData = results.schedule.map(payment => [
      payment.month,
      payment.date,
      payment.payment.toFixed(2),
      payment.principal.toFixed(2),
      payment.interest.toFixed(2),
      payment.balance.toFixed(2)
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loan-amortization-schedule.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const chartData = results.schedule.map(payment => ({
    month: payment.month,
    balance: payment.balance,
    principal: payment.principal,
    interest: payment.interest
  }));

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiCalculator} className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Loan Calculator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Calculate loan payments, interest, and amortization schedule
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Loan Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Loan Amount ($)
                </label>
                <input
                  type="number"
                  value={loan.principal}
                  onChange={(e) => setLoan(prev => ({ ...prev, principal: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="100000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Down Payment ($)
                </label>
                <input
                  type="number"
                  value={loan.downPayment}
                  onChange={(e) => setLoan(prev => ({ ...prev, downPayment: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interest Rate (% per year)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={loan.interestRate}
                  onChange={(e) => setLoan(prev => ({ ...prev, interestRate: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="5.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Loan Term (years)
                </label>
                <input
                  type="number"
                  value={loan.termYears}
                  onChange={(e) => setLoan(prev => ({ ...prev, termYears: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Extra Monthly Payment ($)
                </label>
                <input
                  type="number"
                  value={loan.extraPayment}
                  onChange={(e) => setLoan(prev => ({ ...prev, extraPayment: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Presets</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setLoan({ principal: 250000, interestRate: 6.5, termYears: 30, downPayment: 50000, extraPayment: 0 })}
                  className="p-3 text-left bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <div className="font-medium text-blue-900 dark:text-blue-300">Home Mortgage</div>
                  <div className="text-sm text-blue-700 dark:text-blue-400">$250k, 6.5%, 30yr</div>
                </button>
                <button
                  onClick={() => setLoan({ principal: 25000, interestRate: 4.5, termYears: 5, downPayment: 5000, extraPayment: 0 })}
                  className="p-3 text-left bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <div className="font-medium text-green-900 dark:text-green-300">Auto Loan</div>
                  <div className="text-sm text-green-700 dark:text-green-400">$25k, 4.5%, 5yr</div>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <SafeIcon icon={FiDollarSign} className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Payment</h3>
                    <p className="text-2xl font-bold text-blue-600">${results.monthlyPayment.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-red-500">
                <div className="flex items-center">
                  <SafeIcon icon={FiTrendingDown} className="w-8 h-8 text-red-500 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Interest</h3>
                    <p className="text-2xl font-bold text-red-600">${results.totalInterest.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Loan Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Loan Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${(loan.principal - loan.downPayment).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Down Payment:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${loan.downPayment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Monthly Payment:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${results.monthlyPayment.toFixed(2)}
                  </span>
                </div>
                {loan.extraPayment > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Extra Payment:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${loan.extraPayment.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Total Interest Paid:</span>
                  <span className="font-medium text-red-600">
                    ${results.totalInterest.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
                  <span className="font-semibold text-gray-900 dark:text-white">Total Amount Paid:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ${(loan.principal - loan.downPayment + results.totalInterest).toFixed(2)}
                  </span>
                </div>
                {results.payoffDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Payoff Date:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {results.payoffDate}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={exportSchedule}
              disabled={results.schedule.length === 0}
              className="w-full flex items-center justify-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <SafeIcon icon={FiPieChart} className="w-5 h-5 mr-2" />
              Export Amortization Schedule
            </button>
          </motion.div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Loan Balance Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Balance']} />
                  <Line type="monotone" dataKey="balance" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Payment Schedule Preview */}
        {results.schedule.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Payment Schedule Preview (First 12 Months)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left py-2 text-gray-900 dark:text-white">Month</th>
                    <th className="text-left py-2 text-gray-900 dark:text-white">Payment</th>
                    <th className="text-left py-2 text-gray-900 dark:text-white">Principal</th>
                    <th className="text-left py-2 text-gray-900 dark:text-white">Interest</th>
                    <th className="text-left py-2 text-gray-900 dark:text-white">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {results.schedule.slice(0, 12).map((payment, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2 text-gray-600 dark:text-gray-300">{payment.month}</td>
                      <td className="py-2 text-gray-900 dark:text-white">${payment.payment.toFixed(2)}</td>
                      <td className="py-2 text-green-600">${payment.principal.toFixed(2)}</td>
                      <td className="py-2 text-red-600">${payment.interest.toFixed(2)}</td>
                      <td className="py-2 text-gray-900 dark:text-white">${payment.balance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;