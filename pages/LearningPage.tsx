
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { BookOpen, Gamepad, CheckCircle, Lock, GraduationCap, Loader2, BrainCircuit, Sparkles, X, Check, Award, Lightbulb, Target, ShieldCheck, MousePointerClick, XCircle } from 'lucide-react';
import type { LearningModule } from '../types';
import { useUserProgress } from '../hooks/useUserProgress';
import { generateLearningContent } from '../services/geminiService';
import { simpleMarkdownToHtml } from '../utils/helpers';

const learningPathModules: LearningModule[] = [
    { id: 'k1', title: 'What is a Password?', description: 'Learn why passwords are like secret codes to protect your treasures!', module_type: 'lesson', age_group: 'kids', points_reward: 25, icon: ShieldCheck },
    { id: 'k2', title: 'Password Builder Game', description: 'Challenge: Build the strongest password castle to fend off dragons!', module_type: 'game', age_group: 'kids', icon: Gamepad },
    { id: 't1', title: 'Understanding Phishing', description: 'Learn to spot fake messages trying to steal your information.', module_type: 'lesson', age_group: 'teens', points_reward: 75, icon: MousePointerClick },
    { id: 't3', title: 'Phishing Hunter', description: 'Challenge: Hunt down suspicious emails and protect your friends!', module_type: 'game', age_group: 'teens', icon: Gamepad },
    { id: 'a1', title: 'Introduction to Deepfakes', description: 'Learn the basics of deepfake technology and its implications.', module_type: 'lesson', age_group: 'adults', points_reward: 150, icon: BookOpen },
    { id: 'a3', title: 'Deepfake Challenge', description: 'Can you identify the manipulated media? Test your skills!', module_type: 'challenge', age_group: 'adults', icon: Target },
    { id: 'a2', title: 'Advanced Threat Detection', description: 'A deep-dive into identifying sophisticated cyber attacks.', module_type: 'lesson', age_group: 'adults', points_reward: 200, icon: BookOpen },
];

const nodePositions = [
  { top: '15%', left: '10%' },
  { top: '30%', left: '25%' },
  { top: '20%', left: '48%' },
  { top: '35%', left: '68%' },
  { top: '55%', left: '55%' },
  { top: '75%', left: '70%' },
  { top: '80%', left: '40%' },
];

const LessonView = ({ module, onStartQuiz }: { module: LearningModule, onStartQuiz: () => void }) => (
    <div className="p-6 max-h-[70vh] overflow-y-auto">
        <CardTitle>{module.title}</CardTitle>
        <div className="prose prose-slate dark:prose-invert max-w-none mt-4 prose-headings:text-black dark:prose-headings:text-white prose-p:text-black dark:prose-p:text-slate-300 prose-strong:text-black dark:prose-strong:text-white prose-li:text-black dark:prose-li:text-slate-300" dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(module.content) }} />
        <Button onClick={onStartQuiz} size="lg" className="mt-6 w-full">
            <BrainCircuit className="mr-2 h-5 w-5" /> Start Quiz
        </Button>
    </div>
);

const QuizView = ({ module, onQuizComplete }: { module: LearningModule, onQuizComplete: (score: number) => void }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);

    const question = module.quiz![currentQuestionIndex];

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        const correct = answer === question.correct_answer;
        setIsCorrect(correct);
        if (correct) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        if (currentQuestionIndex < module.quiz!.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            onQuizComplete(score);
        }
    };

    return (
        <div className="p-6">
            <CardHeader className="p-0 mb-4">
                <CardTitle>Quiz: {module.title}</CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">Question {currentQuestionIndex + 1} of {module.quiz!.length}</p>
            </CardHeader>
            <CardContent className="p-0">
                <p className="font-semibold text-lg mb-4">{question.question}</p>
                <div className="space-y-2">
                    {question.options.map(option => {
                        const isSelected = selectedAnswer === option;
                        let buttonClass = 'justify-start w-full text-left h-auto py-2 px-4';
                         if (isSelected) {
                            buttonClass += isCorrect ? ' bg-green-200 text-green-900 hover:bg-green-300 dark:bg-green-500/50 dark:text-white' : ' bg-red-200 text-red-900 hover:bg-red-300 dark:bg-red-500/50 dark:text-white';
                        }
                        return (
                            <Button key={option} variant="outline" className={buttonClass} disabled={selectedAnswer !== null} onClick={() => handleAnswer(option)}>
                                {isSelected && (isCorrect ? <Check className="mr-2 flex-shrink-0" /> : <X className="mr-2 flex-shrink-0" />)}
                                <span>{option}</span>
                            </Button>
                        );
                    })}
                </div>
                {selectedAnswer && (
                    // FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component.
                    <motion.div {...{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }} className="mt-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-700">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100">Explanation</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{question.explanation}</p>
                        <Button onClick={handleNext} className="mt-4 w-full">
                            {currentQuestionIndex < module.quiz!.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </Button>
                    </motion.div>
                )}
            </CardContent>
        </div>
    );
};

