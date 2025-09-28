
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { Newspaper, Search, CheckCircle, XCircle, AlertTriangle, Loader2, FileText, AlertCircle as InfoIcon, Zap, Eye } from 'lucide-react';
import { verifyNewsWithGemini } from '../services/geminiService';
import type { NewsVerificationResult } from '../types';

const ResultsDisplay = ({ result, onReset }: { result: NewsVerificationResult, onReset: () => void }) => {
    const getVerdictInfo = (score: number) => {
        if (score >= 70) return { icon: CheckCircle, title: 'Likely Factual', bg: 'from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50', textColor: 'text-green-900 dark:text-green-200' };
        if (score >= 40) return { icon: AlertTriangle, title: 'Misleading', bg: 'from-yellow-100 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50', textColor: 'text-orange-900 dark:text-orange-200' };
        return { icon: XCircle, title: 'Potentially False', bg: 'from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50', textColor: 'text-red-900 dark:text-red-200' };
    };

    const info = getVerdictInfo(result.credibility_score);
    const VerdictIcon = info.icon;

    // FIX: Explicitly type Finding as a React.FC to ensure TypeScript correctly handles the 'key' prop in loops.
    interface FindingProps {
        icon: React.ElementType;
        text: string;
        color: string;
        darkColor: string;
    }

    const Finding: React.FC<FindingProps> = ({ icon: Icon, text, color, darkColor }) => (
        <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
            <Icon className={`w-5 h-5 mt-1 flex-shrink-0 ${color} ${darkColor}`} />
            <p className="text-sm text-slate-700 dark:text-slate-300">{text}</p>
        </div>
    );

    return (
        // FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component.
        <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } }} className="space-y-6">
            <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${info.bg} ${info.textColor} p-6`}>
                    <div className="flex flex-col gap-4 sm:flex-row items-center justify-between">
                        <div className="flex items-center gap-3 text-center sm:text-left">
                            <VerdictIcon className="w-8 h-8 flex-shrink-0" />
                            <div>
                                <CardTitle className="text-2xl">{info.title}</CardTitle>
                                <p className="opacity-90 text-sm">AI Analysis Verdict</p>
                            </div>
                        </div>
                        <div className="text-center sm:text-right">
                            <div className="text-3xl font-bold">{result.credibility_score}%</div>
                            <p className="text-sm opacity-90">Credibility Score</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-slate-500 dark:text-slate-400"/> Summary</h3>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{result.summary}</p>
                    </div>

                    {result.key_findings && result.key_findings.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2"><Zap className="w-5 h-5 text-slate-500 dark:text-slate-400"/> Key Findings</h3>
                            <div className="space-y-3">
                                {result.key_findings.map((finding, i) => (
                                    <Finding key={i} icon={Zap} text={finding} color="text-blue-600" darkColor="dark:text-blue-400" />
                                ))}
                            </div>
                        </div>
                    )}

                    {result.detected_biases && result.detected_biases.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2"><Eye className="w-5 h-5 text-slate-500 dark:text-slate-400"/> Detected Biases & Techniques</h3>
                             <div className="flex flex-wrap gap-2">
                                {result.detected_biases.map((bias, index) => (
                                    <span key={index} className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200 px-2.5 py-1 rounded-full font-medium">{bias}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
             <div className="text-center pt-4">
                <Button variant="outline" onClick={onReset}>Verify Another Claim</Button>
            </div>
        </motion.div>
    );
};

export default function NewsVerificationPage() {
    const [query, setQuery] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [result, setResult] = useState<NewsVerificationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCheck = async () => {
        if (!query.trim()) return;

        setIsChecking(true);
        setError(null);
        setResult(null);

        try {
            const apiResult = await verifyNewsWithGemini(query);
            setResult(apiResult);
        } catch (err) {
            setError("Failed to verify news. The AI model may be temporarily unavailable or the content could not be analyzed. Please try again.");
        } finally {
            setIsChecking(false);
        }
    };
    
    const reset = () => {
        setQuery('');
        setResult(null);
        setError(null);
    }

    return (
         <div className="p-4 sm:p-6 md:p-8">
            <div className="max-w-2xl mx-auto">
                {/* FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component. */}
                <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }} className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Newspaper className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">AI News Verification</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Analyze news for bias, misinformation, and propaganda techniques.</p>
                </motion.div>

                {error && <Alert variant="destructive" className="mb-6"><AlertTriangle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}

                {!result && !isChecking && (
                    // FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component.
                    <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }} className="mb-8">
                         <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><Search className="w-5 h-5" /> Enter a headline or claim to analyze</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                               <Input 
                                    placeholder="e.g., A study claims chocolate cures all diseases..." 
                                    value={query} 
                                    onChange={e => setQuery(e.target.value)} 
                                    onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
                                />
                                <Button onClick={handleCheck} disabled={!query.trim() || isChecking} size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                                    {isChecking ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Performing Deep Analysis...</> : <><Search className="w-4 h-4 mr-2" />Analyze News</>}
                                </Button>
                            </CardContent>
                         </Card>
                    </motion.div>
                )}
                
                 <AnimatePresence>
                    {isChecking && (
                         // FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component.
                         <motion.div key="loading" {...{ initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 } }}>
                            <Card><CardContent className="p-12 text-center">
                                <Loader2 className="mx-auto h-12 w-12 text-orange-600 animate-spin" />
                                <p className="mt-4 font-semibold text-slate-800 dark:text-slate-200">Analyzing content with AI...</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">This may take a moment.</p>
                            </CardContent></Card>
                        </motion.div>
                    )}
                    {result && !isChecking && <ResultsDisplay result={result} onReset={reset} />}
                </AnimatePresence>

                 {/* FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component. */}
                 <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 } }} className="mt-8">
                    <Alert>
                        <InfoIcon className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Disclaimer:</strong> This analysis is performed by an AI and should be used as a guide. Always cross-reference information from multiple reputable sources.
                        </AlertDescription>
                    </Alert>
                </motion.div>

            </div>
        </div>
    );
}