'use client';

import { useEffect, useState } from 'react';

interface ToastOptions {
  silent?: boolean;
  urgency?: 'low' | 'normal' | 'critical';
  timeoutType?: 'default' | 'never';
  actions?: Array<{ text: string; type: 'button' }>;
  closeButtonText?: string;
  icon?: string;
  onClick?: () => void;
  onClose?: () => void;
  onAction?: (index: number) => void;
}

interface UseToastReturn {
  show: (options: ToastOptions & { title: string; body: string; type?: string }) => Promise<void>;
  success: (title: string, body: string, options?: ToastOptions) => Promise<void>;
  error: (title: string, body: string, options?: ToastOptions) => Promise<void>;
  warning: (title: string, body: string, options?: ToastOptions) => Promise<void>;
  info: (title: string, body: string, options?: ToastOptions) => Promise<void>;
  closeAll: () => Promise<void>;
  isSupported: boolean;
  isElectron: boolean;
}

/**
 * Hook for showing desktop toast notifications in Electron
 */
export function useToast(): UseToastReturn {
  const [isElectron, setIsElectron] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).electron?.toast) {
      setIsElectron(true);
      
      // Check if notifications are supported
      (window as any).electron.toast.isSupported().then((supported: boolean) => {
        setIsSupported(supported);
      });
    }
  }, []);

  const show = async (options: ToastOptions & { title: string; body: string; type?: string }) => {
    if (!isElectron || !isSupported) {
      console.warn('Toast notifications not available');
      return;
    }

    try {
      await (window as any).electron.toast.show(options);
    } catch (error) {
      console.error('Failed to show toast:', error);
    }
  };

  const success = async (title: string, body: string, options?: ToastOptions) => {
    if (!isElectron || !isSupported) return;
    
    try {
      await (window as any).electron.toast.success(title, body, options);
    } catch (error) {
      console.error('Failed to show success toast:', error);
    }
  };

  const error = async (title: string, body: string, options?: ToastOptions) => {
    if (!isElectron || !isSupported) return;
    
    try {
      await (window as any).electron.toast.error(title, body, options);
    } catch (error) {
      console.error('Failed to show error toast:', error);
    }
  };

  const warning = async (title: string, body: string, options?: ToastOptions) => {
    if (!isElectron || !isSupported) return;
    
    try {
      await (window as any).electron.toast.warning(title, body, options);
    } catch (error) {
      console.error('Failed to show warning toast:', error);
    }
  };

  const info = async (title: string, body: string, options?: ToastOptions) => {
    if (!isElectron || !isSupported) return;
    
    try {
      await (window as any).electron.toast.info(title, body, options);
    } catch (error) {
      console.error('Failed to show info toast:', error);
    }
  };

  const closeAll = async () => {
    if (!isElectron || !isSupported) return;
    
    try {
      await (window as any).electron.toast.closeAll();
    } catch (error) {
      console.error('Failed to close toasts:', error);
    }
  };

  return {
    show,
    success,
    error,
    warning,
    info,
    closeAll,
    isSupported,
    isElectron
  };
}
