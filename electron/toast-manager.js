/**
 * Toast Notification Manager
 * 
 * Manages desktop notifications and toast messages with different types
 * (success, error, warning, info) and customizable duration.
 */

const { Notification } = require('electron');
const path = require('path');

class ToastManager {
  constructor() {
    this.notifications = [];
    this.queue = [];
    this.isProcessing = false;
  }
  
  /**
   * Check if notifications are supported
   * @returns {boolean}
   */
  isSupported() {
    return Notification.isSupported();
  }
  
  /**
   * Show a success notification
   * @param {string} title - Notification title
   * @param {string} body - Notification body text
   * @param {Object} options - Additional options
   */
  success(title, body, options = {}) {
    return this.show({
      title,
      body,
      type: 'success',
      ...options
    });
  }
  
  /**
   * Show an error notification
   * @param {string} title - Notification title
   * @param {string} body - Notification body text
   * @param {Object} options - Additional options
   */
  error(title, body, options = {}) {
    return this.show({
      title,
      body,
      type: 'error',
      ...options
    });
  }
  
  /**
   * Show a warning notification
   * @param {string} title - Notification title
   * @param {string} body - Notification body text
   * @param {Object} options - Additional options
   */
  warning(title, body, options = {}) {
    return this.show({
      title,
      body,
      type: 'warning',
      ...options
    });
  }
  
  /**
   * Show an info notification
   * @param {string} title - Notification title
   * @param {string} body - Notification body text
   * @param {Object} options - Additional options
   */
  info(title, body, options = {}) {
    return this.show({
      title,
      body,
      type: 'info',
      ...options
    });
  }
  
  /**
   * Show a notification
   * @param {Object} options - Notification options
   * @returns {Notification|null}
   */
  show(options) {
    if (!this.isSupported()) {
      console.warn('Notifications are not supported on this system');
      return null;
    }
    
    const {
      title,
      body,
      type = 'info',
      silent = false,
      urgency = 'normal', // low, normal, critical
      timeoutType = 'default', // default, never
      actions = [],
      closeButtonText,
      icon
    } = options;
    
    // Create notification
    const notification = new Notification({
      title: title || 'NarratorAI',
      body: body || '',
      silent,
      urgency,
      timeoutType,
      actions,
      closeButtonText,
      icon: icon || this.getIconForType(type)
    });
    
    // Store notification reference
    this.notifications.push({
      notification,
      type,
      timestamp: Date.now()
    });
    
    // Set up event handlers
    notification.on('click', () => {
      if (options.onClick) {
        options.onClick();
      }
    });
    
    notification.on('close', () => {
      this.removeNotification(notification);
      if (options.onClose) {
        options.onClose();
      }
    });
    
    notification.on('action', (event, index) => {
      if (options.onAction) {
        options.onAction(index);
      }
    });
    
    // Show the notification
    notification.show();
    
    return notification;
  }
  
  /**
   * Get icon for notification type
   * @param {string} type - Notification type
   * @returns {string|undefined}
   */
  getIconForType(type) {
    // Could return different icons for different types
    // For now, use the app icon for all
    return undefined;
  }
  
  /**
   * Remove a notification from tracking
   * @param {Notification} notification - Notification to remove
   */
  removeNotification(notification) {
    this.notifications = this.notifications.filter(
      item => item.notification !== notification
    );
  }
  
  /**
   * Close all active notifications
   */
  closeAll() {
    this.notifications.forEach(item => {
      try {
        item.notification.close();
      } catch (error) {
        // Ignore errors when closing
      }
    });
    this.notifications = [];
  }
  
  /**
   * Get count of active notifications
   * @returns {number}
   */
  getActiveCount() {
    return this.notifications.length;
  }
  
  /**
   * Show a notification about file processing
   * @param {string} fileName - Name of the file
   * @param {string} status - Status (started, completed, failed)
   */
  fileProcessing(fileName, status) {
    switch (status) {
      case 'started':
        return this.info(
          'Processing Started',
          `Converting "${fileName}" to audio...`
        );
      case 'completed':
        return this.success(
          'Processing Complete',
          `"${fileName}" has been converted to audio successfully`
        );
      case 'failed':
        return this.error(
          'Processing Failed',
          `Failed to convert "${fileName}" to audio`
        );
      default:
        return null;
    }
  }
  
  /**
   * Show a notification about batch processing
   * @param {Object} results - Batch processing results
   */
  batchComplete(results) {
    const { total, completed, failed } = results;
    
    if (failed === 0) {
      return this.success(
        'Batch Processing Complete',
        `Successfully processed ${completed} of ${total} files`
      );
    } else if (completed === 0) {
      return this.error(
        'Batch Processing Failed',
        `Failed to process all ${total} files`
      );
    } else {
      return this.warning(
        'Batch Processing Complete',
        `Processed ${completed} files, ${failed} failed`
      );
    }
  }
  
  /**
   * Show update notification
   * @param {string} version - New version available
   */
  updateAvailable(version) {
    return this.info(
      'Update Available',
      `NarratorAI ${version} is available. Click to download.`,
      {
        actions: [
          { text: 'Download', type: 'button' }
        ]
      }
    );
  }
  
  /**
   * Show update downloaded notification
   */
  updateDownloaded() {
    return this.success(
      'Update Downloaded',
      'Restart the app to install the update',
      {
        actions: [
          { text: 'Restart Now', type: 'button' }
        ]
      }
    );
  }
}

module.exports = new ToastManager();
