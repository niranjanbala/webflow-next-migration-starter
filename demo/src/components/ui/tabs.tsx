'use client';

import { ReactNode, useState, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

interface TabsProps {
  children: ReactNode;
  defaultValue: string;
  className?: string;
  onValueChange?: (value: string) => void;
}

export default function Tabs({ 
  children, 
  defaultValue, 
  className = '',
  onValueChange 
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onValueChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// Tab List component
export function TabsList({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex border-b border-gray-200', className)}>
      {children}
    </div>
  );
}

// Tab Trigger component
export function TabsTrigger({ 
  children, 
  value, 
  disabled = false,
  className = '' 
}: { 
  children: ReactNode; 
  value: string;
  disabled?: boolean;
  className?: string;
}) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={cn(
        'px-4 py-2 text-sm font-medium transition-colors border-b-2 border-transparent',
        'hover:text-gray-700 hover:border-gray-300',
        'focus:outline-none focus:text-gray-700 focus:border-gray-300',
        isActive && 'text-black border-black',
        disabled && 'opacity-50 cursor-not-allowed hover:text-gray-500 hover:border-transparent',
        className
      )}
    >
      {children}
    </button>
  );
}

// Tab Content component
export function TabsContent({ 
  children, 
  value, 
  className = '' 
}: { 
  children: ReactNode; 
  value: string;
  className?: string;
}) {
  const { activeTab } = useTabsContext();
  
  if (activeTab !== value) {
    return null;
  }

  return (
    <div className={cn('mt-4', className)}>
      {children}
    </div>
  );
}

// Vertical Tabs variant
export function VerticalTabs({ 
  children, 
  defaultValue, 
  className = '',
  onValueChange 
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onValueChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={cn('flex', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function VerticalTabsList({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col border-r border-gray-200 min-w-48', className)}>
      {children}
    </div>
  );
}

export function VerticalTabsTrigger({ 
  children, 
  value, 
  disabled = false,
  className = '' 
}: { 
  children: ReactNode; 
  value: string;
  disabled?: boolean;
  className?: string;
}) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={cn(
        'px-4 py-3 text-left text-sm font-medium transition-colors border-r-2 border-transparent',
        'hover:bg-gray-50 hover:border-gray-300',
        'focus:outline-none focus:bg-gray-50 focus:border-gray-300',
        isActive && 'bg-gray-50 border-black text-black',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent hover:border-transparent',
        className
      )}
    >
      {children}
    </button>
  );
}

export function VerticalTabsContent({ 
  children, 
  value, 
  className = '' 
}: { 
  children: ReactNode; 
  value: string;
  className?: string;
}) {
  const { activeTab } = useTabsContext();
  
  if (activeTab !== value) {
    return null;
  }

  return (
    <div className={cn('flex-1 p-6', className)}>
      {children}
    </div>
  );
}