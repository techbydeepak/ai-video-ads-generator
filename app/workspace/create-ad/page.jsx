"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderCircle, Sparkles } from 'lucide-react';
import React, { useContext, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useMutation } from 'convex/react';
import { userDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function CreateAd() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { userDetail } = useContext(userDetailContext);
  const router = useRouter();

  const CreateNewVideoData = useMutation(api.videoData.CreateNewVideoData);

  const GenerateAiVideoScript = async () => {
    if(userDetail?.credits < 10){
      toast('Please add more credits!');
      return;
    }

    if (!userInput.trim()) {
      alert("⚠️ Please enter a topic before generating.");
      return;
    }

    if (!userDetail?._id) {
      alert("⚠️ User not logged in. Please login first.");
      return;
    }

    setLoading(true);

    try {
      const result = await axios.post('/api/generate-script', { topic: userInput });
      const match = result?.data.match(/\[\s*{[\s\S]*?}\s*\]/);
      if (!match) {
        alert("❌ Error: JSON block not found in AI response.");
        return;
      }
      const JSONResult = JSON.parse(match[0]);
      const resp = await CreateNewVideoData({
        uid: userDetail._id,
        topic: userInput,
        scriptVariant: JSONResult,
      });
      router.push('/workspace/create-ad/' + resp);
    } catch (error) {
      console.error("❌ Error during generation:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-[#1F1F1F] rounded-2xl shadow-2xl p-12 border-4 border-[#C41E3A]">
        <div className="flex justify-center mb-8">
          <Image src={'/advertisement.png'} alt="Ad Icon" width={220} height={220} className="drop-shadow-xl" />
        </div>

        <h2 className="text-center text-4xl font-extrabold text-[#FF6F00] drop-shadow-lg mb-4 tracking-wide">
          🎥 Create AI Video Ads in Just One Click!
        </h2>

        <p className="text-center text-gray-300 text-lg mb-10 font-semibold max-w-xl mx-auto">
          🚀 Turn your ideas into <span className="text-[#C41E3A]">stunning, scroll-stopping</span> videos — instantly, effortlessly, and without editing skills!
        </p>

        <Input
          placeholder="Enter the topic or product info"
          className="w-full text-lg rounded-md bg-[#2A2A2A] border border-[#C41E3A] focus:border-[#FF6F00] text-white placeholder-gray-400 py-4 px-6"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />

        <Button
          className="mt-8 w-full bg-[#C41E3A] hover:bg-[#FF6F00] text-white font-bold text-xl rounded-md shadow-lg transition-colors flex items-center justify-center gap-3 py-4"
          onClick={GenerateAiVideoScript}
          disabled={loading}
        >
          {loading ? <LoaderCircle className="animate-spin" size={24} /> : <Sparkles size={24} />}
          Generate
        </Button>
      </div>
    </div>
  );
}

export default CreateAd;
