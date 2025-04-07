'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthActionTypes } from '@/modules/public/auth/types';
import { RootState } from '@/modules/store';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Image from 'next/image';
import { toast } from 'react-toastify';

 
export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { error, isAuthenticated , success } = useSelector((state: RootState) => state.public.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

 useEffect(()=>{
  if (error) {
    toast.error(error);
  }
  if (success) {
    toast.success(success);
  }
 }, [error ,  success  ])

  useEffect(() => {
    // Check if we have Telegram WebApp data
    if (scriptLoaded && window.Telegram?.WebApp) {
      const { user } = window.Telegram.WebApp.initDataUnsafe;
      if (user) {
        handleTelegramLogin(user);
      }
    }
  }, [scriptLoaded]);

  const handleTelegramButtonClick = () => {
   /*  if (!scriptLoaded) {
      setLoginError('Please wait for Telegram script to load...');
      return;
    }

    try {
      if (window.Telegram?.WebApp) {
        // If we're in Telegram WebApp, use the existing user data
        const { user } = window.Telegram.WebApp.initDataUnsafe;
        if (user) {
          handleTelegramLogin(user);
          return;
        }
      }

      // If we're not in Telegram WebApp or no user data, open Telegram login widget
      const width = 550;
      const height = 470;
      const left = Math.max((window.innerWidth - width) / 2, 0);
      const top = Math.max((window.innerHeight - height) / 2, 0);

      const botId = process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID;
      if (!botId) {
        setLoginError('Telegram bot configuration is missing');
        return;
      }

      const popup = window.open(
        `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${window.location.origin}&request_access=write`,
        'Telegram Login',
        `width=${width},height=${height},left=${left},top=${top},status=0,location=0,menubar=0,toolbar=0`
      );

      if (popup) {
        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup);
            setLoading(false);
          }
        }, 500);
      }
    } catch (err) {
      setLoginError('Failed to open Telegram login. Please try again.');
      setLoading(false);
    } */


      dispatch({
        type: AuthActionTypes.LOGIN_REQUEST,
        payload: {
          telegramId: 709148502
        }
      });
  };

  const handleTelegramLogin = (user: Window['Telegram']['WebApp']['initDataUnsafe']['user']) => {
    if (!user) return;

    try {
      setLoading(true);
      dispatch({
        type: AuthActionTypes.LOGIN_REQUEST,
        payload: {
          telegramId: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username
        }
      });
    } catch (err) {
      setLoginError('Telegram login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        onLoad={() => setScriptLoaded(true)}
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        <div className="relative max-w-md w-full backdrop-blur-xl bg-gray-800/80 border border-gray-700/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[0_0_80px_rgba(0,0,0,0.35)] hover:scale-[1.02]">
          <div className="text-center">
            <Image
              src="/logo.svg"
              alt="ClickMasterAds Logo"
              width={80}
              height={80}
              className="mx-auto animate-float drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
              Welcome to ClickMasterAds
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Sign in with Telegram to start earning
            </p>
          </div>

          {(error || loginError) && (
            <div className="mt-4 text-red-500 text-sm text-center animate-shake">
              {error || loginError}
            </div>
          )}

          <div className="mt-8">
            <button
              className="group w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transform hover:-translate-y-0.5"
              onClick={handleTelegramButtonClick}
              disabled={loading}
            >
              <div className="flex items-center justify-center">
                <Image
                  src="/telegram-logo.png"
                  alt="Telegram"
                  width={24}
                  height={24}
                  className="mr-2 group-hover:scale-110 transition-transform duration-300"
                />
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Continue with Telegram'}
              </div>
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or</span>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400">
            Open ClickMasterAds in Telegram to login automatically
          </p>
        </div>
      </div>
    </>
  );
}
