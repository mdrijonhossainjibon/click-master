"use client";

import { QRCode, Typography, theme, Button } from 'antd';
import { motion } from 'framer-motion';

export default function TelegramPage() {
    const { token } = theme.useToken();
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-8 max-w-md w-full backdrop-blur-md bg-white/10 dark:bg-black/10 p-8 rounded-3xl border border-gray-200/20 dark:border-white/10"
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="space-y-2"
                >
                    <Typography.Title 
                        level={2} 
                        style={{ marginBottom: '0.5rem' }}
                        className="text-gray-800 dark:text-gray-100 font-bold tracking-tight"
                    >
                        Join Our Telegram Community
                    </Typography.Title>
                    <Typography.Text className="text-gray-600 dark:text-gray-400 text-lg block">
                        Connect with us instantly on Telegram
                    </Typography.Text>
                </motion.div>

                <motion.div 
                    className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 dark:shadow-blue-500/10 relative group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <QRCode
                        errorLevel="H"
                        size={280}
                        value="https://t.me/your_bot_username"
                        icon="/telegram-logo.png"
                        className="dark:bg-gray-700 rounded-xl p-2 relative z-10 mx-auto transform transition-transform duration-300 group-hover:rotate-1"
                    />
                </motion.div>

                <div className="space-y-6">
                    <div className="flex items-center justify-center space-x-2 text-gray-700 dark:text-gray-300">
                        <span className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700" />
                        <Typography.Text className="text-lg font-medium">
                            📱 Scan QR Code or
                        </Typography.Text>
                        <span className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700" />
                    </div>

                    <div className="flex justify-center gap-4">
                        <Button 
                            type="primary" 
                            size="large"
                            href="https://t.me/your_bot_username"
                            target="_blank"
                            className="hover:opacity-90 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                            style={{
                                background: '#0088cc',
                                height: '48px',
                                padding: '0 2rem',
                                borderRadius: '12px'
                            }}
                        >
                            <span className="flex items-center space-x-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.75 3.98-1.73 6.64-2.87 7.97-3.44 3.8-1.62 4.58-1.9 5.1-1.91.11 0 .37.03.54.17.14.12.18.28.2.45-.02.14-.02.3-.03.46z"/>
                                </svg>
                                <span>Open in Telegram</span>
                            </span>
                        </Button>
                    </div>

                    <Typography.Text className="text-gray-600 dark:text-gray-400 text-sm block opacity-75">
                        This service is exclusively available through Telegram
                    </Typography.Text>
                </div>
            </motion.div>
        </div>
    );
}