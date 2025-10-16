import React, { useState } from 'react';
import { Settings } from 'lucide-react';

interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  isConnected: boolean;
  color: string;
}

const ConnectedApps: React.FC = () => {
  const [apps, setApps] = useState<App[]>([
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication platform with channels for group discussions and direct messaging.',
      icon: '💬',
      isConnected: true,
      color: 'bg-purple-100',
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Gmail is a free email service by Google that offers robust spam protection & 15GB of storage.',
      icon: '📧',
      isConnected: true,
      color: 'bg-red-100',
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Google Calendar is a web-based scheduling tool that allows users to create, manage, and share events.',
      icon: '📅',
      isConnected: true,
      color: 'bg-blue-100',
    },
    {
      id: 'github',
      name: 'Github',
      description: 'Github is a web-based platform for version control and collaboration, allowing developers to host & review code.',
      icon: '🐙',
      isConnected: true,
      color: 'bg-gray-100',
    },
  ]);

  const handleToggleConnection = (appId: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, isConnected: !app.isConnected } : app
      )
    );
  };

  const handleConnectNewApp = () => {
    console.log('Initiating new app connection');
    // Here you would typically open a modal or redirect to an OAuth flow
  };


  function loginWithGoogle(popup = true) {
  const redirectUri = 'http://localhost:5173/admin/dashboard/profile?tab=security';
  const stateObj = { redirectUri, popup };
  const stateParam = encodeURIComponent(JSON.stringify(stateObj));

  const googleUrl = `http://localhost:7000/admin/google?state=${stateParam}`;

  if (popup) {
    const popupWindow = window.open(googleUrl, 'Google Login', 'width=500,height=600');

    window.addEventListener('message', (event) => {
      if (event.origin !== 'http://localhost:7000') return;
      const data = event.data;

      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = data.redirect;
      } else if (data.redirect) {
        window.location.href = data.redirect;
      }
    });
  } else {
    window.location.href = googleUrl;
  }
}

  const ToggleSwitch: React.FC<{ isOn: boolean; onToggle: () => void }> = ({
    isOn,
    onToggle,
  }) => (
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {apps.map((app) => (
          <div
            key={app.id}
            className="bg-white border border-gray-200 rounded p-3 hover:shadow-sm transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2 flex-1">
                {/* App Icon */}
                <div
                  className={`w-8 h-8 ${app.color} rounded flex items-center justify-center flex-shrink-0`}
                >
                  {app.id === 'slack' && (
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-4 h-4">
                        <path
                          fill="#E01E5A"
                          d="M5.042 15.165a2.528 2.528 0 0 1-2.52-2.523c0-1.393 1.127-2.52 2.52-2.52h2.52v2.52c0 1.396-1.127 2.523-2.52 2.523"
                        />
                        <path
                          fill="#36C5F0"
                          d="M8.562 15.165c-1.393 0-2.52-1.127-2.52-2.523V5.52c0-1.393 1.127-2.52 2.52-2.52c1.396 0 2.523 1.127 2.523 2.52v7.122c0 1.396-1.127 2.523-2.523 2.523"
                        />
                        <path
                          fill="#2EB67D"
                          d="M8.562 18.958a2.528 2.528 0 0 1-2.52-2.52c0-1.393 1.127-2.523 2.52-2.523h2.52v2.523c0 1.393-1.127 2.52-2.52 2.52"
                        />
                        <path
                          fill="#ECB22E"
                          d="M8.562 5.52c0-1.393 1.127-2.52 2.523-2.52c1.393 0 2.52 1.127 2.52 2.52v2.52h-2.52c-1.396 0-2.523-1.127-2.523-2.52"
                        />
                      </svg>
                    </div>
                  )}
                  {app.id === 'gmail' && (
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-4 h-4">
                        <path
                          fill="#4285F4"
                          d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.909L12 10.09l9.455-6.269h.909c.904 0 1.636.732 1.636 1.636z"
                        />
                        <path
                          fill="#34A853"
                          d="M0 5.457v1.027l12 7.5 12-7.5V5.457c0-.904-.732-1.636-1.636-1.636L12 10.09 1.636 3.821C.732 3.821 0 4.553 0 5.457z"
                        />
                      </svg>
                    </div>
                  )}
                  {app.id === 'google-calendar' && (
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-4 h-4">
                        <path
                          fill="#1a73e8"
                          d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.89-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
                        />
                      </svg>
                    </div>
                  )}
                  {app.id === 'github' && (
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#24292e">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* App Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{app.name}</h3>
                  <p className="text-xs text-gray-600">{app.description}</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="ml-2 flex-shrink-0">
                <ToggleSwitch
                  isOn={app.isConnected}
                  onToggle={() => handleToggleConnection(app.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New App Section */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <button
            onClick={()=>loginWithGoogle(true)}
            className="px-4 py-1.5 bg-primary-500 text-white text-xs font-medium rounded hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Connect New App
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectedApps;