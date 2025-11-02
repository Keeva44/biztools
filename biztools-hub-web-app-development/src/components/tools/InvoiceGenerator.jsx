import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import jsPDF from 'jspdf';

const { FiDownload, FiPlus, FiTrash2, FiFileText } = FiIcons;

const InvoiceGenerator = () => {
  const [invoice, setInvoice] = useState({
    invoiceNumber: 'INV-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    from: {
      name: '',
      email: '',
      address: '',
      city: '',
      phone: ''
    },
    to: {
      name: '',
      email: '',
      address: '',
      city: ''
    },
    items: [
      { description: '', quantity: 1, rate: 0, amount: 0 }
    ],
    notes: '',
    terms: ''
  });

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    setInvoice(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      if (field === 'quantity' || field === 'rate') {
        newItems[index].amount = newItems[index].quantity * newItems[index].rate;
      }
      
      return { ...prev, items: newItems };
    });
  };

  const updateField = (section, field, value) => {
    setInvoice(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const calculateTotal = () => {
    return invoice.items.reduce((total, item) => total + item.amount, 0);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246);
    doc.text('INVOICE', 20, 30);
    
    // Invoice details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - 80, 30);
    doc.text(`Date: ${invoice.date}`, pageWidth - 80, 40);
    if (invoice.dueDate) {
      doc.text(`Due Date: ${invoice.dueDate}`, pageWidth - 80, 50);
    }
    
    // From section
    doc.setFontSize(14);
    doc.text('From:', 20, 70);
    doc.setFontSize(12);
    let yPos = 80;
    if (invoice.from.name) doc.text(invoice.from.name, 20, yPos += 10);
    if (invoice.from.email) doc.text(invoice.from.email, 20, yPos += 10);
    if (invoice.from.address) doc.text(invoice.from.address, 20, yPos += 10);
    if (invoice.from.city) doc.text(invoice.from.city, 20, yPos += 10);
    if (invoice.from.phone) doc.text(invoice.from.phone, 20, yPos += 10);
    
    // To section
    doc.setFontSize(14);
    doc.text('Bill To:', pageWidth - 100, 70);
    doc.setFontSize(12);
    yPos = 80;
    if (invoice.to.name) doc.text(invoice.to.name, pageWidth - 100, yPos += 10);
    if (invoice.to.email) doc.text(invoice.to.email, pageWidth - 100, yPos += 10);
    if (invoice.to.address) doc.text(invoice.to.address, pageWidth - 100, yPos += 10);
    if (invoice.to.city) doc.text(invoice.to.city, pageWidth - 100, yPos += 10);
    
    // Items table
    yPos = Math.max(yPos, 140);
    doc.setFontSize(12);
    doc.text('Description', 20, yPos);
    doc.text('Qty', 120, yPos);
    doc.text('Rate', 140, yPos);
    doc.text('Amount', 170, yPos);
    
    doc.line(20, yPos + 5, pageWidth - 20, yPos + 5);
    
    invoice.items.forEach((item, index) => {
      yPos += 15;
      doc.text(item.description || 'Item', 20, yPos);
      doc.text(item.quantity.toString(), 120, yPos);
      doc.text(`$${item.rate.toFixed(2)}`, 140, yPos);
      doc.text(`$${item.amount.toFixed(2)}`, 170, yPos);
    });
    
    doc.line(20, yPos + 5, pageWidth - 20, yPos + 5);
    
    // Total
    yPos += 20;
    doc.setFontSize(14);
    doc.text(`Total: $${calculateTotal().toFixed(2)}`, pageWidth - 60, yPos);
    
    // Notes
    if (invoice.notes) {
      yPos += 30;
      doc.setFontSize(12);
      doc.text('Notes:', 20, yPos);
      doc.text(invoice.notes, 20, yPos + 10);
    }
    
    // Terms
    if (invoice.terms) {
      yPos += 30;
      doc.text('Terms & Conditions:', 20, yPos);
      doc.text(invoice.terms, 20, yPos + 10);
    }
    
    doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
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
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiFileText} className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Invoice Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Create professional invoices and export them as PDF
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Invoice Details</h2>
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) => setInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={invoice.date}
                  onChange={(e) => setInvoice(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* From Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">From</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={invoice.from.name}
                  onChange={(e) => updateField('from', 'name', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={invoice.from.email}
                  onChange={(e) => updateField('from', 'email', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={invoice.from.address}
                  onChange={(e) => updateField('from', 'address', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="City, State, ZIP"
                  value={invoice.from.city}
                  onChange={(e) => updateField('from', 'city', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* To Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bill To</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Client Name"
                  value={invoice.to.name}
                  onChange={(e) => updateField('to', 'name', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <input
                  type="email"
                  placeholder="client@email.com"
                  value={invoice.to.email}
                  onChange={(e) => updateField('to', 'email', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="Client Address"
                  value={invoice.to.address}
                  onChange={(e) => updateField('to', 'address', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="City, State, ZIP"
                  value={invoice.to.city}
                  onChange={(e) => updateField('to', 'city', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Items</h3>
                <button
                  onClick={addItem}
                  className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                  Add Item
                </button>
              </div>
              
              {invoice.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 mb-4 items-end">
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      ${item.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes and Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={invoice.notes}
                  onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Terms & Conditions
                </label>
                <textarea
                  value={invoice.terms}
                  onChange={(e) => setInvoice(prev => ({ ...prev, terms: e.target.value }))}
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Preview</h2>
              <button
                onClick={generatePDF}
                className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 bg-gray-50 dark:bg-gray-700">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">INVOICE</h1>
                </div>
                <div className="text-right text-sm text-gray-600 dark:text-gray-300">
                  <div>Invoice #: {invoice.invoiceNumber}</div>
                  <div>Date: {invoice.date}</div>
                  {invoice.dueDate && <div>Due Date: {invoice.dueDate}</div>}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">From:</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {invoice.from.name && <div>{invoice.from.name}</div>}
                    {invoice.from.email && <div>{invoice.from.email}</div>}
                    {invoice.from.address && <div>{invoice.from.address}</div>}
                    {invoice.from.city && <div>{invoice.from.city}</div>}
                    {invoice.from.phone && <div>{invoice.from.phone}</div>}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Bill To:</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {invoice.to.name && <div>{invoice.to.name}</div>}
                    {invoice.to.email && <div>{invoice.to.email}</div>}
                    {invoice.to.address && <div>{invoice.to.address}</div>}
                    {invoice.to.city && <div>{invoice.to.city}</div>}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="grid grid-cols-12 gap-2 border-b border-gray-300 dark:border-gray-600 pb-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2">Qty</div>
                  <div className="col-span-2">Rate</div>
                  <div className="col-span-2">Amount</div>
                </div>
                {invoice.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 py-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="col-span-6">{item.description || 'Item'}</div>
                    <div className="col-span-2">{item.quantity}</div>
                    <div className="col-span-2">${item.rate.toFixed(2)}</div>
                    <div className="col-span-2">${item.amount.toFixed(2)}</div>
                  </div>
                ))}
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                  <div className="flex justify-end">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      Total: ${calculateTotal().toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
              
              {invoice.notes && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Notes:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{invoice.notes}</p>
                </div>
              )}
              
              {invoice.terms && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Terms & Conditions:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{invoice.terms}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;