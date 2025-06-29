
"use client";
import {login} from "@/lib/auth";

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-15rem)] flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md ring-1 ring-gray-200 p-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome to the JobBoard
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in to post jobs or apply for opportunities
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={login}
            className="group relative w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-100 transition"
          >
            <img
              className="w-6 h-6"
              src="https://github.githubassets.com/favicons/favicon.svg"
              alt="GitHub logo"
            />
            <span className="text-sm font-medium">Continue with GitHub</span>
            <span className="absolute inset-y-0 right-4 flex items-center text-xs text-gray-400 transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          By signing in, you agree to our{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
