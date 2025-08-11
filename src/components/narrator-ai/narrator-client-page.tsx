'use client';

import { useState, useRef, type ChangeEvent } from 'react';
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
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            setFile(null);
            if (selectedFile) {
                toast({
                    title: 'Invalid File Type',
                    description: 'Please upload a PDF file.',
                    variant: 'destructive',
                });
            }
        }
    };

    const handleConvertToMarkdown = async () => {
        if (!file) return;
        setLoadingState('converting');
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
    };
    
    const handleEnhance = async () => {
        if (!markdown) return;
        setLoadingState('enhancing');
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
    };

    const handleGenerate = async () => {
        if (!markdown) return;
        setLoadingState('generating');
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
                className="w-full border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-secondary transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
            >
                <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold text-foreground">Click or drag & drop to upload</p>
                <p className="text-sm text-muted-foreground">PDF file up to 10MB</p>
                <Input ref={fileInputRef} id="pdf-upload" type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
            </div>
            {file && (
                <div className="w-full flex items-center justify-center p-3 bg-secondary rounded-md text-sm text-secondary-foreground font-medium">
                    <FileText className="w-5 h-5 mr-3 text-primary shrink-0" />
                    <span className="truncate">{file.name}</span>
                </div>
            )}
        </CardContent>
    );

    const renderEditStep = () => (
        <CardContent className="p-6">
            <Textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Your markdown content will appear here..."
                rows={15}
                className="text-base leading-relaxed"
            />
        </CardContent>
    );

    const renderPlayStep = () => (
        <CardContent className="p-6 space-y-6">
            <AudioPlayer src={audioUrl} />
            <div className="max-h-60 overflow-y-auto p-4 bg-secondary rounded-md">
                <p className="text-secondary-foreground whitespace-pre-wrap font-mono text-sm">{markdown}</p>
            </div>
        </CardContent>
    );

    const renderFooter = () => {
        switch (step) {
            case 'UPLOAD':
                return (
                    <Button onClick={handleConvertToMarkdown} disabled={!file || loadingState === 'converting'} className="w-full sm:w-auto text-base py-6 px-8">
                        {loadingState === 'converting' ? <Loader2 className="animate-spin" /> : 'Convert to Markdown'}
                    </Button>
                );
            case 'EDIT':
                return (
                    <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
                        <Button variant="outline" onClick={() => { setStep('UPLOAD'); setFile(null); }}>
                            <ArrowLeft className="mr-2" /> Back
                        </Button>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button variant="secondary" onClick={handleEnhance} disabled={loadingState === 'enhancing' || loadingState === 'generating'}>
                                {loadingState === 'enhancing' ? <Loader2 className="animate-spin" /> : <><Sparkles className="mr-2" /> Enhance with AI</>}
                            </Button>
                            <Button onClick={handleGenerate} disabled={loadingState === 'generating' || loadingState === 'enhancing' || !markdown.trim()}>
                                {loadingState === 'generating' ? <Loader2 className="animate-spin" /> : 'Generate Audio'}
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
        <Card className="w-full max-w-3xl mt-8 shadow-2xl shadow-primary/10">
            <CardHeader>
                <CardTitle className="text-2xl">
                    {step === 'UPLOAD' && 'Step 1: Upload PDF'}
                    {step === 'EDIT' && 'Step 2: Edit & Enhance'}
                    {step === 'PLAY' && 'Step 3: Your Audio is Ready!'}
                </CardTitle>
                <CardDescription>
                    {step === 'UPLOAD' && 'Start by uploading your document.'}
                    {step === 'EDIT' && 'Review the extracted text and use AI to enrich the narrative.'}
                    {step === 'PLAY' && 'Listen to, and download your generated audio.'}
                </CardDescription>
            </CardHeader>
            {step === 'UPLOAD' && renderUploadStep()}
            {step === 'EDIT' && renderEditStep()}
            {step === 'PLAY' && renderPlayStep()}
            <CardFooter className="bg-muted/50 py-4 px-6">
                {renderFooter()}
            </CardFooter>
        </Card>
    );
}
