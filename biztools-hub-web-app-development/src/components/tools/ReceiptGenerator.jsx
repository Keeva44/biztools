import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import jsPDF from 'jspdf';

const { FiDownload, FiPlus, FiTrash2, FiReceipt } = FiIcons;

const ReceiptGenerator = () => {
  const [receipt, setReceipt] = useState({
    receiptNumber: 'RCP-001',
    date: new Date().toISOString().split('T')[0],
    business: {
      name: '',
      address: '',
      phone: '',
      email: ''
    },
    customer: {
      name: '',
      email: ''
    },
    items: [
      { description: '', quantity: 1, price: 0, total: 0 }
    ],
    tax: 0,
    notes: ''
  });

  const addItem = () => {
    setReceipt(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0, total: 0 }]
    }));
  };

  const removeItem = (index) => {
    setReceipt(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    setReceipt(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      if (field === 'quantity' || field === 'price') {
        newItems[index].total = newItems[index].quantity * newItems[index].price;
      }
      
      return { ...prev, items: newItems };
    });
  };

  const updateField = (section, field, value) => {
    setReceipt(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const calculateSubtotal = () => {
    return receipt.items.reduce((total, item) => total + item.total, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + (subtotal * receipt.tax / 100);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(34, 197, 94);
    doc.text('RECEIPT', 20, 30);
    
    // Receipt details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Receipt #: ${receipt.receiptNumber}`, pageWidth - 80, 30);
    doc.text(`Date: ${receipt.date}`, pageWidth - 80, 40);
    
    // Business section
    doc.setFontSize(14);
    doc.text('From:', 20, 70);
    doc.setFontSize(12);
    let yPos = 80;
    if (receipt.business.name) doc.text(receipt.business.name, 20, yPos += 10);
    if (receipt.business.address) doc.text(receipt.business.address, 20, yPos += 10);
    if (receipt.business.phone) doc.text(receipt.business.phone, 20, yPos += 10);
    if (receipt.business.email) doc.text(receipt.business.email, 20, yPos += 10);
    
    // Customer section
    if (receipt.customer.name || receipt.customer.email) {
      doc.setFontSize(14);
      doc.text('To:', pageWidth - 100, 70);
      doc.setFontSize(12);
      yPos = 80;
      if (receipt.customer.name) doc.text(receipt.customer.name, pageWidth - 100, yPos += 10);
      if (receipt.customer.email) doc.text(receipt.customer.email, pageWidth - 100, yPos += 10);
    }
    
    // Items table
    yPos = Math.max(yPos, 140);
    doc.setFontSize(12);
    doc.text('Description', 20, yPos);
    doc.text('Qty', 120, yPos);
    doc.text('Price', 140, yPos);
    doc.text('Total', 170, yPos);
    
    doc.line(20, yPos + 5, pageWidth - 20, yPos + 5);
    
    receipt.items.forEach((item) => {
      yPos += 15;
      doc.text(item.description || 'Item', 20, yPos);
      doc.text(item.quantity.toString(), 120, yPos);
      doc.text(`$${item.price.toFixed(2)}`, 140, yPos);
      doc.text(`$${item.total.toFixed(2)}`, 170, yPos);
    });
    
    doc.line(20, yPos + 5, pageWidth - 20, yPos + 5);
    
    // Totals
    yPos += 20;
    const subtotal = calculateSubtotal();
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, pageWidth - 80, yPos);
    
    if (receipt.tax > 0) {
      yPos += 10;
      doc.text(`Tax (${receipt.tax}%): $${(subtotal * receipt.tax / 100).toFixed(2)}`, pageWidth - 80, yPos);
    }
    
    yPos += 15;
    doc.setFontSize(14);
    doc.text(`Total: $${calculateTotal().toFixed(2)}`, pageWidth - 80, yPos);
    
    // Notes
    if (receipt.notes) {
      yPos += 30;
      doc.setFontSize(12);
      doc.text('Notes:', 20, yPos);
      doc.text(receipt.notes, 20, yPos + 10);
    }
    
    doc.save(`receipt-${receipt.receiptNumber}.pdf`);
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
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiReceipt} className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Receipt Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Generate professional receipts with PDF export
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Receipt Details</h2>
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Receipt Number
                </label>
                <input
                  type="text"
                  value={receipt.receiptNumber}
                  onChange={(e) => setReceipt(prev => ({ ...prev, receiptNumber: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={receipt.date}
                  onChange={(e) => setReceipt(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Business Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Business Name"
                  value={receipt.business.name}
                  onChange={(e) => updateField('business', 'name', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={receipt.business.address}
                  onChange={(e) => updateField('business', 'address', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={receipt.business.phone}
                  onChange={(e) => updateField('business', 'phone', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={receipt.business.email}
                  onChange={(e) => updateField('business', 'email', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* Customer Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={receipt.customer.name}
                  onChange={(e) => updateField('customer', 'name', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <input
                  type="email"
                  placeholder="Customer Email"
                  value={receipt.customer.email}
                  onChange={(e) => updateField('customer', 'email', e.target.value)}
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
              
              {receipt.items.map((item, index) => (
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
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
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
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tax and Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={receipt.tax}
                  onChange={(e) => setReceipt(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={receipt.notes}
                  onChange={(e) => setReceipt(prev => ({ ...prev, notes: e.target.value }))}
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
                  <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">RECEIPT</h1>
                </div>
                <div className="text-right text-sm text-gray-600 dark:text-gray-300">
                  <div>Receipt #: {receipt.receiptNumber}</div>
                  <div>Date: {receipt.date}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">From:</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {receipt.business.name && <div>{receipt.business.name}</div>}
                    {receipt.business.address && <div>{receipt.business.address}</div>}
                    {receipt.business.phone && <div>{receipt.business.phone}</div>}
                    {receipt.business.email && <div>{receipt.business.email}</div>}
                  </div>
                </div>
                {(receipt.customer.name || receipt.customer.email) && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">To:</h3>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {receipt.customer.name && <div>{receipt.customer.name}</div>}
                      {receipt.customer.email && <div>{receipt.customer.email}</div>}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <div className="grid grid-cols-12 gap-2 border-b border-gray-300 dark:border-gray-600 pb-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2">Qty</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Total</div>
                </div>
                {receipt.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 py-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="col-span-6">{item.description || 'Item'}</div>
                    <div className="col-span-2">{item.quantity}</div>
                    <div className="col-span-2">${item.price.toFixed(2)}</div>
                    <div className="col-span-2">${item.total.toFixed(2)}</div>
                  </div>
                ))}
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                  <div className="flex justify-end space-y-1 flex-col">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Subtotal: ${calculateSubtotal().toFixed(2)}
                    </div>
                    {receipt.tax > 0 && (
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Tax ({receipt.tax}%): ${(calculateSubtotal() * receipt.tax / 100).toFixed(2)}
                      </div>
                    )}
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      Total: ${calculateTotal().toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
              
              {receipt.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Notes:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{receipt.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptGenerator;