
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User as UserIcon, Shield, Award, Zap, Settings, TrendingUp, Target, Edit } from 'lucide-react';
import { useUserProgress } from '../hooks/useUserProgress';
import { fileToBase64 } from '../utils/helpers';

const StatCard = ({ icon: Icon, value, label, color, darkColor }: { icon: React.ElementType, value: string | number, label: string, color: string, darkColor: string }) => (
    <Card>
        <CardContent className="p-4 text-center">
            <div className={`w-12 h-12 ${color} ${darkColor} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <Icon className="w-6 h-6 text-black dark:text-white" />
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        </CardContent>
    </Card>
);

export default function ProfilePage() {
    const { user, stats, updateProfilePhoto } = useUserProgress();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                updateProfilePhoto(`data:${file.type};base64,${base64}`);
            } catch (error) {
                console.error("Error converting file to base64", error);
                // Optionally show an error message to the user
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 min-h-full">
            <div className="max-w-3xl mx-auto">
                 {/* FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component. */}
                 <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }} className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-blue-200 dark:from-slate-700 dark:to-blue-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <UserIcon className="w-10 h-10 text-slate-900 dark:text-slate-100" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">Your Profile</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Manage your account and view your cybersecurity journey.</p>
                </motion.div>

                <div className="space-y-6">
                    {/* FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component. */}
                    <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 } }}>
                        <Card className="bg-gradient-to-br from-blue-100 to-teal-100 dark:from-blue-900/50 dark:to-teal-900/50 text-black shadow-xl border-0">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="relative group flex-shrink-0">
                                        <img 
                                            src={user.profile_photo_base64} 
                                            alt={user.full_name} 
                                            className="w-20 h-20 rounded-full object-cover border-2 border-black/20 dark:border-white/20 shadow-lg"
                                        />
                                        <button 
                                            onClick={handlePhotoUploadClick}
                                            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            aria-label="Change profile picture"
                                        >
                                            <Edit className="w-6 h-6 text-white" />
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept="image/png, image/jpeg, image/gif"
                                        />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h2 className="text-2xl font-bold dark:text-white">{user.full_name}</h2>
                                        <p className="text-blue-900/80 dark:text-blue-200/80">{user.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component. */}
                    <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 } }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard icon={Shield} value={stats.totalScans} label="Media Scanned" color="bg-blue-300" darkColor="dark:bg-blue-800" />
                        <StatCard icon={TrendingUp} value={`${stats.averageTrustScore}%`} label="Avg. Trust Score" color="bg-green-300" darkColor="dark:bg-green-800" />
                        <StatCard icon={Award} value={user.level} label="Level" color="bg-purple-300" darkColor="dark:bg-purple-800" />
                        <StatCard icon={Target} value={user.learning_progress?.current_streak || 0} label="Day Streak" color="bg-yellow-300" darkColor="dark:bg-yellow-800" />
                    </motion.div>

                    {/* FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component. */}
                    <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 } }}>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5"/>Settings</CardTitle></CardHeader>
                            <CardContent>
                                {/* Settings content would go here, e.g., language, age group selectors */}
                                <p className="text-sm text-slate-500 dark:text-slate-400">Profile settings are managed here.</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <div className="text-center pt-4">
                        <Button variant="destructive" className="bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white dark:hover:text-white">Sign Out</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}