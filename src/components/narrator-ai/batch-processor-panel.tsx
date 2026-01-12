'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Pause, 
  X, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Loader2
} from 'lucide-react';

interface QueueItem {
  id: string;
  filePath: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  progress: number;
  startTime: number | null;
  endTime: number | null;
  error: string | null;
  outputPath: string | null;
}

interface BatchStatus {
  queue: QueueItem[];
  currentIndex: number;
  isProcessing: boolean;
  isPaused: boolean;
  isCancelled: boolean;
  results: {
    total: number;
    completed: number;
    failed: number;
    skipped: number;
    items: Array<{
      filePath: string;
      fileName: string;
      status: string;
      error?: string;
      outputPath?: string;
    }>;
  };
}

interface BatchProcessorPanelProps {
  onProcessFile?: (filePath: string, progressCallback: (progress: number) => void) => Promise<{ success: boolean; outputPath?: string; error?: string }>;
}

export function BatchProcessorPanel({ onProcessFile }: BatchProcessorPanelProps) {
  const [batchStatus, setBatchStatus] = useState<BatchStatus | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if running in Electron
    if (typeof window !== 'undefined' && (window as any).electron) {
      setIsElectron(true);
      loadBatchStatus();
      setupEventListeners();
    }

    return () => {
      // Cleanup event listeners
      if (typeof window !== 'undefined' && (window as any).electron) {
        // Remove listeners if needed
      }
    };
  }, []);

  const loadBatchStatus = async () => {
    if (typeof window !== 'undefined' && (window as any).electron?.batch) {
      const status = await (window as any).electron.batch.getStatus();
      setBatchStatus(status);
      
      const progress = await (window as any).electron.batch.getProgress();
      setOverallProgress(progress);
    }
  };

  const setupEventListeners = () => {
    if (typeof window !== 'undefined' && (window as any).electron?.batch) {
      const electron = (window as any).electron;

      electron.batch.onQueueUpdated((data: any) => {
        loadBatchStatus();
      });

      electron.batch.onStarted((data: any) => {
        loadBatchStatus();
      });

      electron.batch.onPaused((data: any) => {
        loadBatchStatus();
      });

      electron.batch.onResumed((data: any) => {
        loadBatchStatus();
      });

      electron.batch.onCancelled((data: any) => {
        loadBatchStatus();
      });

      electron.batch.onCompleted((data: any) => {
        loadBatchStatus();
      });

      electron.batch.onItemStarted((data: any) => {
        loadBatchStatus();
      });

      electron.batch.onItemProgress((data: any) => {
        loadBatchStatus();
        setOverallProgress(Math.round((data.index / batchStatus!.queue.length) * 100));
      });

      electron.batch.onItemCompleted((data: any) => {
        loadBatchStatus();
      });

      electron.batch.onItemFailed((data: any) => {
        loadBatchStatus();
      });

      // Handle file processing requests from main process
      electron.batch.onProcessFile(async (data: { filePath: string }) => {
        if (onProcessFile) {
          try {
            const result = await onProcessFile(data.filePath, (progress) => {
              // Progress callback
            });
            electron.batch.sendProcessResult(result);
          } catch (error: any) {
            electron.batch.sendProcessResult({
              success: false,
              error: error.message
            });
          }
        } else {
          electron.batch.sendProcessResult({
            success: false,
            error: 'No processing function provided'
          });
        }
      });
    }
  };

  const handleAddFiles = async () => {
    if (typeof window !== 'undefined' && (window as any).electron?.dialog) {
      const result = await (window as any).electron.dialog.openFile();
      if (result && !result.canceled && result.filePaths?.length > 0) {
        await (window as any).electron.batch.addFiles(result.filePaths);
      }
    }
  };

  const handleRemoveFile = async (itemId: string) => {
    if (typeof window !== 'undefined' && (window as any).electron?.batch) {
      await (window as any).electron.batch.removeFile(itemId);
    }
  };

  const handleClearQueue = async () => {
    if (typeof window !== 'undefined' && (window as any).electron?.batch) {
      await (window as any).electron.batch.clear();
    }
  };

  const handleStart = async () => {
    if (typeof window !== 'undefined' && (window as any).electron?.batch) {
      await (window as any).electron.batch.start();
    }
  };

  const handlePause = async () => {
    if (typeof window !== 'undefined' && (window as any).electron?.batch) {
      await (window as any).electron.batch.pause();
    }
  };

  const handleResume = async () => {
    if (typeof window !== 'undefined' && (window as any).electron?.batch) {
      await (window as any).electron.batch.resume();
    }
  };

  const handleCancel = async () => {
    if (typeof window !== 'undefined' && (window as any).electron?.batch) {
      await (window as any).electron.batch.cancel();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'skipped':
        return <Clock className="h-4 w-4 text-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      processing: 'default',
      completed: 'secondary',
      failed: 'destructive',
      skipped: 'outline'
    };
    return variants[status] || 'outline';
  };

  if (!isElectron) {
    return null; // Only show in Electron
  }

  if (!batchStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Batch Processing</CardTitle>
          <CardDescription>Loading batch processor...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const hasQueue = batchStatus.queue.length > 0;
  const canStart = hasQueue && !batchStatus.isProcessing && !batchStatus.isPaused;
  const canPause = batchStatus.isProcessing && !batchStatus.isPaused;
  const canResume = batchStatus.isPaused;
  const canCancel = batchStatus.isProcessing || batchStatus.isPaused;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Batch Processing</CardTitle>
            <CardDescription>
              Process multiple PDF files in queue
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddFiles}
              disabled={batchStatus.isProcessing}
            >
              <FileText className="mr-2 h-4 w-4" />
              Add Files
            </Button>
            {hasQueue && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearQueue}
                disabled={batchStatus.isProcessing}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Progress */}
        {hasQueue && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-medium">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {batchStatus.results.completed} completed, {batchStatus.results.failed} failed
              </span>
              <span>{batchStatus.queue.length} total</span>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-2">
          {canStart && (
            <Button onClick={handleStart} className="flex-1">
              <Play className="mr-2 h-4 w-4" />
              Start Processing
            </Button>
          )}
          {canPause && (
            <Button onClick={handlePause} variant="outline" className="flex-1">
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          )}
          {canResume && (
            <Button onClick={handleResume} className="flex-1">
              <Play className="mr-2 h-4 w-4" />
              Resume
            </Button>
          )}
          {canCancel && (
            <Button onClick={handleCancel} variant="destructive">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>

        {/* Queue List */}
        {hasQueue && (
          <ScrollArea className="h-[400px] w-full rounded-md border">
            <div className="p-4 space-y-2">
              {batchStatus.queue.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getStatusIcon(item.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.fileName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getStatusBadge(item.status)} className="text-xs">
                          {item.status}
                        </Badge>
                        {item.status === 'processing' && (
                          <span className="text-xs text-muted-foreground">
                            {item.progress}%
                          </span>
                        )}
                      </div>
                      {item.status === 'processing' && (
                        <Progress value={item.progress} className="h-1 mt-2" />
                      )}
                      {item.error && (
                        <p className="text-xs text-red-500 mt-1 truncate">{item.error}</p>
                      )}
                    </div>
                  </div>
                  {(item.status === 'pending' || item.status === 'failed') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(item.id)}
                      disabled={batchStatus.isProcessing}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Empty State */}
        {!hasQueue && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm">No files in queue</p>
            <p className="text-xs mt-1">Click "Add Files" to start batch processing</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
