import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiShield, FiLock, FiEye, FiDatabase } = FiIcons;

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiShield} className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Last updated: December 2024
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8"
        >
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Introduction</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              At BizTools Hub, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our business tools and services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center mb-4">
              <SafeIcon icon={FiDatabase} className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Information We Collect</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Information You Provide</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                  <li>Personal information entered into our tools (names, addresses, contact details)</li>
                  <li>Business information (company names, financial data, project details)</li>
                  <li>Content you create using our tools (invoices, contracts, proposals)</li>
                  <li>Feedback and communications you send to us</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Automatically Collected Information</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                  <li>Usage data and analytics (how you interact with our tools)</li>
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and general location information</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <div className="flex items-center mb-4">
              <SafeIcon icon={FiEye} className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How We Use Your Information</h2>
            </div>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>To provide and improve our business tools and services</li>
              <li>To generate the documents and outputs you request</li>
              <li>To analyze usage patterns and optimize user experience</li>
              <li>To communicate with you about updates and new features</li>
              <li>To ensure security and prevent fraud</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center mb-4">
              <SafeIcon icon={FiLock} className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Security & Storage</h2>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                Local Processing Priority
              </h3>
              <p className="text-blue-800 dark:text-blue-300 text-sm">
                Most of our tools process your data locally in your browser whenever possible. 
                This means your sensitive information often never leaves your device.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>Encryption in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Limited access controls for our team</li>
                <li>Secure data centers with physical protection</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Information Sharing</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              We do not sell, rent, or share your personal information with third parties for their marketing purposes. 
              We may share information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>With your explicit consent</li>
              <li>To comply with legal requirements or court orders</li>
              <li>To protect our rights, property, or safety</li>
              <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
              <li>In case of a business merger or acquisition (with advance notice)</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Rights and Choices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">You have the right to:</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your data</li>
                  <li>Export your data</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">How to exercise your rights:</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                  <li>Contact us at privacy@biztoolshub.com</li>
                  <li>Use the data export features in our tools</li>
                  <li>Clear your browser data for locally stored information</li>
                  <li>Adjust cookie preferences in your browser</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cookies and Tracking</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              We use cookies and similar technologies to improve your experience:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Essential Cookies</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Required for basic functionality</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Analytics Cookies</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Help us understand usage patterns</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Preference Cookies</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Remember your settings and preferences</p>
              </div>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Children's Privacy</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our services are not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If we discover that we have collected information 
              from a child under 13, we will delete it immediately.
            </p>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">International Users</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              BizTools Hub is operated from the United States. If you are accessing our services from outside 
              the US, please be aware that your information may be transferred to, stored, and processed in 
              the United States where our servers are located and our central database is operated.
            </p>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Policy Updates</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. When we make changes, we will notify users 
              by updating the "Last updated" date at the top of this policy. For significant changes, we may 
              provide additional notice through our website or email communications.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <div>Email: privacy@biztoolshub.com</div>
              <div>Address: BizTools Hub Privacy Team</div>
              <div>Response Time: We aim to respond within 48 hours</div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;