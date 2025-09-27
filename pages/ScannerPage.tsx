import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Upload, Camera, Loader2, Scan as ScanIcon, Clock, AlertTriangle, Shield, CheckCircle, Share, RotateCcw, ExternalLink, FileText, Search, Cpu, Grid, Mountain, Smile, Sunrise, Info } from 'lucide-react';
import { analyzeImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/helpers';
import type { ScanResult, DetailedFinding } from '../types';

const categoryIcons: Record<DetailedFinding['category'], React.ElementType> = {
    "Anatomy & Proportions": Smile,
    "Lighting & Shadows": Sunrise,
    "Background & Environment": Mountain,
    "Texture & Detail": Grid,
    "AI Artifacts": Cpu,
    "Other": Info,
};

const severityColors: Record<DetailedFinding['severity'], string> = {
    "Low": "bg-yellow-100 text-yellow-800",
    "Medium": "bg-orange-100 text-orange-800",
    "High": "bg-red-100 text-red-800",
};


// Child Components defined outside to prevent re-renders
const FileUploadZone = ({ onFileSelect, selectedFile }: { onFileSelect: (file: File | null) => void, selectedFile: File | null }) => {
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
             <div className="text-center p-4 bg-slate-100 rounded-lg">
                <p className="font-medium text-slate-800">{selectedFile.name}</p>
                <Button variant="link" size="sm" onClick={() => onFileSelect(null)}>Clear</Button>
            </div>
        );
    }

    return (
        <div 
            className="relative border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            <input type="file" accept="image/*,video/*,audio/*" onChange={handleFileInput} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <Upload className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">Drop a file or click to upload</h3>
            <p className="mt-1 text-xs text-slate-500">Image, Video, or Audio</p>
        </div>
    );
}

const ScanResultsDisplay = ({ result, onReset }: { result: ScanResult, onReset: () => void }) => {
    const isImageAnalysis = result.file_type === 'image' && result.verdict;

    const verdictInfoMap = {
        'Likely Authentic': { icon: CheckCircle, title: 'Likely Authentic', bg: 'from-green-100 to-emerald-100', textColor: 'text-green-900' },
        'Potentially Manipulated': { icon: AlertTriangle, title: 'Potentially Manipulated', bg: 'from-yellow-100 to-orange-100', textColor: 'text-orange-900' },
        'Likely AI-Generated': { icon: Shield, title: 'Likely AI-Generated', bg: 'from-orange-100 to-red-100', textColor: 'text-red-900' },
        'High Confidence AI-Generated': { icon: Shield, title: 'High Confidence AI', bg: 'from-red-100 to-rose-100', textColor: 'text-rose-900' }
    };

    const getGeneralTrustInfo = (score: number) => {
        if (score >= 70) return verdictInfoMap['Likely Authentic'];
        if (score >= 40) return verdictInfoMap['Potentially Manipulated'];
        return verdictInfoMap['Likely AI-Generated'];
    };
    
    const verdictInfo = isImageAnalysis ? verdictInfoMap[result.verdict!] : getGeneralTrustInfo(result.trust_score);
    const VerdictIcon = verdictInfo.icon;
    
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${verdictInfo.bg} ${verdictInfo.textColor} p-6`}>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <VerdictIcon className="w-8 h-8" />
                            <div>
                                <CardTitle className="text-2xl">{verdictInfo.title}</CardTitle>
                                <p className="opacity-90 text-sm">AI Forensic Analysis</p>
                            </div>
                        </div>
                        <div className="text-right">
                           <div className="text-4xl font-bold">{result.trust_score}%</div>
                           <p className="text-sm opacity-90">Authenticity Score</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-slate-500"/> Forensic Summary</h4>
                        <p className="text-slate-700 leading-relaxed">{result.summary}</p>
                    </div>
                    {isImageAnalysis && result.detailed_findings && result.detailed_findings.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-slate-500"/> Detailed Findings</h4>
                            <div className="space-y-4">
                                {result.detailed_findings.map((finding, index) => {
                                    const Icon = categoryIcons[finding.category];
                                    return (
                                        <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                                            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                                               {Icon && <Icon className="w-6 h-6 text-slate-600" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="font-semibold text-sm text-slate-800">{finding.category}</p>
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${severityColors[finding.severity]}`}>{finding.severity}</span>
                                                </div>
                                                <p className="text-sm text-slate-600">{finding.finding}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                     {!isImageAnalysis && result.artifacts_detected && result.artifacts_detected.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-2">Detected Issues</h4>
                            <div className="flex flex-wrap gap-2">
                                {result.artifacts_detected.map((artifact, index) => (
                                    <span key={index} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">{artifact}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
             <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={onReset} variant="outline" className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" /> Scan Another File
                </Button>
                <Button onClick={() => window.open(result.file_url, '_blank')} variant="outline" className="flex-1" disabled={!result.file_url.startsWith('blob:')}>
                    <ExternalLink className="w-4 h-4 mr-2" /> View Original File
                </Button>
            </div>
        </motion.div>
    );
};


export default function ScannerPage() {
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
        const fileType = selectedFile.type.startsWith('image/') ? 'image' : selectedFile.type.startsWith('video/') ? 'video' : 'audio';

        if (fileType === 'video' || fileType === 'audio') {
            const result: ScanResult = {
                id: `scan-${Date.now()}`,
                created_date: new Date().toISOString(),
                file_url: URL.createObjectURL(selectedFile),
                file_type: fileType,
                trust_score: 0,
                summary: `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} scanning is currently under development. This feature will be available soon with advanced detection capabilities.`,
                artifacts_detected: [`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} Analysis Coming Soon`],
                processing_time: (Date.now() - startTime) / 1000,
            };
            setScanResult(result);
        } else if (fileType === 'image') {
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
        }

    } catch (e) {
        const err = e as Error;
        console.error("Scan error:", err);
        setError(err.message || "Failed to analyze the file. Please try again.");
    } finally {
        setIsScanning(false);
    }
  }, [selectedFile]);

  const resetScan = () => {
    setSelectedFile(null);
    setScanResult(null);
    setError(null);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ScanIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">AI Media Scanner</h1>
            <p className="mt-2 text-slate-600">Upload media to detect deepfakes and AI-generated content.</p>
        </motion.div>

        {error && (
            <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <AnimatePresence mode="wait">
            {isScanning ? (
                <motion.div key="loading" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <Card><CardContent className="p-12 text-center">
                        <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
                        <p className="mt-4 font-semibold text-slate-800">Analyzing media...</p>
                        <p className="text-sm text-slate-500">This may take a moment.</p>
                    </CardContent></Card>
                </motion.div>
            ) : scanResult ? (
                <motion.div key="results">
                    <ScanResultsDisplay result={scanResult} onReset={resetScan} />
                </motion.div>
            ) : (
                <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Upload Media</CardTitle></CardHeader>
                        <CardContent>
                            <FileUploadZone onFileSelect={handleFileSelect} selectedFile={selectedFile} />
                        </CardContent>
                    </Card>
                    {selectedFile && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                            <Button size="lg" onClick={handleScan} disabled={isScanning}>
                                <ScanIcon className="w-5 h-5 mr-2" />
                                Analyze Media
                            </Button>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}