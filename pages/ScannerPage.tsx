import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
    Upload, Camera, Loader2, Scan as ScanIcon, AlertTriangle, Shield, CheckCircle, RotateCcw, 
    ExternalLink, FileText, Search, Cpu, Grid, Mountain, Smile, Sunrise, Info, Mic, Film, 
    Clapperboard, Layers, Image as ImageIcon, Video as VideoIcon
} from 'lucide-react';
import { analyzeImage, analyzeVideo } from '../services/geminiService';
import { fileToBase64 } from '../utils/helpers';
import type { ScanResult, DetailedFinding } from '../types';

const categoryIcons: Record<DetailedFinding['category'], React.ElementType> = {
    "Anatomy & Proportions": Smile,
    "Lighting & Shadows": Sunrise,
    "Background & Environment": Mountain,
    "Texture & Detail": Grid,
    "AI Artifacts": Cpu,
    "Facial & Speech Analysis": Mic,
    "Scene & Object Consistency": Film,
    "Audio-Visual Sync": Clapperboard,
    "Compression & Artifacts": Layers,
    "Other": Info,
};

const severityColors: Record<DetailedFinding['severity'], string> = {
    "Low": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
    "Medium": "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200",
    "High": "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
};


// Child Components defined outside to prevent re-renders
const FileUploadZone = ({ 
    onFileSelect, 
    selectedFile,
    accept,
    promptText,
    subPromptText,
}: { 
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
    accept: string;
    promptText: string;
    subPromptText: string;
}) => {
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFileSelect(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) onFileSelect(file);
    };

    if (selectedFile) {
        return (
             <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <p className="font-medium text-slate-800 dark:text-slate-200">{selectedFile.name}</p>
                <Button variant="link" size="sm" onClick={() => onFileSelect(null)}>Clear</Button>
            </div>
        );
    }

    return (
        <div 
            className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-12 text-center hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            <input type="file" accept={accept} onChange={handleFileInput} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <Upload className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
            <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-200">{promptText}</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subPromptText}</p>
        </div>
    );
}

