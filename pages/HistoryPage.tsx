import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { History as HistoryIcon, Search, Filter, Shield, AlertTriangle, CheckCircle, ExternalLink, Calendar, FileImage, FileVideo, FileAudio } from 'lucide-react';
import type { ScanResult } from '../types';

// Mock Data
// FIX: The mockScans data was not conforming to the ScanResult type. Replaced 'analysis_result' with 'summary' and restructured other properties like 'artifacts_detected' and 'processing_time' to match the type definition.
const mockScans: ScanResult[] = [
    { id: '1', created_date: '2023-10-27T10:00:00Z', file_url: '#', file_type: 'image', trust_score: 95, summary: 'Image appears authentic.', artifacts_detected: [], processing_time: 1.2 },
    { id: '2', created_date: '2023-10-26T15:30:00Z', file_url: '#', file_type: 'video', trust_score: 0, summary: 'Video scanning is currently under development.', artifacts_detected: ['Video Analysis Coming Soon'], processing_time: 0.5 },
    { id: '3', created_date: '2023-10-25T09:00:00Z', file_url: '#', file_type: 'image', trust_score: 45, summary: 'Inconsistencies in lighting suggest manipulation.', artifacts_detected: ['Unnatural Lighting'], processing_time: 2.5 },
    { id: '4', created_date: '2023-10-24T12:00:00Z', file_url: '#', file_type: 'audio', trust_score: 88, summary: 'Audio analysis clear, no signs of synthesis.', artifacts_detected: [], processing_time: 1.8 },
];

const getTrustInfo = (score: number) => {
    if (score >= 70) return { color: 'text-green-600 dark:text-green-400', Icon: CheckCircle, label: 'Trustworthy' };
    if (score >= 40) return { color: 'text-yellow-600 dark:text-yellow-400', Icon: AlertTriangle, label: 'Uncertain' };
    return { color: 'text-red-600 dark:text-red-400', Icon: Shield, label: 'Suspicious' };
}

const getFileInfo = (type: ScanResult['file_type']) => {
    if (type === 'image') return { Icon: FileImage, color: 'text-blue-600 dark:text-blue-300', bgColor: 'bg-blue-100 dark:bg-blue-900/50' };
    if (type === 'video') return { Icon: FileVideo, color: 'text-purple-600 dark:text-purple-300', bgColor: 'bg-purple-100 dark:bg-purple-900/50' };
    if (type === 'audio') return { Icon: FileAudio, color: 'text-green-600 dark:text-green-300', bgColor: 'bg-green-100 dark:bg-green-900/50' };
    return { Icon: FileImage, color: 'text-gray-600 dark:text-gray-300', bgColor: 'bg-gray-100 dark:bg-gray-800' };
}

export default function HistoryPage() {
    const [scans] = useState<ScanResult[]>(mockScans);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filteredScans = useMemo(() => {
        return scans
            .filter(scan => filterType === 'all' || scan.file_type === filterType)
            // FIX: The property 'analysis_result' does not exist on type 'ScanResult'. Changed to use the 'summary' property for filtering.
            .filter(scan => scan.summary.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [scans, searchTerm, filterType]);

    return (
        <div className="p-4 sm:p-6 md:p-8 min-h-full">
            <div className="max-w-3xl mx-auto">
                {/* FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component. */}
                <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }} className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <HistoryIcon className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">Scan History</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Review your previous media scans and analysis results.</p>
                </motion.div>

                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input placeholder="Search results..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                            </div>
                            <div className="flex items-center gap-2">
                                {['all', 'image', 'video', 'audio'].map(type => (
                                    <Button key={type} variant={filterType === type ? 'default' : 'outline'} size="sm" onClick={() => setFilterType(type)} className="capitalize">{type}</Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <div className="space-y-4">
                    {filteredScans.map((scan, index) => {
                        const { Icon: TrustIcon, color: trustColor, label: trustLabel } = getTrustInfo(scan.trust_score);
                        const { Icon: FileIcon, color: fileColor, bgColor: fileBgColor } = getFileInfo(scan.file_type);
                        return (
                             // FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component.
                             <motion.div key={scan.id} {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 } }}>
                                <Card className="hover:shadow-lg transition-shadow duration-300">
                                    <CardContent className="p-4 flex items-start gap-4">
                                        <div className={`w-12 h-12 ${fileBgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                            <FileIcon className={`w-6 h-6 ${fileColor}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <TrustIcon className={`w-5 h-5 ${trustColor}`} />
                                                        <span className={`font-bold ${trustColor}`}>{scan.trust_score}%</span>
                                                        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">{trustLabel}</span>
                                                    </div>
                                                    {/* FIX: The property 'analysis_result' does not exist on type 'ScanResult'. Changed to use the 'summary' property for display. */}
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">{scan.summary}</p>
                                                </div>
                                                 <Button variant="ghost" size="icon" onClick={() => window.open(scan.file_url, '_blank')}><ExternalLink className="w-4 h-4" /></Button>
                                            </div>
                                            <div className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                                {format(new Date(scan.created_date), "MMM d, yyyy 'at' h:mm a")}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}