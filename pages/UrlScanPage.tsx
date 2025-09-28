import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { Link as LinkIcon, Shield, AlertTriangle, CheckCircle, Loader2, Globe, ExternalLink, AlertCircle as InfoIcon, Zap, BookOpen } from 'lucide-react';
import { analyzeUrlWithGemini } from '../services/geminiService';
import type { UrlAnalysisResult } from '../types';

const ResultsDisplay = ({ result, url, onReset }: { result: UrlAnalysisResult, url: string, onReset: () => void }) => {
    const verdictInfo = {
        'Safe': { icon: CheckCircle, title: 'URL Appears Safe', bg: 'from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50', textColor: 'text-green-900 dark:text-green-200' },
        'Caution': { icon: AlertTriangle, title: 'Exercise Caution', bg: 'from-yellow-100 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50', textColor: 'text-orange-900 dark:text-orange-200' },
        'Dangerous': { icon: Shield, title: 'High Risk URL', bg: 'from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50', textColor: 'text-red-900 dark:text-red-200' },
        'Unknown': { icon: InfoIcon, title: 'Analysis Inconclusive', bg: 'from-slate-200 to-gray-200 dark:from-slate-700 dark:to-gray-800', textColor: 'text-gray-900 dark:text-gray-200' }
    }[result.verdict];
    const VerdictIcon = verdictInfo.icon;
    
    return (
        // FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component.
        <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } }}>
            <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${verdictInfo.bg} ${verdictInfo.textColor} p-6`}>
                    <div className="flex items-center gap-3">
                        <VerdictIcon className="w-8 h-8 flex-shrink-0" />
                        <div>
                            <CardTitle className="text-2xl">{verdictInfo.title}</CardTitle>
                            <p className="opacity-90 text-sm truncate max-w-xs sm:max-w-md">{url}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-slate-500 dark:text-slate-400"/> AI Analysis Summary
                        </h3>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{result.summary}</p>
                    </div>

                    {result.threats_found.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-slate-500 dark:text-slate-400"/> Potential Threats
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {result.threats_found.map((threat, index) => (
                                    <span key={index} className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200 px-2.5 py-1 rounded-full font-medium">{threat}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {result.sources.length > 0 && (
                         <div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-slate-500 dark:text-slate-400"/> Information Sources
                            </h3>
                            <div className="space-y-2">
                                {result.sources.map((source, index) => (
                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" key={index} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 p-3 rounded-lg transition-colors duration-200">
                                        <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                        <p className="text-sm text-slate-800 dark:text-slate-300 truncate" title={source.title}>{source.title}</p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="flex justify-center pt-4">
                        <Button onClick={onReset} variant="outline">Scan Another URL</Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};


export default function UrlScanPage() {
    const [url, setUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<UrlAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const isValidUrl = (string: string) => {
        // A simple regex to check for protocol and some domain characters
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(string);
    };

    const handleScan = async () => {
        let fullUrl = url.trim();
        if (!fullUrl) return;

        if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
            fullUrl = 'https://' + fullUrl;
        }

        if (!isValidUrl(fullUrl)) {
            setError("Please enter a valid URL (e.g., example.com)");
            return;
        }
        
        setIsScanning(true);
        setError(null);
        setResult(null);

        try {
            const apiResult = await analyzeUrlWithGemini(fullUrl);
            setResult(apiResult);
            setUrl(fullUrl); // Update URL to the full version
        } catch (err) {
            setError("Failed to scan URL. Please try again.");
        } finally {
            setIsScanning(false);
        }
    };
    
    const reset = () => {
        setUrl('');
        setResult(null);
        setError(null);
    }

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="max-w-2xl mx-auto">
                 {/* FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component. */}
                 <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }} className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <LinkIcon className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">AI URL Safety Scanner</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Analyze links with AI and Google Search before you click.</p>
                </motion.div>

                {error && <Alert variant="destructive" className="mb-6"><AlertTriangle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}

                {!result && (
                    // FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component.
                    <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }} className="mb-8">
                         <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> Enter URL to Analyze</CardTitle></CardHeader>
                            <CardContent>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Input type="text" placeholder="example.com" value={url} onChange={(e) => setUrl(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleScan()} className="flex-1" />
                                    <Button onClick={handleScan} disabled={!url.trim() || isScanning} className="bg-green-600 hover:bg-green-700 text-white">
                                        {isScanning ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</> : <><Shield className="w-4 h-4 mr-2" />Analyze URL</>}
                                    </Button>
                                </div>
                            </CardContent>
                         </Card>
                    </motion.div>
                )}

                <AnimatePresence>
                    {isScanning && (
                         // FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component.
                         <motion.div key="loading" {...{ initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 } }}>
                            <Card><CardContent className="p-12 text-center">
                                <Loader2 className="mx-auto h-12 w-12 text-green-600 animate-spin" />
                                <p className="mt-4 font-semibold text-slate-800 dark:text-slate-200">Analyzing with AI and Google Search...</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">This may take a moment.</p>
                            </CardContent></Card>
                        </motion.div>
                    )}
                    {result && !isScanning && <ResultsDisplay result={result} url={url} onReset={reset} />}
                </AnimatePresence>
                
                {/* FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component. */}
                <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 } }} className="mt-8">
                    <Alert>
                        <InfoIcon className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Disclaimer:</strong> This analysis is performed by an AI using Google Search and should be used as a guide. Always exercise caution and verify information before trusting a website.
                        </AlertDescription>
                    </Alert>
                </motion.div>
            </div>
        </div>
    );
}