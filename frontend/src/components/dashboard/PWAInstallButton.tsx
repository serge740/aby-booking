import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
    
    if (isIOS) {
      setPlatform('ios');
    } else if (isAndroid) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Check if app is already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const isInWebAppMode = window.navigator.standalone === true;

    if (isStandalone || isInWebAppMode) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed the prompt
    const dismissed = sessionStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      console.log("beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    const handleAppInstalled = () => {
      console.log("PWA was installed");
      setShowButton(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Show button after delay if criteria met
    const timer = setTimeout(() => {
      if (!isInstalled && !dismissed) {
        // For iOS/Safari, show manual instructions
        if (isIOS && isSafari) {
          setShowButton(true);
        }
        // For browsers that fired beforeinstallprompt
        else if (deferredPrompt) {
          setShowButton(true);
        }
        // For other browsers, show generic instructions
        else if (!isIOS) {
          setShowButton(true);
        }
      }
    }, 2000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearTimeout(timer);
    };
  }, [deferredPrompt, isInstalled]);

  const getInstallInstructions = () => {
    if (platform === 'ios') {
      return {
        title: 'Install on iPhone/iPad',
        steps: [
          'Tap the Share button (□↑) at the bottom',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" to confirm'
        ]
      };
    } else if (platform === 'android') {
      return {
        title: 'Install on Android',
        steps: [
          'Tap the menu (⋮) in the browser',
          'Select "Add to Home screen" or "Install app"',
          'Tap "Install" to confirm'
        ]
      };
    } else {
      return {
        title: 'Install App',
        steps: [
          'Click the install icon in your browser address bar',
          'Or use your browser menu to install',
          'Confirm the installation when prompted'
        ]
      };
    }
  };

  const handleInstallClick = async () => {
    // If we have the deferred prompt (Chrome, Edge, etc.)
    if (deferredPrompt) {
      try {
        const result = await deferredPrompt.prompt();
        console.log("Install prompt result:", result);

        if (result.outcome === "accepted") {
          console.log("User accepted the install prompt");
          setShowButton(false);
          setIsInstalled(true);
        }
        
        setDeferredPrompt(null);
      } catch (error) {
        console.error("Error showing install prompt:", error);
      }
    } else {
      // Show instructions modal
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowButton(false);
    sessionStorage.setItem("pwa-install-dismissed", "true");
  };

  // Don't show if installed
  if (isInstalled || !showButton) {
    return null;
  }

  const instructions = getInstallInstructions();

  return (
    <>
      <div className="p-2 border-t border-primary-200">
        <div 
          className="flex items-center justify-between space-x-2 p-1.5 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
          onClick={handleInstallClick}
        >
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
              <Download className="w-4 h-4 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-900">Install App</p>
              <p className="text-xs text-primary-600">Quick access & offline mode</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDismiss();
            }}
            className="text-primary-400 hover:text-primary-600 transition-colors p-1"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed w-screen h-screen  bg-black bg-opacity-50 flex items-center justify-center z-[21] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{instructions.title}</h3>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              {instructions.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary-600">{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700 pt-0.5">{step}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallButton;