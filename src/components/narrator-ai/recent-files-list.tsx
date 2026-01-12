'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, FileText, X, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RecentFilesListProps {
  onFileSelect?: (filePath: string) => void;
  className?: string;
}

export function RecentFilesList({ onFileSelect, className }: RecentFilesListProps) {
  const [recentFiles, setRecentFiles] = useState<string[]>([]);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if running in Electron
    if (typeof window !== 'undefined' && (window as any).electron) {
      setIsElectron(true);
      loadRecentFiles();
    }
  }, []);

  const loadRecentFiles = async () => {
    if (typeof window !== 'undefined' && (window as any).electron?.recentFiles) {
      const files = await (window as any).electron.recentFiles.get();
      setRecentFiles(files || []);
    }
  };

  const handleFileClick = (filePath: string) => {
    if (onFileSelect) {
      onFileSelect(filePath);
    }
  };

  const handleClearAll = async () => {
    if (typeof window !== 'undefined' && (window as any).electron?.recentFiles) {
      await (window as any).electron.recentFiles.clear();
      setRecentFiles([]);
    }
  };

  const getFileName = (filePath: string) => {
    const parts = filePath.split(/[\\/]/);
    return parts[parts.length - 1];
  };

  const getFileDirectory = (filePath: string) => {
    const parts = filePath.split(/[\\/]/);
    parts.pop(); // Remove filename
    return parts.join('/');
  };

  const formatRelativeTime = (index: number) => {
    if (index === 0) return 'Just now';
    if (index === 1) return 'Recently';
    return `${index + 1} files ago`;
  };

  if (!isElectron) {
    return null; // Only show in Electron
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <div>
              <CardTitle>Recent Files</CardTitle>
              <CardDescription>
                {recentFiles.length > 0 
                  ? `${recentFiles.length} recent ${recentFiles.length === 1 ? 'file' : 'files'}`
                  : 'No recent files'}
              </CardDescription>
            </div>
          </div>
          {recentFiles.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              title="Clear all recent files"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {recentFiles.length > 0 ? (
          <ScrollArea className="h-[300px] w-full pr-4">
            <div className="space-y-2">
              {recentFiles.map((file, index) => (
                <button
                  key={`${file}-${index}`}
                  onClick={() => handleFileClick(file)}
                  className="w-full text-left p-3 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium truncate">
                          {getFileName(file)}
                        </p>
                        {index < 9 && (
                          <Badge variant="outline" className="text-xs">
                            Ctrl+{index + 1}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {getFileDirectory(file)}
                      </p>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Most Recent
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm">No recent files</p>
            <p className="text-xs mt-1">Open a PDF file to see it here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
