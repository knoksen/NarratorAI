/**
 * Batch Processing Manager
 * 
 * Manages batch processing of multiple PDF files with queue management,
 * progress tracking, and pause/resume/cancel functionality.
 */

const { EventEmitter } = require('events');
const path = require('path');
const fs = require('fs').promises;

class BatchProcessor extends EventEmitter {
  constructor() {
    super();
    
    this.queue = [];
    this.currentIndex = -1;
    this.isProcessing = false;
    this.isPaused = false;
    this.isCancelled = false;
    
    this.results = {
      total: 0,
      completed: 0,
      failed: 0,
      skipped: 0,
      items: []
    };
  }
  
  /**
   * Add files to the processing queue
   * @param {Array<string>} filePaths - Array of PDF file paths
   * @returns {Object} Queue status
   */
  addToQueue(filePaths) {
    if (!Array.isArray(filePaths)) {
      filePaths = [filePaths];
    }
    
    const newItems = filePaths.map((filePath, index) => ({
      id: `batch-${Date.now()}-${index}`,
      filePath,
      fileName: path.basename(filePath),
      status: 'pending', // pending, processing, completed, failed, skipped
      progress: 0,
      startTime: null,
      endTime: null,
      error: null,
      outputPath: null
    }));
    
    this.queue.push(...newItems);
    this.results.total = this.queue.length;
    
    this.emit('queue-updated', {
      queue: this.queue,
      total: this.queue.length
    });
    
    return {
      added: newItems.length,
      total: this.queue.length
    };
  }
  
  /**
   * Remove a file from the queue
   * @param {string} itemId - Item ID to remove
   * @returns {boolean} Success status
   */
  removeFromQueue(itemId) {
    const index = this.queue.findIndex(item => item.id === itemId);
    if (index === -1) return false;
    
    const item = this.queue[index];
    
    // Can only remove pending or failed items
    if (item.status === 'processing') {
      return false;
    }
    
    this.queue.splice(index, 1);
    this.results.total = this.queue.length;
    
    // Adjust current index if needed
    if (index <= this.currentIndex) {
      this.currentIndex--;
    }
    
    this.emit('queue-updated', {
      queue: this.queue,
      total: this.queue.length
    });
    
    return true;
  }
  
  /**
   * Clear the entire queue
   * @returns {boolean} Success status
   */
  clearQueue() {
    if (this.isProcessing && !this.isPaused) {
      return false; // Can't clear while actively processing
    }
    
    this.queue = [];
    this.currentIndex = -1;
    this.results = {
      total: 0,
      completed: 0,
      failed: 0,
      skipped: 0,
      items: []
    };
    
    this.emit('queue-updated', {
      queue: this.queue,
      total: 0
    });
    
    return true;
  }
  
  /**
   * Start processing the queue
   * @param {Function} processFunction - Function to process each file
   * @returns {Promise<Object>} Processing results
   */
  async start(processFunction) {
    if (this.isProcessing) {
      return { error: 'Already processing' };
    }
    
    if (this.queue.length === 0) {
      return { error: 'Queue is empty' };
    }
    
    this.isProcessing = true;
    this.isPaused = false;
    this.isCancelled = false;
    
    this.emit('batch-started', {
      total: this.queue.length
    });
    
    try {
      // Start from current index or beginning
      if (this.currentIndex < 0) {
        this.currentIndex = 0;
      }
      
      while (this.currentIndex < this.queue.length) {
        // Check for pause
        if (this.isPaused) {
          this.emit('batch-paused', {
            currentIndex: this.currentIndex,
            total: this.queue.length
          });
          break;
        }
        
        // Check for cancellation
        if (this.isCancelled) {
          // Mark remaining items as skipped
          for (let i = this.currentIndex; i < this.queue.length; i++) {
            if (this.queue[i].status === 'pending') {
              this.queue[i].status = 'skipped';
              this.results.skipped++;
            }
          }
          this.emit('batch-cancelled', this.results);
          break;
        }
        
        const item = this.queue[this.currentIndex];
        
        // Skip already processed items
        if (item.status === 'completed' || item.status === 'failed' || item.status === 'skipped') {
          this.currentIndex++;
          continue;
        }
        
        // Process current item
        await this.processItem(item, processFunction);
        
        this.currentIndex++;
      }
      
      // Check if we completed everything
      if (this.currentIndex >= this.queue.length && !this.isPaused) {
        this.isProcessing = false;
        this.emit('batch-completed', this.results);
      }
      
      return this.results;
      
    } catch (error) {
      this.isProcessing = false;
      this.emit('batch-error', { error: error.message });
      throw error;
    }
  }
  
