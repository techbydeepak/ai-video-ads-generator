"use client";

import { useUser, UserProfile, UserButton, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function page() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    setFadeIn(true);
  }, []);

  // ===== NOT SIGNED-IN LANDING PAGE =====

  if (isSignedIn && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
        <div className="animate-spin h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  if (!isSignedIn) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-red-500 overflow-hidden">
        
        {/* Hero Section */}
        <header
          className={`max-w-6xl mx-auto px-8 pt-32 text-center transition-opacity duration-1000 ${
            fadeIn ? "opacity-100" : "opacity-0"
          }`}
        >
          <h1 className="text-7xl font-extrabold tracking-wide drop-shadow-[0_0_8px_rgba(255,46,46,0.8)] mb-6 font-sans-condensed uppercase text-red-600">
            AI Video Ad Generator
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-12 text-red-400 drop-shadow-md font-semibold">
            Create stunning, personalized video ads in minutes — powered by AI.<br />
            Effortless, professional, and ready to convert.
          </p>

          <div className="flex justify-center gap-10">
            <Link href="/sign-in" passHref>
              <Button
                className="px-14 py-5 text-2xl font-bold rounded-full bg-gradient-to-r from-red-700 to-orange-600 shadow-lg shadow-red-700/60 hover:from-orange-600 hover:to-red-700 transform hover:scale-105 transition duration-300"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </header>

        {/* Footer */}
        <footer className="bg-black bg-opacity-90 text-red-600 text-center py-8 mt-20 font-semibold tracking-wide">
          &copy; {new Date().getFullYear()} AI Video Ad Generator. All rights reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* User Info Section */}
        <div className="bg-[#121212] rounded-xl shadow-lg p-10 border border-red-700">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-red-600 tracking-wider uppercase font-sans-condensed">
              Account Settings
            </h1>
            <div className="scale-125">
              <UserButton />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <img
              src={user.imageUrl}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-2 border-red-600 shadow-lg"
            />

            <div>
              <p className="text-2xl font-semibold text-red-400">
                {user.fullName || "No Name Set"}
              </p>
              <p className="text-red-300">{user.primaryEmailAddress?.emailAddress}</p>
              <p className="text-sm text-red-600 mt-1 tracking-wide font-semibold">
                User since: {dayjs(user.createdAt).format("MMMM D, YYYY")}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/workspace")}
              className="border-red-600 text-red-600 hover:bg-red-700 hover:text-white transition"
            >
              🔙 Back to Workspace
            </Button>
            <Button
              variant="destructive"
              onClick={() => signOut()}
              className="sm:ml-auto bg-red-700 hover:bg-red-800 text-white shadow-lg"
            >
              🚪 Sign Out
            </Button>
          </div>
        </div>

        {/* Embedded Clerk Profile Editor (Styled) */}
        <div className="bg-[#121212] rounded-xl shadow-lg p-10 border border-red-700">
          <h2 className="text-2xl font-bold mb-4 text-red-600 tracking-wide uppercase font-sans-condensed">
            Manage Profile
          </h2>
          <p className="text-red-400 mb-6 font-semibold">
            You can update your name, email, and avatar here directly.
          </p>
          <div className="border border-red-700 rounded-lg p-6 shadow-inner bg-black/40">
            <UserProfile routing="hash" />
          </div>
        </div>
      </div>
    </div>
  );
}
