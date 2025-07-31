'use client';

import { useState } from 'react';
import { useAccessibility } from './accessibility-provider';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '@/components/ui';
import { cn } from '@/lib/utils';

interface AccessibilitySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessibilitySettings({ isOpen, onClose }: AccessibilitySettingsProps) {
  const { 
    config, 
    updateConfig, 
    fontSize, 
    setFontSize, 
    isReducedMotion, 
    isHighContrast,
    announceSuccess
  } = useAccessibility();

  const [localConfig, setLocalConfig] = useState(config);

  const handleSave = () => {
    updateConfig(localConfig);
    announceSuccess('Accessibility settings saved');
    onClose();
  };

  const handleReset = () => {
    setLocalConfig({
      announcePageChanges: true,
      skipLinksEnabled: true,
      focusManagement: true,
      keyboardNavigation: true,
      screenReaderSupport: true
    });
    setFontSize('normal');
    announceSuccess('Accessibility settings reset to defaults');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader onClose={onClose}>
        <ModalTitle>Accessibility Settings</ModalTitle>
      </ModalHeader>
      
      <ModalContent>
        <div className="space-y-6">
          {/* Font Size Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Text Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Choose a comfortable text size for reading.
                </p>
                <div className="flex space-x-4">
                  {(['normal', 'large', 'larger'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={cn(
                        'px-4 py-2 border rounded-lg transition-colors',
                        fontSize === size
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      )}
                      aria-pressed={fontSize === size}
                    >
                      {size === 'normal' && 'Normal (16px)'}
                      {size === 'large' && 'Large (18px)'}
                      {size === 'larger' && 'Larger (20px)'}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Motion Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Motion & Animation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Reduced Motion</p>
                    <p className="text-sm text-gray-600">
                      {isReducedMotion 
                        ? 'Your system preference is set to reduce motion'
                        : 'Your system preference allows motion'
                      }
                    </p>
                  </div>
                  <div className={cn(
                    'px-3 py-1 rounded-full text-sm',
                    isReducedMotion 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  )}>
                    {isReducedMotion ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contrast Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Display Contrast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">High Contrast</p>
                    <p className="text-sm text-gray-600">
                      {isHighContrast 
                        ? 'Your system preference is set to high contrast'
                        : 'Your system preference uses normal contrast'
                      }
                    </p>
                  </div>
                  <div className={cn(
                    'px-3 py-1 rounded-full text-sm',
                    isHighContrast 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  )}>
                    {isHighContrast ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Screen Reader Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Screen Reader Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localConfig.announcePageChanges}
                    onChange={(e) => setLocalConfig(prev => ({
                      ...prev,
                      announcePageChanges: e.target.checked
                    }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium">Announce Page Changes</p>
                    <p className="text-sm text-gray-600">
                      Announce when navigating to a new page
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localConfig.screenReaderSupport}
                    onChange={(e) => setLocalConfig(prev => ({
                      ...prev,
                      screenReaderSupport: e.target.checked
                    }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium">Screen Reader Support</p>
                    <p className="text-sm text-gray-600">
                      Enable enhanced screen reader compatibility
                    </p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localConfig.skipLinksEnabled}
                    onChange={(e) => setLocalConfig(prev => ({
                      ...prev,
                      skipLinksEnabled: e.target.checked
                    }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium">Skip Links</p>
                    <p className="text-sm text-gray-600">
                      Show skip navigation links when using keyboard
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localConfig.keyboardNavigation}
                    onChange={(e) => setLocalConfig(prev => ({
                      ...prev,
                      keyboardNavigation: e.target.checked
                    }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium">Enhanced Keyboard Navigation</p>
                    <p className="text-sm text-gray-600">
                      Enable advanced keyboard navigation features
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localConfig.focusManagement}
                    onChange={(e) => setLocalConfig(prev => ({
                      ...prev,
                      focusManagement: e.target.checked
                    }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium">Focus Management</p>
                    <p className="text-sm text-gray-600">
                      Automatically manage focus for better navigation
                    </p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </ModalContent>
      
      <ModalFooter>
        <Button variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Settings
        </Button>
      </ModalFooter>
    </Modal>
  );
}

// Accessibility settings trigger button
export function AccessibilitySettingsTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        aria-label="Open accessibility settings"
        className="fixed bottom-4 right-4 z-40 shadow-lg"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" 
          />
        </svg>
        Accessibility
      </Button>
      
      <AccessibilitySettings 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}