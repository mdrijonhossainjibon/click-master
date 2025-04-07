"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthError() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/auth');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-red-500">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            There was a problem with your authentication. You will be redirected back to the login page in <span className="text-yellow-400 font-bold">{countdown}</span> seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
