'use client';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
    dictionary?: {
        about: string;
        close: string;
        welcome: string;
        description: string;
        features: string;
        howItWorks: string;
        support: string;
        version: string;
    };
}

export default function AboutModal({ 
    isOpen, 
    onClose,
    dictionary = {
        about: 'About ClickMaster',
        close: 'Close',
        welcome: 'Welcome to ClickMaster',
        description: 'Your trusted platform for earning rewards by watching ads',
        features: 'Features',
        howItWorks: 'How It Works',
        support: 'Support',
        version: 'Version'
    }
}: AboutModalProps) {
    if (!isOpen) return null;

    const features = [
        { icon: '💰', title: 'Earn Rewards', description: 'Get paid for watching advertisements' },
        { icon: '🎯', title: 'Daily Tasks', description: 'Complete tasks for bonus earnings' },
        { icon: '🔄', title: 'Auto-Play', description: 'Automated ad viewing experience' },
        { icon: '📊', title: 'Statistics', description: 'Track your earnings and progress' },
        { icon: '🏆', title: 'Achievements', description: 'Unlock rewards for milestones' },
        { icon: '💳', title: 'Easy Withdrawals', description: 'Multiple payment options available' }
    ];

    const howItWorks = [
        'Sign in with your Telegram account',
        'Watch ads to earn rewards',
        'Complete daily tasks for bonuses',
        'Track your progress and achievements',
        'Withdraw earnings when ready'
    ];

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 md:bg-black/50 md:backdrop-blur-sm md:p-4 md:flex md:items-center md:justify-center">
            <div className="relative h-full md:h-auto w-full md:max-w-2xl md:rounded-2xl md:border md:border-gray-800 bg-gray-900 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 z-10 p-4 border-b border-gray-800 bg-gradient-to-r from-purple-500 to-indigo-500">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">{dictionary.about}</h2>
                        <button 
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white/80 hover:text-white transition-all hover:bg-black/30 active:scale-95"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)] md:max-h-[80vh]">
                    {/* Welcome Section */}
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            {dictionary.welcome}
                        </h1>
                        <p className="text-gray-400">{dictionary.description}</p>
                    </div>

                    {/* Features Grid */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">{dictionary.features}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <div 
                                    key={index}
                                    className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-purple-500/30 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-xl">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-white">{feature.title}</h4>
                                            <p className="text-sm text-gray-400">{feature.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">{dictionary.howItWorks}</h3>
                        <div className="space-y-4">
                            {howItWorks.map((step, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/30"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                                        {index + 1}
                                    </div>
                                    <p className="text-gray-300">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Support Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">{dictionary.support}</h3>
                        <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-xl">
                                    💬
                                </div>
                                <div>
                                    <p className="text-gray-300">Need help? Contact our support team through Telegram</p>
                                    <a href="https://t.me/clickmaster_support" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
                                        @clickmaster_support
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Version */}
                    <div className="text-center text-sm text-gray-500">
                        {dictionary.version} 1.0.0
                    </div>
                </div>
            </div>
        </div>
    );
}
