'use client';

import React from 'react';
import { SessionProvider } from "next-auth/react";
 

import { StyleProvider } from '@ant-design/cssinjs';
import { Provider as ReduxProvider } from 'react-redux';
 
import { ToastContainer  } from 'react-toastify';
import store from '@/modules/store';
 
 

export default function WrapperProvider({ children }: { children: React.ReactNode }) {
   

   return (
      <StyleProvider hashPriority="high">
        <ReduxProvider store={store}>
          <SessionProvider>
             
             <ToastContainer />
                {children}
            
            
          </SessionProvider>
        </ReduxProvider>
      </StyleProvider>
   )
}