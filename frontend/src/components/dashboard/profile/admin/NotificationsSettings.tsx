import React, { useState } from 'react';
import { X } from 'lucide-react';

const NotificationsSettings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    newHire: { push: true, sms: true, email: true },
    timeOff: { push: true, sms: true, email: true },
    performance: { push: true, sms: true, email: true },
    payroll: { push: true, sms: true, email: true },
    jobApplications: { push: true, sms: true, email: true },
    systemAlerts: { push: true, sms: true, email: true },
  });

  const handleToggle = (category: string, type: 'push' | 'sms' | 'email') => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type],
      },
    }));
  };

  const handleSave = () => {
    console.log('Saving notification settings:', notifications);
    // Here you would typically make an API call to save the notification settings
  };

  const ToggleSwitch: React.FC<{ isOn: boolean; onToggle: () => void }> = ({ isOn, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        isOn ? 'bg-primary-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform duration-200 ${
          isOn ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const notificationModules = [
    {
      key: 'newHire',
      title: 'New Hire and Onboarding Notifications',
      description: 'Alerts when a new hire is added to the system.',
    },
    {
      key: 'timeOff',
      title: 'Time Off and Leave Requests',
      description: 'Notifications when leave requests are approved or rejected.',
    },
    {
      key: 'performance',
      title: 'Employee Performance and Review Updates',
      description: 'Notifications when performance reviews are submitted or updated.',
    },
    {
      key: 'payroll',
      title: 'Payroll and Compensation',
      description: 'Alerts when payroll is processed or pending approval.',
    },
    {
      key: 'jobApplications',
      title: 'Job Applications and Recruitment',
      description: 'Alerts when a new job application is submitted or a candidate moves to the next stage.',
    },
    {
      key: 'systemAlerts',
      title: 'General System Alerts',
      description: 'Alerts for system updates or critical events.',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="bg-gray-50 px-4 py-2 rounded-t border border-gray-200">
        <div className="grid grid-cols-12 gap-3 items-center">
          <div className="col-span-6">
            <h3 className="text-xs font-medium text-gray-600">Modules</h3>
          </div>
          <div className="col-span-2 text-center">
            <h3 className="text-xs font-medium text-gray-600">Push</h3>
          </div>
          <div className="col-span-2 text-center">
            <h3 className="text-xs font-medium text-gray-600">SMS</h3>
          </div>
          <div className="col-span-2 text-center">
            <h3 className="text-xs font-medium text-gray-600">Email</h3>
          </div>
        </div>
      </div>

      {/* Notification Rows */}
      <div className="bg-white border border-gray-200 rounded-b">
        {notificationModules.map((module, index) => (
          <div
            key={module.key}
            className={`px-4 py-3 ${
              index !== notificationModules.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-6">
                <h4 className="text-xs font-medium text-gray-900 mb-0.5">{module.title}</h4>
                <p className="text-xs text-gray-500">{module.description}</p>
              </div>
              <div className="col-span-2 flex justify-center">
                <ToggleSwitch
                  isOn={notifications[module.key].push}
                  onToggle={() => handleToggle(module.key, 'push')}
                />
              </div>
              <div className="col-span-2 flex justify-center">
                <ToggleSwitch
                  isOn={notifications[module.key].sms}
                  onToggle={() => handleToggle(module.key, 'sms')}
                />
              </div>
              <div className="col-span-2 flex justify-center">
                <ToggleSwitch
                  isOn={notifications[module.key].email}
                  onToggle={() => handleToggle(module.key, 'email')}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className="px-4 py-1.5 bg-primary-500 text-white text-xs font-medium rounded hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default NotificationsSettings;