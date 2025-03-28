'use client';

import React from 'react';
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/app/providers/ThemeProvider";

import { StyleProvider } from '@ant-design/cssinjs';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/app/store';
import { App } from 'antd';
import { isMobile } from 'react-device-detect';
export default function WrapperProvider({ children }: { children: React.ReactNode }) {
   

   return (
      <StyleProvider hashPriority="high">
        <ReduxProvider store={store}>
          <SessionProvider>
            <ThemeProvider>
              <App>
              <div style={{ 
                minHeight: '100vh',
                background: '#00000',
                color: 'rgba(255,255,255,0.85)'
              }}>
      
                {children}
              </div>
              </App>
            </ThemeProvider>
          </SessionProvider>
        </ReduxProvider>
      </StyleProvider>
   )
}