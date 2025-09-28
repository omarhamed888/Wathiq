
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { KeyRound, AlertTriangle, Check, X, Eye, EyeOff, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import type { PasswordAnalysisResult } from '../types';

// Declare zxcvbn for TypeScript since it's loaded from a script tag
declare const zxcvbn: (password: string) => {
    score: 0 | 1 | 2 | 3 | 4;
    feedback: {
        warning?: string;
        suggestions: string[];
    }
};


// Strength bar component
const StrengthMeter = ({ score }: { score: number }) => {
    const getStrengthInfo = () => {
        if (score > 80) return { width: '100%', color: 'bg-green-500', label: 'Very Strong' };
        if (score > 60) return { width: '75%', color: 'bg-emerald-500', label: 'Strong' };
        if (score > 40) return { width: '50%', color: 'bg-yellow-500', label: 'Moderate' };
        if (score > 20) return { width: '25%', color: 'bg-orange-500', label: 'Weak' };
        return { width: '10%', color: 'bg-red-500', label: 'Very Weak' };
    };

    const { width, color, label } = getStrengthInfo();

    return (
        <div>
            <div className="relative h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                    className={`absolute top-0 left-0 h-full rounded-full ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>
            <p className="text-right text-sm font-medium mt-1 text-slate-600 dark:text-slate-400">{label}</p>
        </div>
    );
};

// Results display component
const AnalysisResults = ({ result }: { result: PasswordAnalysisResult }) => {
    
    // FIX: Explicitly type FeedbackItem as a React.FC to ensure TypeScript correctly handles the 'key' prop in loops.
    const FeedbackItem: React.FC<{ text: string; isPositive: boolean }> = ({ text, isPositive }) => (
        <div className="flex items-start gap-3">
            {isPositive ? 
                <Check className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" /> :
                <X className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
            }
            <p className="text-sm text-slate-700 dark:text-slate-300">{text}</p>
        </div>
    );

    const verdictInfo = {
        'Very Strong': { icon: ShieldCheck, color: 'text-green-500' },
        'Strong': { icon: ShieldCheck, color: 'text-emerald-500' },
        'Moderate': { icon: Shield, color: 'text-yellow-500' },
        'Weak': { icon: ShieldAlert, color: 'text-orange-500' },
        'Very Weak': { icon: ShieldAlert, color: 'text-red-500' },
    }[result.verdict];
    const VerdictIcon = verdictInfo.icon;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 mt-6"
        >
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                         <CardTitle className="flex items-center gap-2">
                             <VerdictIcon className={`w-6 h-6 ${verdictInfo.color}`} />
                             <span>Password Strength: {result.verdict}</span>
                         </CardTitle>
                         <span className={`text-2xl font-bold ${verdictInfo.color}`}>{result.score}/100</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <StrengthMeter score={result.score} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                            <h4 className="font-semibold mb-3 text-slate-800 dark:text-slate-100">Recommendations</h4>
                            <div className="space-y-2">
                                {result.enhancements.length > 0 ? (
                                    result.enhancements.map((item, i) => <FeedbackItem key={i} text={item} isPositive={false} />)
                                ) : (
                                    <p className="text-sm text-slate-500">No specific recommendations. Looks good!</p>
                                )}
                            </div>
                        </div>
                         <div>
                            <h4 className="font-semibold mb-3 text-slate-800 dark:text-slate-100">Positive Points</h4>
                            <div className="space-y-2">
                                {result.positive_points.length > 0 ? (
                                    result.positive_points.map((item, i) => <FeedbackItem key={i} text={item} isPositive={true} />)
                                ) : (
                                     <p className="text-sm text-slate-500">No positive points found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
};


export default function PasswordCheckerPage() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [result, setResult] = useState<PasswordAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Debounce effect to analyze password with zxcvbn
    useEffect(() => {
        const handler = setTimeout(() => {
            if (!password) {
                setResult(null);
                return;
            }
            
            setError(null);
            try {
                const analysis = zxcvbn(password);
                const scoreMap = [10, 25, 50, 75, 100];
                const verdictMap: PasswordAnalysisResult['verdict'][] = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];

                const enhancements = [...analysis.feedback.suggestions];
                if (analysis.feedback.warning) {
                    enhancements.unshift(analysis.feedback.warning);
                }

                const positive_points: string[] = [];
                if (analysis.score >= 3) {
                    if (password.length >= 12) {
                        positive_points.push("Excellent length.");
                    }
                    if (/\d/.test(password) && /[a-zA-Z]/.test(password) && /[^a-zA-Z\d]/.test(password)) {
                         positive_points.push("Good mix of characters (letters, numbers, and symbols).");
                    }
                }
                
                if (analysis.score < 2 && password.length > 0 && enhancements.length === 0) {
                    enhancements.push('Make the password longer and more complex.');
                }
                
                const newResult: PasswordAnalysisResult = {
                    score: scoreMap[analysis.score],
                    verdict: verdictMap[analysis.score],
                    enhancements,
                    positive_points,
                };
                setResult(newResult);

            } catch(e) {
                setError("Failed to analyze password. The analysis library might not have loaded correctly.");
                console.error("zxcvbn error:", e);
            }

        }, 300); // 300ms delay for better UX

        // Cleanup function
        return () => {
            clearTimeout(handler);
        };
    }, [password]);

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="max-w-2xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <KeyRound className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">Password Strength Checker</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Instantly check your password's strength and get improvement tips.</p>
                </motion.div>

                {error && <Alert variant="destructive" className="mb-6"><AlertTriangle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}

                <Card>
                    <CardHeader><CardTitle>Enter a password to analyze</CardTitle></CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pr-12"
                                aria-label="Password input"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <AnimatePresence>
                    {result && <AnalysisResults result={result} />}
                </AnimatePresence>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>For your security:</strong> Do not enter any of your real, active passwords on this or any other website. Use it to test password ideas only.
                        </AlertDescription>
                    </Alert>
                </motion.div>
            </div>
        </div>
    );
}