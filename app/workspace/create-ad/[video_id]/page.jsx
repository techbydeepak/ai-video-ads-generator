"use client";
import { api } from "@/convex/_generated/api";
import { useConvex, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef, useContext } from "react";
import Script from "./_components/Script";
import UploadFiles from "./_components/UploadFiles";
import AvatarList from "./_components/AvatarList";
import VoiceList from "./_components/VoiceList";
import { Button } from "@/components/ui/button";
import { Sparkle } from "lucide-react";
import axios from "axios";
import { userDetailContext } from "@/context/UserDetailContext";

// Import toast from react-hot-toast
import toast, { Toaster } from "react-hot-toast";

function CreateVideo() {
  const { video_id } = useParams();
  const [videoData, setVideoData] = useState();
  const [isGenerateButtonClick, setIsGenerateButtonClick] = useState(false);
  const [videoStatus, setVideoStatus] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const pollingIntervalRef = useRef(null);
  const createVideoDataEntry = useMutation(
    api.videoData.updateInitialVideoData
  );
  const updateVideoUrl = useMutation(api.videoData.updateInitialVideoUrl);
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(userDetailContext);
  const UpdateUserCredits = useMutation(api.users.updateUserCredits);

  const convex = useConvex();

  useEffect(() => {
    if (video_id) {
      GetVideoData();
    }
  }, [video_id]);

  const GetVideoData = async () => {
    const result = await convex.query(api.videoData.GetVideoDataById, {
      vid: video_id,
    });
    setVideoData(result);
  };

  const onHandleInputChange = async (field, value) => {
    console.log(field, value);
    setVideoData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const GenerateVideo = async () => {
    if (!videoData) {
      console.error("Video data is not loaded.");
      return;
    }

    setIsGenerateButtonClick(true);
    let generatedVideoId = null;

    try {
      const { script, avatar, voice, rawFiles } = videoData;

      if (!script || script.trim() === "") {
        toast.error("Please enter a script.", {
          duration: 4000,
          position: "top-center",
        });
        setIsGenerateButtonClick(false);
        return;
      }

      if (!avatar?.avatar_id) {
        toast.error("Please select an avatar.", {
          duration: 4000,
          position: "top-center",
        });
        setIsGenerateButtonClick(false);
        return;
      }

      if (!voice?.voice_id) {
        toast.error("Please select a voice.", {
          duration: 4000,
          position: "top-center",
        });
        setIsGenerateButtonClick(false);
        return;
      }

      if (!Array.isArray(rawFiles) || rawFiles.length === 0) {
        toast.error("Please upload at least one image or video.", {
          duration: 4000,
          position: "top-center",
        });
        setIsGenerateButtonClick(false);
        return;
      }

      const uploadedImage = [];
      for (const file of rawFiles) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        uploadedImage.push(data.url);
      }

      await onHandleInputChange("assets", uploadedImage);

      const result = await axios.post("/api/create-video", {
        script,
        avatarId: avatar.avatar_id,
        voiceId: voice.voice_id,
        videoId: video_id,
      });

      generatedVideoId = result.data.videoId;
      // Save to localStorage for persistence
// localStorage.setItem('videoGenerationData', JSON.stringify({
//   generatedVideoId,
//   videoDataRecordId: video_id,
//   timestamp: Date.now(),
//   status: "processing"
// }));
      console.log("Generated Video ID:", generatedVideoId);
      toast.success("Video generation request sent successfully.", {
        duration: 4000,
        position: "top-center",
      });

      const results = await createVideoDataEntry({
        videoDataRecordId: video_id,
        topic: videoData?.topic,
        scriptVariant: videoData?.scriptVariant,
        script: videoData?.script,
        assets: uploadedImage,
        avatar: videoData?.avatar,
        voice: videoData?.voice,
        videoId: generatedVideoId,
        status: "processing",
      });
      console.log(results);

      // Update Credits

      setUserDetail((prev) => ({
        ...prev,
        credits: Number(userDetail?.credits) - 10,
      }));

      // Update Credits to DB
      const resp = await UpdateUserCredits({
        credits: Number(userDetail?.credits) - 10,
        uid: userDetail?._id,
      });
      console.log(resp);
    } catch (error) {
      console.error("Error generating video:", error);
      toast.error("Something went wrong during video generation.", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsGenerateButtonClick(false);
      console.log("Redirecting to workspace with video ID:", generatedVideoId);
      if (generatedVideoId) {
        router.replace(
          `/workspace?generatedVideoId=${generatedVideoId}&videoDataRecordId=${video_id}`
        ); // ✅ Pass both IDs
      }
    }
  };

  return (
    <>
      {/* Toaster container */}
      <Toaster
        position="top-center"
        toastOptions={{
          // Default options for all toasts
          duration: 4000,
          style: {
            background: "#1a1a1a",
            color: "#f87171", // red-400 color
            fontWeight: "600",
            fontSize: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          },
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#0d0d0d] to-[#000000] p-6 md:p-12 font-sans text-gray-200 select-none">
        <h2 className="text-4xl font-extrabold tracking-wide text-red-600 drop-shadow-lg mb-10 text-center md:text-left">
          Create Video Ad
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 flex flex-col gap-8 bg-[#111111] rounded-2xl p-8 shadow-lg border border-red-700/40">
            <Script
              videoData={videoData}
              onHandleInputChange={onHandleInputChange}
            />
            <UploadFiles
              videoData={videoData}
              onHandleInputChange={onHandleInputChange}
            />
            <AvatarList
              videoData={videoData}
              onHandleInputChange={onHandleInputChange}
            />
            <VoiceList
              videoData={videoData}
              onHandleInputChange={onHandleInputChange}
            />

            <Button
              className="mt-10 w-full bg-gradient-to-r from-red-700 via-red-900 to-black border-red-800 hover:from-red-800 hover:via-red-950 hover:to-black text-white text-lg font-semibold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-3 py-4 rounded-xl"
              onClick={GenerateVideo}
              disabled={isGenerateButtonClick}
            >
              {isGenerateButtonClick ? (
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="animate-spin h-6 w-6 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                <>
                  <Sparkle className="text-yellow-400" /> Generate
                </>
              )}
            </Button>
          </div>
          {/* Status Panel - Disabled for now */}{" "}
          {/* <div className="mt-8 p-6 rounded-2xl bg-[#111111] border border-red-700/40 shadow-lg text-center"> <h3 className="text-2xl font-semibold mb-4 text-red-600">Video Status</h3> <div className="flex items-center justify-center gap-4 text-lg font-medium"> {videoStatus === "processing" && ( <> <div className="animate-spin h-6 w-6 border-4 border-red-600 border-t-transparent rounded-full"></div> <span className="text-red-500">Processing...</span> </> )} {videoStatus === "completed" && ( <> <span className="text-green-500 text-3xl">✔️</span> <span className="text-green-400">Completed</span> </> )} {videoStatus === "failed" && ( <> <span className="text-red-700 text-3xl">❌</span> <span className="text-red-600">Failed</span> </> )} {!["processing", "completed", "failed"].includes(videoStatus) && videoStatus && ( <span className="text-gray-400">{videoStatus}</span> )} </div> {videoStatus === "completed" && videoInfo?.video_url && ( <div className="mt-6"> <p className="text-sm text-gray-400">Video URL:</p> <a href={videoInfo.video_url} target="_blank" rel="noopener noreferrer" className="text-red-500 underline font-semibold" > Watch Video </a> </div> )} </div> */}
        </div>
      </div>
    </>
  );
}

export default CreateVideo;
