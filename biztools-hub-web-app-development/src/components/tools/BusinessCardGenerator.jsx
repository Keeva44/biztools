import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import html2canvas from 'html2canvas';

const { FiCreditCard, FiDownload, FiRefreshCw, FiEye } = FiIcons;

const BusinessCardGenerator = () => {
  const cardRef = useRef(null);
  const [cardData, setCardData] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    linkedin: ''
  });

  const [design, setDesign] = useState({
    template: 'modern',
    primaryColor: '#3B82F6',
    secondaryColor: '#1F2937',
    textColor: '#FFFFFF',
    backgroundColor: '#FFFFFF'
  });

  const templates = {
    modern: {
      name: 'Modern',
      primaryColor: '#3B82F6',
      secondaryColor: '#1F2937',
      textColor: '#FFFFFF',
      backgroundColor: '#FFFFFF'
    },
    elegant: {
      name: 'Elegant',
      primaryColor: '#6366F1',
      secondaryColor: '#4F46E5',
      textColor: '#FFFFFF',
      backgroundColor: '#F8FAFC'
    },
    minimal: {
      name: 'Minimal',
      primaryColor: '#10B981',
      secondaryColor: '#059669',
      textColor: '#FFFFFF',
      backgroundColor: '#FFFFFF'
    },
    creative: {
      name: 'Creative',
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706',
      textColor: '#FFFFFF',
      backgroundColor: '#FEF3C7'
    },
    professional: {
      name: 'Professional',
      primaryColor: '#374151',
      secondaryColor: '#1F2937',
      textColor: '#FFFFFF',
      backgroundColor: '#F9FAFB'
    }
  };

  const updateCardData = (field, value) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const updateDesign = (field, value) => {
    setDesign(prev => ({ ...prev, [field]: value }));
  };

  const applyTemplate = (templateKey) => {
    const template = templates[templateKey];
    setDesign({
      template: templateKey,
      ...template
    });
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true
      });

      const link = document.createElement('a');
      link.download = `business-card-${cardData.name || 'card'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating business card:', error);
    }
  };

  const BusinessCardPreview = () => (
    <div
      ref={cardRef}
      className="w-96 h-56 rounded-lg shadow-2xl overflow-hidden relative"
      style={{
        backgroundColor: design.backgroundColor,
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(135deg, ${design.primaryColor}22 0%, ${design.secondaryColor}22 100%)`
        }}
      />
      
      {/* Main Content */}
      <div className="relative h-full p-6 flex flex-col justify-between">
        {/* Header */}
        <div>
          <h1 
            className="text-2xl font-bold mb-1"
            style={{ color: design.secondaryColor }}
          >
            {cardData.name || 'Your Name'}
          </h1>
          <p 
            className="text-lg font-medium mb-2"
            style={{ color: design.primaryColor }}
          >
            {cardData.title || 'Your Title'}
          </p>
          <p 
            className="text-base font-medium"
            style={{ color: design.secondaryColor }}
          >
            {cardData.company || 'Company Name'}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-1">
          {cardData.email && (
            <p className="text-sm" style={{ color: design.secondaryColor }}>
              📧 {cardData.email}
            </p>
          )}
          {cardData.phone && (
            <p className="text-sm" style={{ color: design.secondaryColor }}>
              📱 {cardData.phone}
            </p>
          )}
          {cardData.website && (
            <p className="text-sm" style={{ color: design.secondaryColor }}>
              🌐 {cardData.website}
            </p>
          )}
          {cardData.linkedin && (
            <p className="text-sm" style={{ color: design.secondaryColor }}>
              💼 {cardData.linkedin}
            </p>
          )}
          {cardData.address && (
            <p className="text-sm" style={{ color: design.secondaryColor }}>
              📍 {cardData.address}
            </p>
          )}
        </div>

        {/* Decorative Element */}
        <div 
          className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-20"
          style={{ backgroundColor: design.primaryColor }}
        />
        <div 
          className="absolute bottom-0 left-0 w-16 h-16 rounded-tr-full opacity-15"
          style={{ backgroundColor: design.secondaryColor }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiCreditCard} className="w-8 h-8 text-pink-600 dark:text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Business Card Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Design professional business cards and download as images
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            {/* Card Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Card Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={cardData.name}
                    onChange={(e) => updateCardData('name', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={cardData.title}
                    onChange={(e) => updateCardData('title', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="Company Name"
                  value={cardData.company}
                  onChange={(e) => updateCardData('company', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={cardData.email}
                    onChange={(e) => updateCardData('email', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={cardData.phone}
                    onChange={(e) => updateCardData('phone', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>
                
                <input
                  type="url"
                  placeholder="Website"
                  value={cardData.website}
                  onChange={(e) => updateCardData('website', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                
                <input
                  type="url"
                  placeholder="LinkedIn Profile"
                  value={cardData.linkedin}
                  onChange={(e) => updateCardData('linkedin', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
                
                <textarea
                  placeholder="Address"
                  value={cardData.address}
                  onChange={(e) => updateCardData('address', e.target.value)}
                  rows={2}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* Design Templates */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Design Templates</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Object.entries(templates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => applyTemplate(key)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      design.template === key
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: template.primaryColor }}
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {template.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Click to apply
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Colors */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Custom Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      value={design.primaryColor}
                      onChange={(e) => updateDesign('primaryColor', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Secondary Color
                    </label>
                    <input
                      type="color"
                      value={design.secondaryColor}
                      onChange={(e) => updateDesign('secondaryColor', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>
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
                onClick={downloadCard}
                className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
                Download PNG
              </button>
            </div>
            
            <div className="flex justify-center items-center min-h-96">
              <BusinessCardPreview />
            </div>

            {/* Tips */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Design Tips</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Keep it simple and professional</li>
                <li>• Use high contrast for readability</li>
                <li>• Include only essential contact information</li>
                <li>• Choose colors that reflect your brand</li>
                <li>• Standard business card size is 3.5" × 2"</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCardGenerator;