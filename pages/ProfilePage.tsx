import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User as UserIcon, Shield, Award, Zap, Settings, TrendingUp, Target } from 'lucide-react';
import { useUserProgress } from '../hooks/useUserProgress';

const StatCard = ({ icon: Icon, value, label, color }: { icon: React.ElementType, value: string | number, label: string, color: string }) => (
    <Card>
        <CardContent className="p-4 text-center">
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <Icon className="w-6 h-6 text-black" />
            </div>
            <p className="text-xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
        </CardContent>
    </Card>
);

export default function ProfilePage() {
    const { user, stats } = useUserProgress();

    return (
        <div className="p-4 sm:p-6 md:p-8 min-h-full">
            <div className="max-w-3xl mx-auto">
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <UserIcon className="w-10 h-10 text-slate-900" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Your Profile</h1>
                    <p className="mt-2 text-slate-600">Manage your account and view your cybersecurity journey.</p>
                </motion.div>

                <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="bg-gradient-to-br from-blue-100 to-teal-100 text-black shadow-xl border-0">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-black/10 border-2 border-black/20 rounded-full flex items-center justify-center text-3xl font-bold">
                                        {user.full_name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{user.full_name}</h2>
                                        <p className="text-blue-900/80">{user.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard icon={Shield} value={stats.totalScans} label="Media Scanned" color="bg-blue-300" />
                        <StatCard icon={TrendingUp} value={`${stats.averageTrustScore}%`} label="Avg. Trust Score" color="bg-green-300" />
                        <StatCard icon={Award} value={user.level} label="Level" color="bg-purple-300" />
                        <StatCard icon={Target} value={user.learning_progress?.current_streak || 0} label="Day Streak" color="bg-yellow-300" />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5"/>Settings</CardTitle></CardHeader>
                            <CardContent>
                                {/* Settings content would go here, e.g., language, age group selectors */}
                                <p className="text-sm text-slate-500">Profile settings are managed here.</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <div className="text-center pt-4">
                        <Button variant="destructive" className="bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-black">Sign Out</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}