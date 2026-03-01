"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle"; // Import your new toggle component

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-8 py-3 flex items-center justify-between transition-all">
      {/* Logo Section */}
      <div
        onClick={() => router.push("/")}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white">
          VIDEO<span className="text-blue-600">HUB</span>
        </h1>
      </div>

      {/* Action Section */}
      <div className="flex items-center gap-3 sm:gap-5">
        <Link
          href="/"
          className="text-sm font-semibold text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-white transition-colors hidden sm:block"
        >
          Home
        </Link>

        {/* Theme Toggle placed here for easy access */}
        <ThemeToggle />

        {session ? (
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => router.push("/upload")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-full transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="hidden xs:block">Upload</span>
            </button>

            <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 hidden md:block" />

            <div className="hidden md:flex flex-col items-end leading-none">
              <span className="text-xs font-bold text-zinc-900 dark:text-white">
                Account
              </span>
              <span className="text-[10px] text-zinc-500 truncate max-w-[100px]">
                {session.user?.email}
              </span>
            </div>

            <button
              onClick={() => signOut()}
              className="text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors active:scale-95"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/login")}
              className="text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-4 py-2 rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/register")}
              className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold px-5 py-2 rounded-full hover:opacity-90 transition-opacity active:scale-95"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
