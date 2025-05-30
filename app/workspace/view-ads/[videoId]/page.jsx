"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import React, { useState } from "react";
import { Player } from "@remotion/player";
import PreviewAd1 from "../_components/PreviewAd1";
import PreviewAd2 from "../_components/PreviewAd2";
import PreviewAd3 from "../_components/PreviewAd3";
import PreviewAd4 from "../_components/PreviewAd4";
import PreviewAd5 from "../_components/PreviewAd5";
import PreviewAd6 from "../_components/PreviewAd6";
import { Button } from "@/components/ui/button";
// import { Id } from "convex/values";
const { Id } = require("convex/values")

function VideoCard({ PreviewAdComponent, videoInfo, onRender, isLoading }) {
  return (
    <div
      className="flex flex-col items-center bg-gradient-to-tr from-gray-900 via-black to-gray-900 rounded-xl border border-red-700 shadow-lg p-4"
      style={{ maxWidth: "28vw" }}
    >
      <Player
        component={PreviewAdComponent}
        durationInFrames={480}
        compositionWidth={720}
        compositionHeight={1280}
        fps={30}
        acknowledgeRemotionLicense
        controls
        style={{
          width: "25vw",
          height: "70vh",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(255, 50, 0, 0.8)",
        }}
        inputProps={{ videoInfo }}
      />
      <Button
        onClick={onRender}
        disabled={isLoading}
        className="w-full mt-4"
        style={{
          backgroundColor: "#b71c1c",
          color: "#fff",
          fontSize: "16px",
          padding: "12px",
          borderRadius: "8px",
          fontWeight: "700",
          letterSpacing: "1.1px",
          boxShadow: "0 4px 12px rgba(183, 28, 28, 0.75)",
          transition: "background-color 0.3s ease",
        }}
      >
        {isLoading ? "Rendering..." : "Render for Download"}
      </Button>
    </div>
  );
}

function ViewAds() {
  const { videoId } = useParams();
  const videoInfo = useQuery(api.videoData.GetVideoDataById, { vid: videoId });
 
  const [loadingStates, setLoadingStates] = useState(new Array(6).fill(false));
   if (!videoInfo) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
        <p className="mt-4 text-lg text-gray-400">Loading video data...</p>
      </div>
    );
  }

  const ads = [
    PreviewAd1,
    PreviewAd2,
    PreviewAd3,
    PreviewAd4,
    PreviewAd5,
    PreviewAd6,
  ];

  async function handleRender(index) {
    if (!videoId) return;

    // Set loading true for this index only
    setLoadingStates((prev) => {
      const newStates = [...prev];
      newStates[index] = true;
      return newStates;
    });

    try {
      const res = await fetch('/api/render', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          videoId,
          designNumber: index + 1 // +1 because designs are 1-based
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Rendering failed");
      }

      const { videoUrl } = await res.json();
      window.open(videoUrl, "_blank");
    } catch (err) {
      alert("Error rendering video: " + err.message);
    } finally {
      // Set loading false for this index only
      setLoadingStates((prev) => {
        const newStates = [...prev];
        newStates[index] = false;
        return newStates;
      });
    }
  }

  return (
    <div
      className="min-h-screen px-6 py-10 bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white"
      style={{ fontFamily: "'Orbitron', sans-serif" }}
    >
      <h2 className="text-3xl font-extrabold mb-1 text-red-600 tracking-wide drop-shadow-lg">
        Select the Best Video Ads Style
      </h2>
      <p className="text-gray-300 mb-8 max-w-xl">
        Explore and select the video style which matches your product
      </p>

      {/* First row - 3 videos */}
      <div className="flex justify-center gap-10 mb-10">
        {ads.slice(0, 3).map((PreviewAdComponent, idx) => (
          <VideoCard
            key={idx}
            PreviewAdComponent={PreviewAdComponent}
            videoInfo={videoInfo}
            onRender={() => handleRender(idx)}
            isLoading={loadingStates[idx]}
          />
        ))}
      </div>

      {/* Second row - 3 videos */}
      <div className="flex justify-center gap-10 mb-8">
        {ads.slice(3, 6).map((PreviewAdComponent, idx) => (
          <VideoCard
            key={idx + 3}
            PreviewAdComponent={PreviewAdComponent}
            videoInfo={videoInfo}
            onRender={() => handleRender(idx + 3)}
            isLoading={loadingStates[idx + 3]}
          />
        ))}
      </div>
    </div>
  );
}

export default ViewAds;