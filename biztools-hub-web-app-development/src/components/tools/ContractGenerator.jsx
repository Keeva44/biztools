import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import jsPDF from 'jspdf';

const { FiFile, FiDownload, FiRefreshCw, FiEye } = FiIcons;

const ContractGenerator = () => {
  const [contract, setContract] = useState({
    type: 'service',
    title: '',
    parties: {
      client: {
        name: '',
        address: '',
        email: '',
        phone: ''
      },
      provider: {
        name: '',
        address: '',
        email: '',
        phone: ''
      }
    },
    details: {
      description: '',
      deliverables: '',
      timeline: '',
      payment: {
        amount: '',
        terms: '',
        schedule: ''
      }
    },
    terms: {
      cancellation: '',
      liability: '',
      confidentiality: '',
      intellectual: '',
      additional: ''
    },
    signatures: {
      date: new Date().toISOString().split('T')[0],
      location: ''
    }
  });

  const contractTemplates = {
    service: {
      name: 'Service Agreement',
      description: 'General service contract for freelancers and consultants'
    },
    employment: {
      name: 'Employment Contract',
      description: 'Standard employment agreement'
    },
    nda: {
      name: 'Non-Disclosure Agreement',
      description: 'Confidentiality agreement for protecting sensitive information'
    },
    freelance: {
      name: 'Freelance Contract',
      description: 'Project-based freelance work agreement'
    },
    consulting: {
      name: 'Consulting Agreement',
      description: 'Professional consulting services contract'
    }
  };

  const updateContract = (section, field, value) => {
    if (typeof field === 'object') {
      setContract(prev => ({
        ...prev,
        [section]: { ...prev[section], ...field }
      }));
    } else {
      setContract(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    }
  };

  const updateNestedField = (section, subsection, field, value) => {
    setContract(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const loadTemplate = (templateType) => {
    const templates = {
      service: {
        title: 'Professional Services Agreement',
        details: {
          description: 'The Provider agrees to perform professional services as outlined in this agreement.',
          deliverables: 'Specific deliverables will be defined in project scope documents.',
          timeline: 'Services will be completed within the agreed timeframe.',
          payment: {
            amount: '$5,000',
            terms: 'Net 30 days',
            schedule: '50% upfront, 50% upon completion'
          }
        }
      },
      nda: {
        title: 'Non-Disclosure Agreement',
        details: {
          description: 'This agreement establishes confidentiality obligations between the parties.',
          deliverables: 'Protection of confidential information and trade secrets.',
          timeline: 'This agreement remains in effect for 2 years from signing.',
          payment: {
            amount: 'N/A',
            terms: 'No monetary exchange',
            schedule: 'N/A'
          }
        }
      },
      freelance: {
        title: 'Freelance Work Agreement',
        details: {
          description: 'Independent contractor agreement for specific project work.',
          deliverables: 'Project deliverables as specified in the statement of work.',
          timeline: 'Project completion within specified milestones.',
          payment: {
            amount: '$3,000',
            terms: 'Payment upon milestone completion',
            schedule: 'Milestone-based payments'
          }
        }
      }
    };

    const template = templates[templateType];
    if (template) {
      setContract(prev => ({
        ...prev,
        type: templateType,
        title: template.title,
        details: { ...prev.details, ...template.details }
      }));
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 30;

    // Title
    doc.setFontSize(18);
    doc.setTextColor(59, 130, 246);
    const title = contract.title || contractTemplates[contract.type].name;
    doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Parties
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('PARTIES TO THIS AGREEMENT', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.text('Client:', 20, yPosition);
    yPosition += 8;
    if (contract.parties.client.name) {
      doc.text(contract.parties.client.name, 30, yPosition);
      yPosition += 5;
    }
    if (contract.parties.client.address) {
      doc.text(contract.parties.client.address, 30, yPosition);
      yPosition += 5;
    }
    if (contract.parties.client.email) {
      doc.text(`Email: ${contract.parties.client.email}`, 30, yPosition);
      yPosition += 5;
    }
    if (contract.parties.client.phone) {
      doc.text(`Phone: ${contract.parties.client.phone}`, 30, yPosition);
      yPosition += 5;
    }

    yPosition += 10;
    doc.text('Service Provider:', 20, yPosition);
    yPosition += 8;
    if (contract.parties.provider.name) {
      doc.text(contract.parties.provider.name, 30, yPosition);
      yPosition += 5;
    }
    if (contract.parties.provider.address) {
      doc.text(contract.parties.provider.address, 30, yPosition);
      yPosition += 5;
    }
    if (contract.parties.provider.email) {
      doc.text(`Email: ${contract.parties.provider.email}`, 30, yPosition);
      yPosition += 5;
    }
    if (contract.parties.provider.phone) {
      doc.text(`Phone: ${contract.parties.provider.phone}`, 30, yPosition);
      yPosition += 5;
    }

    yPosition += 20;

    // Contract Details
    doc.setFontSize(14);
    doc.text('CONTRACT DETAILS', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    if (contract.details.description) {
      doc.text('Description of Services:', 20, yPosition);
      yPosition += 8;
      const descLines = doc.splitTextToSize(contract.details.description, pageWidth - 40);
      doc.text(descLines, 20, yPosition);
      yPosition += descLines.length * 5 + 10;
    }

    if (contract.details.deliverables) {
      doc.text('Deliverables:', 20, yPosition);
      yPosition += 8;
      const deliverableLines = doc.splitTextToSize(contract.details.deliverables, pageWidth - 40);
      doc.text(deliverableLines, 20, yPosition);
      yPosition += deliverableLines.length * 5 + 10;
    }

    if (contract.details.timeline) {
      doc.text('Timeline:', 20, yPosition);
      yPosition += 8;
      const timelineLines = doc.splitTextToSize(contract.details.timeline, pageWidth - 40);
      doc.text(timelineLines, 20, yPosition);
      yPosition += timelineLines.length * 5 + 10;
    }

    // Payment Terms
    if (contract.details.payment.amount || contract.details.payment.terms) {
      doc.setFontSize(14);
      doc.text('PAYMENT TERMS', 20, yPosition);
      yPosition += 15;

      doc.setFontSize(12);
      if (contract.details.payment.amount) {
        doc.text(`Amount: ${contract.details.payment.amount}`, 20, yPosition);
        yPosition += 8;
      }
      if (contract.details.payment.terms) {
        doc.text(`Terms: ${contract.details.payment.terms}`, 20, yPosition);
        yPosition += 8;
      }
      if (contract.details.payment.schedule) {
        doc.text(`Schedule: ${contract.details.payment.schedule}`, 20, yPosition);
        yPosition += 8;
      }
      yPosition += 10;
    }

    // Terms and Conditions
    doc.setFontSize(14);
    doc.text('TERMS AND CONDITIONS', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    const terms = [
      { label: 'Cancellation Policy', content: contract.terms.cancellation },
      { label: 'Liability', content: contract.terms.liability },
      { label: 'Confidentiality', content: contract.terms.confidentiality },
      { label: 'Intellectual Property', content: contract.terms.intellectual },
      { label: 'Additional Terms', content: contract.terms.additional }
    ];

    terms.forEach(term => {
      if (term.content) {
        doc.text(`${term.label}:`, 20, yPosition);
        yPosition += 8;
        const termLines = doc.splitTextToSize(term.content, pageWidth - 40);
        doc.text(termLines, 20, yPosition);
        yPosition += termLines.length * 5 + 10;
      }
    });

    // Signatures
    yPosition += 20;
    doc.setFontSize(14);
    doc.text('SIGNATURES', 20, yPosition);
    yPosition += 20;

    doc.setFontSize(12);
    doc.text('Client Signature: _________________________', 20, yPosition);
    doc.text('Date: _____________', pageWidth - 80, yPosition);
    yPosition += 30;

    doc.text('Provider Signature: _________________________', 20, yPosition);
    doc.text('Date: _____________', pageWidth - 80, yPosition);

    if (contract.signatures.location) {
      yPosition += 20;
      doc.text(`Location: ${contract.signatures.location}`, 20, yPosition);
    }

    doc.save(`${contract.title || 'contract'}.pdf`);
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
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiFile} className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contract Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Generate professional contracts and agreements with PDF export
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contract Type & Templates */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contract Type</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Object.entries(contractTemplates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => loadTemplate(key)}
                    className={`p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                      contract.type === key
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{template.description}</p>
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Custom Contract Title"
                value={contract.title}
                onChange={(e) => setContract(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
              />
            </motion.div>

            {/* Parties Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Parties Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Client */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Client</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Client Name"
                      value={contract.parties.client.name}
                      onChange={(e) => updateNestedField('parties', 'client', 'name', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <textarea
                      placeholder="Client Address"
                      value={contract.parties.client.address}
                      onChange={(e) => updateNestedField('parties', 'client', 'address', e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <input
                      type="email"
                      placeholder="Client Email"
                      value={contract.parties.client.email}
                      onChange={(e) => updateNestedField('parties', 'client', 'email', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <input
                      type="tel"
                      placeholder="Client Phone"
                      value={contract.parties.client.phone}
                      onChange={(e) => updateNestedField('parties', 'client', 'phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Provider */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Service Provider</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Provider Name"
                      value={contract.parties.provider.name}
                      onChange={(e) => updateNestedField('parties', 'provider', 'name', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <textarea
                      placeholder="Provider Address"
                      value={contract.parties.provider.address}
                      onChange={(e) => updateNestedField('parties', 'provider', 'address', e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <input
                      type="email"
                      placeholder="Provider Email"
                      value={contract.parties.provider.email}
                      onChange={(e) => updateNestedField('parties', 'provider', 'email', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <input
                      type="tel"
                      placeholder="Provider Phone"
                      value={contract.parties.provider.phone}
                      onChange={(e) => updateNestedField('parties', 'provider', 'phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contract Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contract Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description of Services
                  </label>
                  <textarea
                    placeholder="Describe the services to be provided..."
                    value={contract.details.description}
                    onChange={(e) => updateNestedField('details', 'description', '', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Deliverables
                  </label>
                  <textarea
                    placeholder="List the expected deliverables..."
                    value={contract.details.deliverables}
                    onChange={(e) => updateNestedField('details', 'deliverables', '', e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timeline
                  </label>
                  <textarea
                    placeholder="Specify the project timeline and milestones..."
                    value={contract.details.timeline}
                    onChange={(e) => updateNestedField('details', 'timeline', '', e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>

                {/* Payment Terms */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Terms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Total Amount"
                      value={contract.details.payment.amount}
                      onChange={(e) => updateNestedField('details', 'payment', 'amount', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="Payment Terms"
                      value={contract.details.payment.terms}
                      onChange={(e) => updateNestedField('details', 'payment', 'terms', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="Payment Schedule"
                      value={contract.details.payment.schedule}
                      onChange={(e) => updateNestedField('details', 'payment', 'schedule', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Terms and Conditions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Terms and Conditions</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cancellation Policy
                  </label>
                  <textarea
                    placeholder="Define cancellation terms..."
                    value={contract.terms.cancellation}
                    onChange={(e) => updateNestedField('terms', 'cancellation', '', e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Liability Limitations
                  </label>
                  <textarea
                    placeholder="Define liability limitations..."
                    value={contract.terms.liability}
                    onChange={(e) => updateNestedField('terms', 'liability', '', e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confidentiality
                  </label>
                  <textarea
                    placeholder="Define confidentiality requirements..."
                    value={contract.terms.confidentiality}
                    onChange={(e) => updateNestedField('terms', 'confidentiality', '', e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Intellectual Property
                  </label>
                  <textarea
                    placeholder="Define intellectual property rights..."
                    value={contract.terms.intellectual}
                    onChange={(e) => updateNestedField('terms', 'intellectual', '', e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Terms
                  </label>
                  <textarea
                    placeholder="Any additional terms and conditions..."
                    value={contract.terms.additional}
                    onChange={(e) => updateNestedField('terms', 'additional', '', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Preview & Export */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-20 max-h-screen overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contract Preview</h2>
              <button
                onClick={generatePDF}
                className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
                Export PDF
              </button>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white text-black text-sm max-h-96 overflow-y-auto">
              {/* Contract Title */}
              <div className="text-center mb-6">
                <h1 className="text-lg font-bold text-blue-600">
                  {contract.title || contractTemplates[contract.type].name}
                </h1>
              </div>

              {/* Parties */}
              <div className="mb-6">
                <h2 className="font-bold text-blue-600 mb-2">PARTIES TO THIS AGREEMENT</h2>
                <div className="mb-3">
                  <div className="font-semibold">Client:</div>
                  <div className="ml-4 text-xs">
                    {contract.parties.client.name && <div>{contract.parties.client.name}</div>}
                    {contract.parties.client.address && <div>{contract.parties.client.address}</div>}
                    {contract.parties.client.email && <div>Email: {contract.parties.client.email}</div>}
                    {contract.parties.client.phone && <div>Phone: {contract.parties.client.phone}</div>}
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Service Provider:</div>
                  <div className="ml-4 text-xs">
                    {contract.parties.provider.name && <div>{contract.parties.provider.name}</div>}
                    {contract.parties.provider.address && <div>{contract.parties.provider.address}</div>}
                    {contract.parties.provider.email && <div>Email: {contract.parties.provider.email}</div>}
                    {contract.parties.provider.phone && <div>Phone: {contract.parties.provider.phone}</div>}
                  </div>
                </div>
              </div>

              {/* Contract Details */}
              <div className="mb-6">
                <h2 className="font-bold text-blue-600 mb-2">CONTRACT DETAILS</h2>
                {contract.details.description && (
                  <div className="mb-3">
                    <div className="font-semibold">Description:</div>
                    <div className="text-xs">{contract.details.description}</div>
                  </div>
                )}
                {contract.details.deliverables && (
                  <div className="mb-3">
                    <div className="font-semibold">Deliverables:</div>
                    <div className="text-xs">{contract.details.deliverables}</div>
                  </div>
                )}
                {contract.details.timeline && (
                  <div className="mb-3">
                    <div className="font-semibold">Timeline:</div>
                    <div className="text-xs">{contract.details.timeline}</div>
                  </div>
                )}
              </div>

              {/* Payment Terms */}
              {(contract.details.payment.amount || contract.details.payment.terms) && (
                <div className="mb-6">
                  <h2 className="font-bold text-blue-600 mb-2">PAYMENT TERMS</h2>
                  {contract.details.payment.amount && (
                    <div className="text-xs mb-1">Amount: {contract.details.payment.amount}</div>
                  )}
                  {contract.details.payment.terms && (
                    <div className="text-xs mb-1">Terms: {contract.details.payment.terms}</div>
                  )}
                  {contract.details.payment.schedule && (
                    <div className="text-xs">Schedule: {contract.details.payment.schedule}</div>
                  )}
                </div>
              )}

              {/* Signature Lines */}
              <div className="mt-8 pt-4 border-t">
                <div className="text-xs">
                  <div className="mb-4">
                    Client Signature: ___________________ Date: _________
                  </div>
                  <div>
                    Provider Signature: ___________________ Date: _________
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Legal Disclaimer</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                This contract generator provides basic templates for common business agreements. 
                Please consult with a qualified attorney before using any contract for important 
                business transactions.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContractGenerator;