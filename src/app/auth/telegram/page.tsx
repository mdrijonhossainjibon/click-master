'use client';

import { useEffect, useState } from 'react';
import { Card, QRCode, Typography, Space, Alert } from 'antd';
import { QrcodeOutlined, MobileOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function TelegramAuth() {
    const [isTelegramClient, setIsTelegramClient] = useState(false);
    const [qrValue] = useState('https://t.me/YourBotUsername'); // Replace with your bot's username

    useEffect(() => {
        // Check if running inside Telegram Web App
        const telegram = (window as any).Telegram?.WebApp;
        if (telegram) {
            setIsTelegramClient(true);
            // Initialize Telegram Web App
            telegram.ready();
            // You can add more Telegram Web App specific initialization here
        }
    }, []);

    if (isTelegramClient) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Card className="w-full max-w-md shadow-lg">
                    <Space direction="vertical" size="large" className="w-full">
                        <div className="text-center">
                            <MobileOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                            <Title level={3}>Welcome to ClickMaster</Title>
                            <Text type="secondary">You are accessing through Telegram Mini App</Text>
                        </div>
                        <Alert
                            message="Authenticated"
                            description="You are successfully authenticated through Telegram."
                            type="success"
                            showIcon
                        />
                    </Space>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md shadow-lg">
                <Space direction="vertical" size="large" className="w-full">
                    <div className="text-center">
                        <QrcodeOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                        <Title level={3}>Scan QR Code</Title>
                        <Text type="secondary">Please scan this QR code with Telegram to continue</Text>
                    </div>
                    <div className="flex justify-center">
                        <QRCode value={qrValue} size={200} />
                    </div>
                    <Alert
                        message="External Access Detected"
                        description="This app works best within Telegram. Please open it through Telegram Mini App."
                        type="info"
                        showIcon
                    />
                </Space>
            </Card>
        </div>
    );
}