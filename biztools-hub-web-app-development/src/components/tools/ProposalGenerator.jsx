import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import jsPDF from 'jspdf';

const { FiSend, FiDownload, FiPlus, FiTrash2, FiDollarSign } = FiIcons;

const ProposalGenerator = () => {
  const [proposal, setProposal] = useState({
    type: 'business',
    title: '',
    client: {
      name: '',
      company: '',
      email: '',
      address: ''
    },
    provider: {
      name: '',
      company: '',
      email: '',
      phone: '',
      address: ''
    },
    project: {
      overview: '',
      objectives: '',
      scope: '',
      methodology: '',
      timeline: '',
      deliverables: ''
    },
    pricing: {
      items: [
        { id: 1, description: '', quantity: 1, rate: 0, total: 0 }
      ],
      discount: 0,
      tax: 0,
      notes: ''
    },
    terms: {
      payment: '',
      timeline: '',
      revisions: '',
      additional: ''
    }
  });

  const proposalTypes = {
    business: 'Business Proposal',
    project: 'Project Proposal',
    service: 'Service Proposal',
    consulting: 'Consulting Proposal',
    marketing: 'Marketing Proposal'
  };

  const addPricingItem = () => {
    const newId = Math.max(...proposal.pricing.items.map(item => item.id), 0) + 1;
    setProposal(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        items: [...prev.pricing.items, {
          id: newId,
          description: '',
          quantity: 1,
          rate: 0,
          total: 0
        }]
      }
    }));
  };

  const removePricingItem = (id) => {
    setProposal(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        items: prev.pricing.items.filter(item => item.id !== id)
      }
    }));
  };

  const updatePricingItem = (id, field, value) => {
    setProposal(prev => {
      const newItems = prev.pricing.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.total = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      });

      return {
        ...prev,
        pricing: { ...prev.pricing, items: newItems }
      };
    });
  };

  const updateField = (section, field, value) => {
    setProposal(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const calculateSubtotal = () => {
    return proposal.pricing.items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = subtotal * (proposal.pricing.discount / 100);
    const taxAmount = (subtotal - discountAmount) * (proposal.pricing.tax / 100);
    return subtotal - discountAmount + taxAmount;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 30;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94);
    doc.text(proposal.title || proposalTypes[proposal.type], pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Provider Info
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('FROM:', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    if (proposal.provider.name) {
      doc.text(proposal.provider.name, 20, yPosition);
      yPosition += 6;
    }
    if (proposal.provider.company) {
      doc.text(proposal.provider.company, 20, yPosition);
      yPosition += 6;
    }
    if (proposal.provider.email) {
      doc.text(`Email: ${proposal.provider.email}`, 20, yPosition);
      yPosition += 6;
    }
    if (proposal.provider.phone) {
      doc.text(`Phone: ${proposal.provider.phone}`, 20, yPosition);
      yPosition += 6;
    }

    yPosition += 15;

    // Client Info
    doc.setFontSize(14);
    doc.text('TO:', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    if (proposal.client.name) {
      doc.text(proposal.client.name, 20, yPosition);
      yPosition += 6;
    }
    if (proposal.client.company) {
      doc.text(proposal.client.company, 20, yPosition);
      yPosition += 6;
    }
    if (proposal.client.email) {
      doc.text(`Email: ${proposal.client.email}`, 20, yPosition);
      yPosition += 6;
    }

    yPosition += 20;

    // Project Overview
    if (proposal.project.overview) {
      doc.setFontSize(14);
      doc.setTextColor(34, 197, 94);
      doc.text('PROJECT OVERVIEW', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const overviewLines = doc.splitTextToSize(proposal.project.overview, pageWidth - 40);
      doc.text(overviewLines, 20, yPosition);
      yPosition += overviewLines.length * 5 + 15;
    }

    // Objectives
    if (proposal.project.objectives) {
      doc.setFontSize(14);
      doc.setTextColor(34, 197, 94);
      doc.text('OBJECTIVES', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const objectiveLines = doc.splitTextToSize(proposal.project.objectives, pageWidth - 40);
      doc.text(objectiveLines, 20, yPosition);
      yPosition += objectiveLines.length * 5 + 15;
    }

    // Scope of Work
    if (proposal.project.scope) {
      doc.setFontSize(14);
      doc.setTextColor(34, 197, 94);
      doc.text('SCOPE OF WORK', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const scopeLines = doc.splitTextToSize(proposal.project.scope, pageWidth - 40);
      doc.text(scopeLines, 20, yPosition);
      yPosition += scopeLines.length * 5 + 15;
    }

    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }

    // Pricing
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94);
    doc.text('INVESTMENT', 20, yPosition);
    yPosition += 15;

    // Pricing table header
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Description', 20, yPosition);
    doc.text('Qty', 120, yPosition);
    doc.text('Rate', 140, yPosition);
    doc.text('Total', 170, yPosition);

    doc.line(20, yPosition + 3, pageWidth - 20, yPosition + 3);
    yPosition += 10;

    // Pricing items
    proposal.pricing.items.forEach(item => {
      if (item.description) {
        doc.setFontSize(11);
        doc.text(item.description, 20, yPosition);
        doc.text(item.quantity.toString(), 120, yPosition);
        doc.text(`$${item.rate.toFixed(2)}`, 140, yPosition);
        doc.text(`$${item.total.toFixed(2)}`, 170, yPosition);
        yPosition += 8;
      }
    });

    doc.line(20, yPosition + 2, pageWidth - 20, yPosition + 2);
    yPosition += 10;

    // Totals
    const subtotal = calculateSubtotal();
    const total = calculateTotal();

    doc.setFontSize(12);
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, pageWidth - 80, yPosition);
    yPosition += 8;

    if (proposal.pricing.discount > 0) {
      doc.text(`Discount (${proposal.pricing.discount}%): -$${(subtotal * proposal.pricing.discount / 100).toFixed(2)}`, pageWidth - 80, yPosition);
      yPosition += 8;
    }

    if (proposal.pricing.tax > 0) {
      doc.text(`Tax (${proposal.pricing.tax}%): $${((subtotal - subtotal * proposal.pricing.discount / 100) * proposal.pricing.tax / 100).toFixed(2)}`, pageWidth - 80, yPosition);
      yPosition += 8;
    }

    doc.setFontSize(14);
    doc.text(`Total: $${total.toFixed(2)}`, pageWidth - 80, yPosition);

    yPosition += 20;

    // Terms
    if (proposal.terms.payment || proposal.terms.timeline) {
      doc.setFontSize(14);
      doc.setTextColor(34, 197, 94);
      doc.text('TERMS & CONDITIONS', 20, yPosition);
      yPosition += 15;

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);

      if (proposal.terms.payment) {
        doc.text('Payment Terms:', 20, yPosition);
        yPosition += 6;
        const paymentLines = doc.splitTextToSize(proposal.terms.payment, pageWidth - 40);
        doc.text(paymentLines, 20, yPosition);
        yPosition += paymentLines.length * 5 + 10;
      }

      if (proposal.terms.timeline) {
        doc.text('Project Timeline:', 20, yPosition);
        yPosition += 6;
        const timelineLines = doc.splitTextToSize(proposal.terms.timeline, pageWidth - 40);
        doc.text(timelineLines, 20, yPosition);
        yPosition += timelineLines.length * 5 + 10;
      }
    }

    doc.save(`${proposal.title || 'proposal'}.pdf`);
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
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiSend} className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Proposal Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Create professional proposals and quotations with PDF export
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Proposal Type & Basic Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Proposal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <select
                  value={proposal.type}
                  onChange={(e) => setProposal(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {Object.entries(proposalTypes).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Proposal Title"
                  value={proposal.title}
                  onChange={(e) => setProposal(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>

              {/* Client & Provider Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Client Information</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Client Name"
                      value={proposal.client.name}
                      onChange={(e) => updateField('client', 'name', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={proposal.client.company}
                      onChange={(e) => updateField('client', 'company', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <input
                      type="email"
                      placeholder="Client Email"
                      value={proposal.client.email}
                      onChange={(e) => updateField('client', 'email', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Information</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={proposal.provider.name}
                      onChange={(e) => updateField('provider', 'name', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="Your Company"
                      value={proposal.provider.company}
                      onChange={(e) => updateField('provider', 'company', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={proposal.provider.email}
                      onChange={(e) => updateField('provider', 'email', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Project Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Overview
                  </label>
                  <textarea
                    placeholder="Provide a high-level overview of the project..."
                    value={proposal.project.overview}
                    onChange={(e) => updateField('project', 'overview', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Objectives
                  </label>
                  <textarea
                    placeholder="List the main objectives and goals..."
                    value={proposal.project.objectives}
                    onChange={(e) => updateField('project', 'objectives', e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scope of Work
                  </label>
                  <textarea
                    placeholder="Define what work will be included..."
                    value={proposal.project.scope}
                    onChange={(e) => updateField('project', 'scope', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Methodology
                    </label>
                    <textarea
                      placeholder="Describe your approach..."
                      value={proposal.project.methodology}
                      onChange={(e) => updateField('project', 'methodology', e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timeline
                    </label>
                    <textarea
                      placeholder="Project timeline and milestones..."
                      value={proposal.project.timeline}
                      onChange={(e) => updateField('project', 'timeline', e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Pricing */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Investment</h2>
                <button
                  onClick={addPricingItem}
                  className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                  Add Item
                </button>
              </div>
              
              {proposal.pricing.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 mb-4 items-end">
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updatePricingItem(item.id, 'description', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updatePricingItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => updatePricingItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      ${item.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() => removePricingItem(item.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="number"
                    placeholder="Discount %"
                    value={proposal.pricing.discount}
                    onChange={(e) => updateField('pricing', 'discount', parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Tax %"
                    value={proposal.pricing.tax}
                    onChange={(e) => updateField('pricing', 'tax', parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <div className="flex items-center">
                    <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-2xl font-bold text-green-600">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Terms */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Terms & Conditions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Terms
                  </label>
                  <textarea
                    placeholder="Payment schedule and terms..."
                    value={proposal.terms.payment}
                    onChange={(e) => updateField('terms', 'payment', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Timeline
                  </label>
                  <textarea
                    placeholder="Project milestones and deadlines..."
                    value={proposal.terms.timeline}
                    onChange={(e) => updateField('terms', 'timeline', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>
              </div>
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
                Export PDF
              </button>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white text-black text-sm">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-lg font-bold text-emerald-600">
                  {proposal.title || proposalTypes[proposal.type]}
                </h1>
              </div>

              {/* From/To */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
                <div>
                  <div className="font-semibold mb-2">FROM:</div>
                  {proposal.provider.name && <div>{proposal.provider.name}</div>}
                  {proposal.provider.company && <div>{proposal.provider.company}</div>}
                  {proposal.provider.email && <div>{proposal.provider.email}</div>}
                </div>
                <div>
                  <div className="font-semibold mb-2">TO:</div>
                  {proposal.client.name && <div>{proposal.client.name}</div>}
                  {proposal.client.company && <div>{proposal.client.company}</div>}
                  {proposal.client.email && <div>{proposal.client.email}</div>}
                </div>
              </div>

              {/* Project Overview */}
              {proposal.project.overview && (
                <div className="mb-4">
                  <h2 className="font-bold text-emerald-600 mb-2 text-sm">PROJECT OVERVIEW</h2>
                  <p className="text-xs leading-relaxed">{proposal.project.overview}</p>
                </div>
              )}

              {/* Pricing */}
              {proposal.pricing.items.some(item => item.description) && (
                <div className="mb-4">
                  <h2 className="font-bold text-emerald-600 mb-2 text-sm">INVESTMENT</h2>
                  <div className="text-xs">
                    {proposal.pricing.items.map(item => (
                      item.description && (
                        <div key={item.id} className="flex justify-between mb-1">
                          <span>{item.description} (x{item.quantity})</span>
                          <span>${item.total.toFixed(2)}</span>
                        </div>
                      )
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms */}
              {proposal.terms.payment && (
                <div className="mb-4">
                  <h2 className="font-bold text-emerald-600 mb-2 text-sm">PAYMENT TERMS</h2>
                  <p className="text-xs">{proposal.terms.payment}</p>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">Proposal Summary</h4>
              <div className="text-sm text-emerald-700 dark:text-emerald-400 space-y-1">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>{proposal.pricing.items.filter(item => item.description).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProposalGenerator;