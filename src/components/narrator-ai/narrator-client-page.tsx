
'use client';

import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { AudioPlayer } from '@/components/narrator-ai/audio-player';
import { handleEnhanceContent, handleGenerateAudio, handlePdfToMarkdown } from '@/app/actions';
import { UploadCloud, FileText, Loader2, Sparkles, Download, ArrowLeft, RefreshCw } from 'lucide-react';

type Step = 'UPLOAD' | 'EDIT' | 'PLAY';

export function NarratorClientPage() {
    const [step, setStep] = useState<Step>('UPLOAD');
    const [file, setFile] = useState<File | null>(null);
    const [markdown, setMarkdown] = useState<string>('');
    const [audioUrl, setAudioUrl] = useState<string>('');
    const [loadingState, setLoadingState] = useState<'idle' | 'converting' | 'enhancing' | 'generating'>('idle');
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        // Move focus to the step heading when step changes for better accessibility
        headingRef.current?.focus();
    }, [step]);

    // Restore previous session (markdown + audio) on mount
    useEffect(() => {
        try {
            const savedMarkdown = window.localStorage.getItem('narratorai_markdown') || '';
            const savedAudio = window.localStorage.getItem('narratorai_audio') || '';
            if (savedMarkdown) setMarkdown(savedMarkdown);
            if (savedAudio) setAudioUrl(savedAudio);
            if (savedAudio) setStep('PLAY');
            else if (savedMarkdown) setStep('EDIT');
        } catch { }
    }, []);
    useEffect(() => {
        try { window.localStorage.setItem('narratorai_markdown', markdown || ''); } catch { }
    }, [markdown]);
    useEffect(() => {
        try { window.localStorage.setItem('narratorai_audio', audioUrl || ''); } catch { }
    }, [audioUrl]);

    const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB

    const acceptFile = (selectedFile: File) => {
        if (selectedFile.type !== 'application/pdf') {
            toast({
                title: 'Invalid File Type',
                description: 'Please upload a PDF file.',
                variant: 'destructive',
            });
            return;
        }
        if (selectedFile.size > MAX_FILE_BYTES) {
            toast({
                title: 'File Too Large',
                description: 'Please upload a PDF up to 10MB.',
                variant: 'destructive',
            });
            return;
        }
        setFile(selectedFile);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            acceptFile(selectedFile);
        } else {
            setFile(null);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const selectedFile = e.dataTransfer.files?.[0];
        if (selectedFile) acceptFile(selectedFile);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleConvertToMarkdown = async () => {
        if (!file) return;
        setLoadingState('converting');
        setStatusMessage('Converting PDF to Markdown…');
        const result = await handlePdfToMarkdown(file);
        if (result.success && result.data) {
            setMarkdown(result.data);
            setStep('EDIT');
        } else {
            toast({
                title: 'Conversion Failed',
                description: result.error,
                variant: 'destructive',
            });
        }
        setLoadingState('idle');
        setStatusMessage('');
    };

    const handleEnhance = async () => {
        if (!markdown) return;
        setLoadingState('enhancing');
        setStatusMessage('Enhancing content with AI…');
        const result = await handleEnhanceContent(markdown);
        if (result.success && result.data) {
            setMarkdown(result.data);
            toast({
                title: 'Content Enhanced',
                description: 'Your narrative has been enriched by AI.',
            });
        } else {
            toast({
                title: 'Enhancement Failed',
                description: result.error,
                variant: 'destructive',
            });
        }
        setLoadingState('idle');
        setStatusMessage('');
    };

    const handleGenerate = async () => {
        if (!markdown) return;
        setLoadingState('generating');
        setStatusMessage('Generating audio…');
        const result = await handleGenerateAudio(markdown);
        if (result.success && result.data) {
            setAudioUrl(result.data);
            setStep('PLAY');
        } else {
            toast({
                title: 'Audio Generation Failed',
                description: result.error,
                variant: 'destructive',
            });
        }
        setLoadingState('idle');
        setStatusMessage('');
    };

    const handleReset = () => {
        setStep('UPLOAD');
        setFile(null);
        setMarkdown('');
        setAudioUrl('');
        setLoadingState('idle');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const renderUploadStep = () => (
        <CardContent className="flex flex-col items-center justify-center p-6 sm:p-10 space-y-6">
            <div
                className={
                    `w-full border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ` +
                    (isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-secondary')
                }
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                    if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                aria-describedby="upload-help"
            >
                <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" aria-hidden="true" />
                <p className="text-lg font-semibold text-foreground">Click or drag & drop to upload</p>
                <p id="upload-help" className="text-sm text-muted-foreground">PDF file up to 10MB</p>
                <Input ref={fileInputRef} id="pdf-upload" type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} aria-label="Upload PDF" />
            </div>
            <div className="text-xs text-muted-foreground">
                Or try a <a href="/samples/sample.pdf" className="underline" download>sample PDF</a> to drag here.
            </div>
            {file && (
                <div className="w-full flex items-center justify-between gap-3 p-3 bg-secondary rounded-md text-sm text-secondary-foreground font-medium">
                    <div className="flex items-center min-w-0">
                        <FileText className="w-5 h-5 mr-3 text-primary shrink-0" aria-hidden="true" />
                        <span className="truncate" title={file.name}>{file.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} aria-label="Change file">Change</Button>
                </div>
            )}
        </CardContent>
    );

    const renderEditStep = () => (
        <CardContent className="p-6 space-y-2">
            <Textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Your markdown content will appear here..."
                rows={15}
                className="text-base leading-relaxed"
                aria-label="Markdown content"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{markdown ? markdown.trim().split(/\s+/).length : 0} words</span>
                <span>
                    ~{Math.ceil(((markdown ? markdown.length : 0) / 5) / 150)} min narration
                </span>
            </div>
        </CardContent>
    );

    const renderPlayStep = () => (
        <CardContent className="p-6 space-y-6">
            <AudioPlayer src={audioUrl} />
            <div className="max-h-60 overflow-y-auto p-4 bg-secondary rounded-md">
                <p className="text-secondary-foreground whitespace-pre-wrap font-mono text-sm" aria-label="Generated markdown text">{markdown}</p>
            </div>
        </CardContent>
    );

    const renderFooter = () => {
        switch (step) {
            case 'UPLOAD':
                return (
                    <Button onClick={handleConvertToMarkdown} disabled={!file || loadingState === 'converting'} className="w-full sm:w-auto text-base py-6 px-8" aria-busy={loadingState === 'converting'} aria-live="polite">
                        {loadingState === 'converting' ? <><Loader2 className="animate-spin" aria-hidden="true" /><span className="sr-only">Converting…</span></> : 'Convert to Markdown'}
                    </Button>
                );
            case 'EDIT':
                return (
                    <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
                        <Button variant="outline" onClick={() => { setStep('UPLOAD'); setFile(null); }}>
                            <ArrowLeft className="mr-2" /> Back
                        </Button>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button variant="outline" onClick={() => { if (markdown) navigator.clipboard.writeText(markdown).then(() => toast({ title: 'Copied', description: 'Markdown copied to clipboard.' })); }} disabled={!markdown.trim()}>
                                Copy Markdown
                            </Button>
                            <Button variant="secondary" onClick={handleEnhance} disabled={loadingState === 'enhancing' || loadingState === 'generating'} aria-busy={loadingState === 'enhancing'}>
                                {loadingState === 'enhancing' ? <><Loader2 className="animate-spin" aria-hidden="true" /><span className="sr-only">Enhancing…</span></> : <><Sparkles className="mr-2" aria-hidden="true" /> Enhance with AI</>}
                            </Button>
                            <Button onClick={handleGenerate} disabled={loadingState === 'generating' || loadingState === 'enhancing' || !markdown.trim()} aria-busy={loadingState === 'generating'}>
                                {loadingState === 'generating' ? <><Loader2 className="animate-spin" aria-hidden="true" /><span className="sr-only">Generating…</span></> : 'Generate Audio'}
                            </Button>
                        </div>
                    </div>
                );
            case 'PLAY':
                return (
                    <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
                        <Button variant="outline" onClick={handleReset}>
                            <RefreshCw className="mr-2" /> Start Over
                        </Button>
                        <Button asChild>
                            <a href={audioUrl} download="narratorai_audio.wav">
                                <Download className="mr-2" /> Download Audio
                            </a>
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Card className="relative w-full max-w-3xl mt-8 shadow-2xl shadow-primary/10" aria-busy={loadingState !== 'idle'}>
            <CardHeader>
                <div className="flex items-center gap-3 mb-2" aria-hidden="true">
                    {["Upload", "Edit", "Play"].map((label, idx) => {
                        const activeIdx = step === 'UPLOAD' ? 0 : step === 'EDIT' ? 1 : 2;
                        const isActive = idx === activeIdx;
                        const isCompleted = idx < activeIdx;
                        return (
                            <div key={label} className="flex items-center gap-2">
                                <div className={`size-3 rounded-full ${isActive ? 'bg-primary' : isCompleted ? 'bg-primary/50' : 'bg-border'}`} />
                                <span className={`text-xs ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
                                {idx < 2 && <div className="w-6 h-px bg-border" />}
                            </div>
                        );
                    })}
                </div>
                <CardTitle className="text-2xl outline-none" tabIndex={-1} ref={headingRef}>
                    {step === 'UPLOAD' && 'Step 1: Upload PDF'}
                    {step === 'EDIT' && 'Step 2: Edit & Enhance'}
                    {step === 'PLAY' && 'Step 3: Your Audio is Ready!'}
                </CardTitle>
                <CardDescription>
                    {step === 'UPLOAD' && 'Start by uploading your document.'}
                    {step === 'EDIT' && 'Review the extracted text and use AI to enrich the narrative.'}
                    {step === 'PLAY' && 'Listen to, and download your generated audio.'}
                </CardDescription>
                <div aria-live="polite" className="sr-only">{statusMessage}</div>
            </CardHeader>
            {step === 'UPLOAD' && renderUploadStep()}
            {step === 'EDIT' && renderEditStep()}
            {step === 'PLAY' && renderPlayStep()}
            <CardFooter className="bg-muted/50 py-4 px-6">
                {renderFooter()}
            </CardFooter>
            {loadingState !== 'idle' && (
                <div className="pointer-events-none absolute inset-0 rounded-lg bg-background/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{statusMessage || 'Processing…'}</span>
                    </div>
                </div>
            )}
        </Card>
    );
}
