"use client";

import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    setFadeIn(true);
  }, []);

  if (!isSignedIn) {
    return (
      <div className="relative min-h-screen bg-gradient-to-tr from-black via-gray-900 to-red-900 text-white overflow-hidden font-sans">
        <AnimatedBackground />

        <header
          className={`max-w-6xl mx-auto px-8 pt-32 text-center transition-opacity duration-1000 ${
            fadeIn ? "opacity-100" : "opacity-0"
          }`}
        >
          <h1 className="text-7xl font-black drop-shadow-xl mb-6 tracking-wider text-red-600 uppercase">
            AI Video Ad Generator
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-12 text-gray-300">
            Dominate the screen. Generate sleek, AI-powered video ads in minutes.
          </p>

          <div className="flex justify-center gap-8">
            <Link href="/sign-in" passHref>
              <Button className="px-12 py-4 text-xl font-bold rounded-full bg-red-700 hover:bg-red-800 shadow-xl hover:scale-105 transition">
                Sign In
              </Button>
            </Link>
          </div>
        </header>

        <section className="bg-black rounded-t-3xl pt-20 pb-32 px-8 text-center max-w-7xl mx-auto text-gray-200">
          <h2 className="text-4xl font-bold mb-14 text-red-500">Why You'll Love It</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 max-w-5xl mx-auto">
            <FeatureCard
              icon="🚀"
              title="Fast & Easy"
              description="Generate professional video ads without any prior editing skills."
            />
            <FeatureCard
              icon="🤖"
              title="AI-Powered"
              description="Advanced AI algorithms tailor your ads for maximum impact."
            />
            <FeatureCard
              icon="📈"
              title="Boost Conversions"
              description="Create videos designed to grab attention and convert viewers."
            />
          </div>
        </section>

        <section className="bg-gray-950 py-20 px-8 text-center max-w-7xl mx-auto text-gray-100">
          <h3 className="text-3xl font-semibold mb-12 text-red-400">What Our Users Say</h3>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            <Testimonial
              quote="This AI video tool transformed my marketing strategy overnight!"
              author="Sarah K., Digital Marketer"
            />
            <Testimonial
              quote="Easy to use and the results are incredible — highly recommended."
              author="James P., Startup Founder"
            />
            <Testimonial
              quote="Finally, video ads that actually convert without wasting hours editing."
              author="Maya L., E-commerce Owner"
            />
          </div>
        </section>

        <footer className="bg-black text-gray-400 text-center py-8 mt-20">
          &copy; {new Date().getFullYear()} AI Video Ad Generator. All rights reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-gray-950 px-8 py-16 text-white">
      <header className="flex items-center justify-between max-w-5xl mx-auto mb-20">
        <h1 className="text-4xl font-bold text-red-500">
          Welcome, {user.firstName || user.email} 👋
        </h1>
        <UserButton />
      </header>

      <main className="flex-grow flex flex-col items-center justify-center max-w-4xl mx-auto space-y-16">
        <p className="text-xl text-gray-300 text-center max-w-xl">
          Ready to create your first AI-powered video ad? Your workspace is waiting.
        </p>

        <Button
          onClick={() => router.push("/workspace")}
          className="px-20 py-6 text-3xl font-bold rounded-full bg-red-700 text-white hover:bg-red-800 shadow-2xl hover:scale-105 transition"
        >
          Go to Workspace
        </Button>

        <section className="bg-gray-900 rounded-xl shadow-lg p-10 w-full max-w-3xl">
          <h2 className="text-2xl font-semibold mb-6 text-red-400">
            Quick Tips & Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-3 text-lg">
            <li>Create video ads tailored to your brand style in seconds.</li>
            <li>Use customizable templates and AI suggestions.</li>
            <li>Track your video performance with built-in analytics.</li>
          </ul>
        </section>
      </main>

      <footer className="text-center text-gray-500 mt-20 mb-10">
        &copy; {new Date().getFullYear()} AI Video Ad Generator. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg transform hover:scale-105 transition cursor-pointer border border-gray-700">
      <div className="text-6xl mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 text-red-500">{title}</h3>
      <p className="text-gray-300 text-lg">{description}</p>
    </div>
  );
}

function Testimonial({ quote, author }) {
  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-left border border-gray-700">
      <p className="italic text-lg mb-6 text-gray-200">"{quote}"</p>
      <p className="font-semibold text-red-400">- {author}</p>
    </div>
  );
}

function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setMounted(true);
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  if (!mounted) return null;

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full -z-10"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {[...Array(30)].map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * dimensions.width}
          cy={Math.random() * dimensions.height}
          r={3 + Math.random() * 5}
          fill="rgba(255,255,255,0.05)"
          className="animate-float"
          style={{
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${5 + Math.random() * 5}s`,
          }}
        />
      ))}
      <style jsx>{`
        .animate-float {
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </svg>
  );
}
