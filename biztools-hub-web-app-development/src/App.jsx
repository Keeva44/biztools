import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Tools from './pages/Tools';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import InvoiceGenerator from './components/tools/InvoiceGenerator';
import ReceiptGenerator from './components/tools/ReceiptGenerator';
import PayrollCalculator from './components/tools/PayrollCalculator';
import BudgetPlanner from './components/tools/BudgetPlanner';
import LoanCalculator from './components/tools/LoanCalculator';
import ResumeBuilder from './components/tools/ResumeBuilder';
import BusinessCardGenerator from './components/tools/BusinessCardGenerator';
import ProjectTimeline from './components/tools/ProjectTimeline';
import ContractGenerator from './components/tools/ContractGenerator';
import TodoList from './components/tools/TodoList';
import ProposalGenerator from './components/tools/ProposalGenerator';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="tools" element={<Tools />} />
            <Route path="about" element={<About />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="tools/invoice-generator" element={<InvoiceGenerator />} />
            <Route path="tools/receipt-generator" element={<ReceiptGenerator />} />
            <Route path="tools/payroll-calculator" element={<PayrollCalculator />} />
            <Route path="tools/budget-planner" element={<BudgetPlanner />} />
            <Route path="tools/loan-calculator" element={<LoanCalculator />} />
            <Route path="tools/resume-builder" element={<ResumeBuilder />} />
            <Route path="tools/business-card" element={<BusinessCardGenerator />} />
            <Route path="tools/project-timeline" element={<ProjectTimeline />} />
            <Route path="tools/contract-generator" element={<ContractGenerator />} />
            <Route path="tools/todo-list" element={<TodoList />} />
            <Route path="tools/proposal-generator" element={<ProposalGenerator />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;