const QuizResultsView = ({ score, total, module, onFinish }: { score: number, total: number, module: LearningModule, onFinish: () => void }) => (
    <div className="p-6 text-center">
        {/* FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component. */}
        <motion.div {...{ initial: { scale: 0 }, animate: { scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } } }}>
            <Award className="w-20 h-20 text-yellow-500 mx-auto" />
        </motion.div>
        <CardTitle className="text-2xl mt-4">Quiz Complete!</CardTitle>
        <p className="text-lg mt-2">You scored <span className="font-bold">{score}</span> out of <span className="font-bold">{total}</span>.</p>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400 my-4">+ {module.points_reward} Points!</p>
        <Button onClick={onFinish} size="lg">
            <Sparkles className="mr-2 h-5 w-5" /> Continue Your Journey
        </Button>
    </div>
);


export default function LearningPage() {
    const { completedModules, completeModule, moduleCache, cacheModuleContent } = useUserProgress();
    const [modules, setModules] = useState<LearningModule[]>([]);
    const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
    const [modalView, setModalView] = useState<'details' | 'loading' | 'lesson' | 'quiz' | 'results' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [quizScore, setQuizScore] = useState(0);

    useEffect(() => {
        const enrichedModules = learningPathModules.map(m => {
            const cachedData = moduleCache[m.id];
            return cachedData ? { ...m, ...cachedData } : m;
        });
        setModules(enrichedModules);
    }, [moduleCache]);

    const handleNodeClick = (module: LearningModule) => {
        setSelectedModule(module);
        setModalView('details');
    };

    const handleStartModule = async (module: LearningModule) => {
        // "Generate Once" Logic: Check if the module content already exists in the cache.
        // If it does, we display it directly without calling the AI generation service again.
        if (module.content && module.quiz) {
             setModalView('lesson');
             return; // Skips AI generation completely.
        }
        setModalView('loading');
        setError(null);
        try {
            // Content does not exist, so we generate it for the first time.
            const content = await generateLearningContent(module);
            // After generation, the content is cached for all future uses.
            cacheModuleContent(module.id, {
                content: content.content,
                quiz: content.quiz,
                module_type: module.module_type,
                points_reward: module.points_reward,
            });
            const enrichedModule = { ...module, ...content };
            setSelectedModule(enrichedModule);
            setModalView('lesson');
        } catch (err) {
            setError((err as Error).message);
            setModalView('details');
        }
    };
    
    const handleQuizComplete = (score: number) => {
        setQuizScore(score);
        if (selectedModule) {
            completeModule(selectedModule.id, selectedModule.points_reward || 0);
        }
        setModalView('results');
    };
    
    const closeModal = () => {
        setSelectedModule(null);
        setModalView(null);
        setError(null);
    };

    const firstIncompleteIndex = modules.findIndex(m => !completedModules.has(m.id));

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-purple-950 dark:via-blue-950 dark:to-teal-950 min-h-full">
            <div className="max-w-4xl mx-auto">
                 {/* FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component. */}
                 <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}>
                     <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-600 dark:to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <GraduationCap className="w-10 h-10 text-slate-800 dark:text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">Cybersecurity Learning Hub</h1>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Embark on your cybersecurity journey by following the path.</p>
                    </div>
                    
                    <div className="relative w-full h-[70vh] sm:h-[500px] bg-blue-100/50 dark:bg-blue-900/20 rounded-2xl shadow-inner overflow-hidden border border-slate-200 dark:border-slate-800 p-4">
                        {/* SVG Path */}
                        <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" className="absolute top-0 left-0">
                            <path d="M 95 95 C 180 170, 220 170, 315 110 C 410 50, 480 150, 560 200 C 640 250, 550 300, 460 300 C 370 300, 250 350, 200 400 C 150 450, 300 450, 400 420" stroke="#a7bbf5" stroke-opacity="0.5" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="20 10"/>
                        </svg>

                        {/* Module Nodes */}
                        {modules.map((module, index) => {
                            const isCompleted = completedModules.has(module.id);
                            const isNext = index === firstIncompleteIndex;
                            const isLocked = index > firstIncompleteIndex && firstIncompleteIndex !== -1;
                            const position = nodePositions[index];
                            const ModuleIcon = module.icon || BookOpen;

                            let statusClasses = '';
                            if (isCompleted) statusClasses = 'bg-yellow-400 border-yellow-500 text-white';
                            else if (isNext) statusClasses = 'bg-blue-500 border-blue-600 text-white animate-pulse';
                            else if (isLocked) statusClasses = 'bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400';
                            else statusClasses = 'bg-white border-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300';

                            return (
                                // FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component.
                                <motion.div
                                    key={module.id}
                                    {...{
                                        initial: { scale: 0 },
                                        animate: { scale: 1 },
                                        transition: { type: 'spring', delay: index * 0.1 },
                                    }}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                                    style={position}
                                >
                                    <button
                                        onClick={() => handleNodeClick(module)}
                                        disabled={isLocked}
                                        className={`w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-400/50 ${statusClasses}`}
                                        aria-label={module.title}
                                    >
                                        {isCompleted ? <CheckCircle className="w-8 h-8" /> : isLocked ? <Lock className="w-8 h-8" /> : <ModuleIcon className="w-8 h-8"/>}
                                    </button>
                                     <div className="absolute bottom-full mb-2 w-48 left-1/2 -translate-x-1/2 p-2 bg-slate-800 text-white text-xs text-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        {module.title}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
                
                <AnimatePresence>
                    {selectedModule && (
                        // FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component.
                        <motion.div
                            {...{
                                initial: { opacity: 0 },
                                animate: { opacity: 1 },
                                exit: { opacity: 0 },
                            }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                            {/* FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component. */}
                            <motion.div
                                {...{
                                    initial: { scale: 0.9, opacity: 0 },
                                    animate: { scale: 1, opacity: 1 },
                                    exit: { scale: 0.9, opacity: 0 },
                                }}
                                className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
                            >
                                <Button variant="ghost" size="icon" onClick={closeModal} className="absolute top-2 right-2 z-10 rounded-full"><XCircle/></Button>
                                {modalView === 'details' && (
                                     <div className="p-6 text-center">
                                        <CardTitle className="text-2xl mb-2">{selectedModule.title}</CardTitle>
                                        <p className="text-slate-600 dark:text-slate-400 mb-6">{selectedModule.description}</p>
                                        {error && <Alert variant="destructive" className="mb-4 text-left"><AlertDescription>{error}</AlertDescription></Alert>}
                                        {selectedModule.module_type === 'lesson' ? (
                                             <Button size="lg" onClick={() => handleStartModule(selectedModule)}>Start Lesson</Button>
                                        ) : (
                                             <Button size="lg" disabled>Coming Soon</Button>
                                        )}
                                    </div>
                                )}
                                {modalView === 'loading' && <div className="p-12 text-center"><Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin" /><p className="mt-4 font-semibold text-slate-800 dark:text-slate-200">Generating Lesson with AI...</p></div>}
                                {modalView === 'lesson' && <LessonView module={selectedModule} onStartQuiz={() => setModalView('quiz')} />}
                                {modalView === 'quiz' && <QuizView module={selectedModule} onQuizComplete={handleQuizComplete} />}
                                {modalView === 'results' && <QuizResultsView score={quizScore} total={selectedModule.quiz!.length} module={selectedModule} onFinish={closeModal} />}
                           </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                 {/* FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component. */}
                 <motion.div {...{ initial: { opacity: 0 }, animate: { opacity: 1}, transition: { delay: 0.5 } }} className="mt-8">
                    <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                            <strong>AI-Powered Learning:</strong> All lessons and quizzes are dynamically generated by AI to provide a unique learning experience.
                        </AlertDescription>
                    </Alert>
                </motion.div>
            </div>
        </div>
    );
}