  /**
   * Process a single item
   * @param {Object} item - Queue item to process
   * @param {Function} processFunction - Function to process the file
   * @returns {Promise<void>}
   */
  async processItem(item, processFunction) {
    item.status = 'processing';
    item.startTime = Date.now();
    item.progress = 0;
    
    this.emit('item-started', {
      item,
      index: this.currentIndex,
      total: this.queue.length
    });
    
    try {
      // Call the processing function with progress callback
      const result = await processFunction(item.filePath, (progress) => {
        item.progress = progress;
        this.emit('item-progress', {
          item,
          index: this.currentIndex,
          progress
        });
      });
      
      item.status = 'completed';
      item.progress = 100;
      item.endTime = Date.now();
      item.outputPath = result.outputPath;
      
      this.results.completed++;
      this.results.items.push({
        filePath: item.filePath,
        fileName: item.fileName,
        status: 'completed',
        outputPath: result.outputPath
      });
      
      this.emit('item-completed', {
        item,
        index: this.currentIndex,
        total: this.queue.length
      });
      
    } catch (error) {
      item.status = 'failed';
      item.endTime = Date.now();
      item.error = error.message;
      
      this.results.failed++;
      this.results.items.push({
        filePath: item.filePath,
        fileName: item.fileName,
        status: 'failed',
        error: error.message
      });
      
      this.emit('item-failed', {
        item,
        index: this.currentIndex,
        error: error.message
      });
    }
  }
  
  /**
   * Pause processing
   * @returns {boolean} Success status
   */
  pause() {
    if (!this.isProcessing || this.isPaused) {
      return false;
    }
    
    this.isPaused = true;
    return true;
  }
  
  /**
   * Resume processing
   * @param {Function} processFunction - Function to process each file
   * @returns {Promise<Object>} Processing results
   */
  async resume(processFunction) {
    if (!this.isPaused) {
      return { error: 'Not paused' };
    }
    
    this.isPaused = false;
    this.emit('batch-resumed', {
      currentIndex: this.currentIndex,
      total: this.queue.length
    });
    
    return await this.start(processFunction);
  }
  
  /**
   * Cancel processing
   * @returns {boolean} Success status
   */
  cancel() {
    if (!this.isProcessing) {
      return false;
    }
    
    this.isCancelled = true;
    this.isProcessing = false;
    this.isPaused = false;
    
    return true;
  }
  
  /**
   * Get current queue status
   * @returns {Object} Queue status
   */
  getStatus() {
    return {
      queue: this.queue,
      currentIndex: this.currentIndex,
      isProcessing: this.isProcessing,
      isPaused: this.isPaused,
      isCancelled: this.isCancelled,
      results: this.results
    };
  }
  
  /**
   * Get overall progress percentage
   * @returns {number} Progress (0-100)
   */
  getOverallProgress() {
    if (this.queue.length === 0) return 0;
    
    const completed = this.results.completed + this.results.failed + this.results.skipped;
    return Math.round((completed / this.queue.length) * 100);
  }
  
  /**
   * Reset the batch processor
   */
  reset() {
    this.queue = [];
    this.currentIndex = -1;
    this.isProcessing = false;
    this.isPaused = false;
    this.isCancelled = false;
    
    this.results = {
      total: 0,
      completed: 0,
      failed: 0,
      skipped: 0,
      items: []
    };
    
    this.emit('batch-reset');
  }
}

module.exports = BatchProcessor;
