
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Shield, Scan, GraduationCap, ArrowRight, AlertTriangle, Zap, TrendingUp, Award, Users, ArrowLeft, Expand } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserProgress } from '../hooks/useUserProgress'; // Import the hook
import { useTranslation, useLanguage } from '../contexts/ThemeContext';

// Mock Data for recent scans - user stats will come from the hook
const recentScans = [
  { id: '1', trust_score: 95, analysis_result: 'Image appears authentic with no signs of manipulation.', created_date: new Date().toISOString(), file_type: 'image' },
  { id: '2', trust_score: 45, analysis_result: 'Detected inconsistencies in lighting, suggesting potential manipulation.', created_date: new Date().toISOString(), file_type: 'image' },
  { id: '3', trust_score: 88, analysis_result: 'Audio analysis clear, no signs of synthesis.', created_date: new Date().toISOString(), file_type: 'audio' },
];


const StatsCard = ({ title, value, icon: Icon, color, bgColor, trend, language }: { title: string; value: string | number; icon: React.ElementType; color: string; bgColor: string; trend?: string; language: 'en' | 'ar' }) => {
    const isRtl = language === 'ar';

    return (
        <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col justify-center items-center h-36 relative">
                <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'}`}>
                    <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                </div>
                {trend && (
                    <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'}`}>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
                           {isRtl ? (
                                <>
                                    {trend}
                                    <TrendingUp className="w-4 h-4 ms-1"/>
                                </>
                            ) : (
                                <>
                                    <TrendingUp className="w-4 h-4 me-1"/>
                                    {trend}
                                </>
                            )}
                        </span>
                    </div>
                )}
                <div className="text-center">
                    <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{title}</p>
                </div>
            </CardContent>
        </Card>
    );
};

const TrustScoreCard: React.FC<{ scan: any }> = ({ scan }) => {
    const isTrusted = scan.trust_score > 70;
    return (
        <Card className="hover:shadow-xl transition-shadow duration-300">
             <CardContent className="p-6 text-start">
                <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold ${isTrusted ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>{scan.trust_score}% Trust Score</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{new Date(scan.created_date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{scan.analysis_result}</p>
             </CardContent>
        </Card>
    );
}


export default function HomePage() {
  const { user, stats } = useUserProgress();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const ArrowForward = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-100 via-blue-100 to-teal-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 text-black dark:text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          {/* FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component. */}
          <motion.div {...{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } }}>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-slate-50">
              {t('home.title')}
            </h1>
            <p className="text-lg md:text-xl text-blue-900/80 dark:text-blue-200/80 max-w-3xl mx-auto leading-relaxed">
              {t('home.subtitle')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <Link to="/scanner">
                  <Scan className="w-5 h-5 me-2" /> {t('home.scanButton')} <ArrowForward className="w-4 h-4 ms-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-slate-800 dark:border-slate-200 text-black dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <Link to="/learning">
                  <GraduationCap className="w-5 h-5 me-2" /> {t('home.learningButton')}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title={t('home.stats.totalScans')} value={stats.totalScans} icon={Expand} color="text-blue-600" bgColor="bg-blue-100 dark:bg-blue-900/50" language={language} />
                <StatsCard title={t('home.stats.avgTrustScore')} value={`${stats.averageTrustScore}%`} icon={Shield} color="text-green-600" bgColor="bg-green-100 dark:bg-green-900/50" trend="+5%" language={language} />
                <StatsCard title={t('home.stats.points')} value={user.total_points} icon={Zap} color="text-yellow-600" bgColor="bg-yellow-100 dark:bg-yellow-900/50" language={language} />
                <StatsCard title={t('home.stats.level')} value={user.level} icon={Award} color="text-purple-600" bgColor="bg-purple-100 dark:bg-purple-900/50" language={language} />
            </div>
        </div>
      </section>

       {/* Recent Activity */}
      {recentScans.length > 0 && (
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">{t('home.recentActivity')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentScans.map((scan) => (
                <TrustScoreCard key={scan.id} scan={scan} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Security Tips Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('home.securityTip.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400">{t('home.securityTip.subtitle')}</p>
            </div>
            <Card className="max-w-3xl mx-auto shadow-xl border-0 bg-white dark:bg-slate-800">
                <CardHeader className="text-center items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-slate-800" />
                    </div>
                    <CardTitle>{t('home.securityTip.cardTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        {t('home.securityTip.cardContent')}
                    </p>
                    <Button className="bg-gradient-to-r from-blue-200 to-teal-200 text-blue-900 dark:from-blue-500/80 dark:to-teal-500/80 dark:text-white" asChild>
                        <Link to="/learning">{t('home.securityTip.learnMoreButton')} <ArrowForward className="w-4 h-4 ms-2" /></Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  );
}
