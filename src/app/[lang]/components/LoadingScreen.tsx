'use client';
import React from 'react';
import { Spin } from 'antd';

interface LoadingScreenProps {
    label?: string;
    spinning?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
    label = 'Loading...', 
    spinning = true 
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/95 backdrop-blur-md z-50">
            <div className="bg-gray-800 p-6 rounded-xl sm:rounded-2xl border border-gray-700 shadow-xl text-center">
                <Spin size="large" spinning={spinning} />
                <p className="mt-4 text-gray-300 text-sm sm:text-base">{label}</p>
            </div>
        </div>
    );
};

export default LoadingScreen;