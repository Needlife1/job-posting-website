'use client';

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function ApplyButton({ jobId }: { jobId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [appLicationStatus, setAppLicationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleApply = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

      setErrorMessage('');
      setAppLicationStatus('idle');

      try {
        
           await fetch(`/api/jobs/${jobId}/apply`, 
            {
                method: 'POST',
              });     
              setAppLicationStatus('success');
         
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Failed to apply for the job. Please try again later.');
          }
        setAppLicationStatus('error');
    }
    };
    
  if (status === 'loading') {
    return (
      <button
        disabled
        className="w-full py-2 bg-gray-200 text-gray-500 rounded-md cursor-not-allowed"
      >
        Loading...
      </button>
    );
    }
    
    if (appLicationStatus === 'success') {
        return (
          <div className="w-full p-4 bg-green-100 border border-green-200 text-green-800 rounded-md text-center">
            <p className="font-medium">Application submitted successfully!</p>
            <Link
              href={'/dashboard'}
              className="inline-block mt-2 text-indigo-600 hover:text-indigo-500 font-medium"
            >
              View your application
            </Link>
          </div>
        );
     }
  return (
    <>
      <button
        onClick={handleApply}
        className={`
        w-full flex justify-center items-center
        px-4 py-2 bg-indigo-600 text-white font-medium
        rounded-md hover:bg-indigo-700 transition`}
      >
        Apply for this position
      </button>
      {appLicationStatus === 'error' && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
    </>
  );
}