const ResultTabButton = ({ isActive, children, ...props }: { isActive: boolean, children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            {...props}
            className={`flex items-center gap-2 px-4 py-3 -mb-px text-sm font-semibold border-b-2 transition-colors duration-200 focus:outline-none ${
                isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
        >
            {children}
        </button>
    );
};

const ScanResultsDisplay = ({ result, onReset }: { result: ScanResult, onReset: () => void }) => {
    const [activeTab, setActiveTab] = useState<'summary' | 'findings'>('summary');
    const hasDetailedFindings = result.detailed_findings && result.detailed_findings.length > 0;

    const verdictInfoMap = {
        'Likely Authentic': { icon: CheckCircle, title: 'Likely Authentic', bg: 'from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50', textColor: 'text-green-900 dark:text-green-200' },
        'Potentially Manipulated': { icon: AlertTriangle, title: 'Potentially Manipulated', bg: 'from-yellow-100 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50', textColor: 'text-orange-900 dark:text-orange-200' },
        'Likely AI-Generated': { icon: Shield, title: 'Likely AI-Generated', bg: 'from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50', textColor: 'text-red-900 dark:text-red-200' },
        'High Confidence AI-Generated': { icon: Shield, title: 'High Confidence AI', bg: 'from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50', textColor: 'text-rose-900 dark:text-rose-200' }
    };

    const verdictInfo = verdictInfoMap[result.verdict!];
    const VerdictIcon = verdictInfo.icon;
    
    return (
        <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }} className="space-y-6">
            <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${verdictInfo.bg} ${verdictInfo.textColor} p-6`}>
                     <div className="flex flex-col gap-4 sm:flex-row items-center justify-between">
                        <div className="flex items-center gap-3 text-center sm:text-left">
                            <VerdictIcon className="w-8 h-8 flex-shrink-0" />
                            <div>
                                <CardTitle className="text-2xl">{verdictInfo.title}</CardTitle>
                                <p className="opacity-90 text-sm">AI Forensic Analysis</p>
                            </div>
                        </div>
                        <div className="text-center sm:text-right">
                           <div className="text-4xl font-bold">{result.trust_score}%</div>
                           <p className="text-sm opacity-90">Authenticity Score</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="border-b border-slate-200 dark:border-slate-700">
                        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                            <ResultTabButton isActive={activeTab === 'summary'} onClick={() => setActiveTab('summary')}>
                                <FileText className="w-5 h-5"/>
                                <span>Summary</span>
                            </ResultTabButton>
                            {hasDetailedFindings && (
                                <ResultTabButton isActive={activeTab === 'findings'} onClick={() => setActiveTab('findings')}>
                                    <Search className="w-5 h-5"/>
                                    <span>Detailed Findings</span>
                                </ResultTabButton>
                            )}
                        </nav>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pt-6"
                        >
                            {activeTab === 'summary' && (
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{result.summary}</p>
                            )}
                            {activeTab === 'findings' && hasDetailedFindings && (
                                <div className="space-y-4">
                                    {result.detailed_findings!.map((finding, index) => {
                                        const Icon = categoryIcons[finding.category];
                                        return (
                                            <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                                <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-slate-600 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-500">
                                                   {Icon && <Icon className="w-6 h-6 text-slate-600 dark:text-slate-300" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{finding.category}</p>
                                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${severityColors[finding.severity]}`}>{finding.severity}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">{finding.finding}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>
             <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={onReset} variant="outline" className="flex-1">
                    <RotateCcw className="w-4 h-4 me-2" /> Scan Another File
                </Button>
                <Button onClick={() => window.open(result.file_url, '_blank')} variant="outline" className="flex-1" disabled={!result.file_url.startsWith('blob:')}>
                    <ExternalLink className="w-4 h-4 me-2" /> View Original File
                </Button>
            </div>
        </motion.div>
    );
};

// FIX: Explicitly type ScannerInterface as a React.FC to ensure TypeScript correctly handles the 'key' prop required by AnimatePresence.
interface ScannerInterfaceProps {
    fileType: 'image' | 'video';
}
const ScannerInterface: React.FC<ScannerInterfaceProps> = ({ fileType }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const handleFileSelect = (file: File | null) => {
      setSelectedFile(file);
      setError(null);
      setScanResult(null);
    };
  
    const handleScan = useCallback(async () => {
      if (!selectedFile) return;
  
      setIsScanning(true);
      setError(null);
      const startTime = Date.now();
  
      try {
        if (fileType === 'image') {
            const base64Image = await fileToBase64(selectedFile);
            const analysis = await analyzeImage(base64Image, selectedFile.type);
            
            const result: ScanResult = {
                id: `scan-${Date.now()}`,
                created_date: new Date().toISOString(),
                file_url: URL.createObjectURL(selectedFile),
                file_type: 'image',
                ...analysis,
                processing_time: (Date.now() - startTime) / 1000,
            };
            setScanResult(result);
        } else if (fileType === 'video') {
            const base64Video = await fileToBase64(selectedFile);
            const analysis = await analyzeVideo(base64Video, selectedFile.type);
            
            const result: ScanResult = {
                id: `scan-${Date.now()}`,
                created_date: new Date().toISOString(),
                file_url: URL.createObjectURL(selectedFile),
                file_type: 'video',
                ...analysis,
                processing_time: (Date.now() - startTime) / 1000,
            };
            setScanResult(result);
        }
      } catch (e) {
          const err = e as Error;
          console.error("Scan error:", err);
          setError(err.message || "Failed to analyze the file. Please try again.");
      } finally {
          setIsScanning(false);
      }
    }, [selectedFile, fileType]);
  
    const resetScan = () => {
      setSelectedFile(null);
      setScanResult(null);
      setError(null);
    };

    return (
        <motion.div {...{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } }}>
            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <AnimatePresence mode="wait">
                {isScanning ? (
                    <motion.div key="loading" {...{ initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 } }}>
                        <Card><CardContent className="p-12 text-center">
                            <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
                            <p className="mt-4 font-semibold text-slate-800 dark:text-slate-200">Analyzing {fileType}...</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">This may take a moment.</p>
                        </CardContent></Card>
                    </motion.div>
                ) : scanResult ? (
                    <motion.div key="results">
                        <ScanResultsDisplay result={scanResult} onReset={resetScan} />
                    </motion.div>
                ) : (
                    <motion.div key="upload" {...{ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }} className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Upload {fileType === 'image' ? 'Image' : 'Video'}</CardTitle></CardHeader>
                            <CardContent>
                                <FileUploadZone 
                                    onFileSelect={handleFileSelect} 
                                    selectedFile={selectedFile}
                                    accept={`${fileType}/*`}
                                    promptText={`Drop an ${fileType} or click to upload`}
                                    subPromptText={`Analyze any ${fileType} for signs of AI generation or manipulation.`}
                                />
                            </CardContent>
                        </Card>
                        {selectedFile && (
                            <motion.div {...{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }} className="text-center">
                                <Button size="lg" onClick={handleScan} disabled={isScanning}>
                                    <ScanIcon className="w-5 h-5 me-2" />
                                    Analyze {fileType === 'image' ? 'Image' : 'Video'}
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const ComingSoon = () => (
    <motion.div {...{ initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } }}>
        <Card>
            <CardContent className="p-12 text-center">
                <Mic className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                <p className="mt-4 font-semibold text-slate-800 dark:text-slate-200">Audio Analysis Coming Soon</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">We're developing advanced tools to detect synthesized and manipulated audio. Stay tuned!</p>
            </CardContent>
        </Card>
    </motion.div>
);

const ModeTabButton = ({ isActive, children, ...props }: { isActive: boolean, children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            {...props}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors duration-200 focus:outline-none ${
                isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
        >
            {children}
        </button>
    );
};


export default function ScannerPage() {
    type ScanMode = 'image' | 'video' | 'audio';
    const [mode, setMode] = useState<ScanMode>('image');

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="max-w-2xl mx-auto">
                <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }} className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <ScanIcon className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">AI Media Scanner</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Upload media to detect deepfakes and AI-generated content.</p>
                </motion.div>

                <div className="mb-8 border-b border-slate-200 dark:border-slate-700">
                    <nav className="-mb-px flex" aria-label="Tabs">
                        <ModeTabButton isActive={mode === 'image'} onClick={() => setMode('image')}>
                            <ImageIcon className="w-5 h-5" />
                            <span>Image Scan</span>
                        </ModeTabButton>
                        <ModeTabButton isActive={mode === 'video'} onClick={() => setMode('video')}>
                            <VideoIcon className="w-5 h-5" />
                            <span>Video Scan</span>
                        </ModeTabButton>
                        <ModeTabButton isActive={mode === 'audio'} onClick={() => setMode('audio')}>
                            <Mic className="w-5 h-5" />
                            <span>Audio Scan</span>
                        </ModeTabButton>
                    </nav>
                </div>

                <AnimatePresence mode="wait">
                    {mode === 'image' && <ScannerInterface key="image" fileType="image" />}
                    {mode === 'video' && <ScannerInterface key="video" fileType="video" />}
                    {mode === 'audio' && <ComingSoon key="audio" />}
                </AnimatePresence>
            </div>
        </div>
    );
}