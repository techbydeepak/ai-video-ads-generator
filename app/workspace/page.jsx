'use client';

import React, { useEffect, useRef, useState } from 'react';
import VideoList from './_components/VideoList';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

function Workspace() {
  const searchParams = useSearchParams();
  const generatedVideoId = searchParams.get('generatedVideoId');
  const videoDataRecordId = searchParams.get('videoDataRecordId');

  const updateVideoUrl = useMutation(api.videoData.updateInitialVideoUrl);

  const [videoStatus, setVideoStatus] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const pollingIntervalRef = useRef(null);

  // 🛑 Block Navigation when video is processing
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (videoStatus === 'processing') {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [videoStatus]);

  useEffect(() => {
    if (generatedVideoId) {
      startPolling(generatedVideoId);
    }
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [generatedVideoId]);

  const checkVideoStatus = async (genId) => {
    try {
      const response = await axios.get(`/api/video-status?videoId=${genId}`);
      const status = response.data.status;
      const videoData = response.data.data;

      if (status !== videoStatus) {
        setVideoStatus(status);
        setVideoInfo(videoData);
      }

      if (status === 'completed' || status === 'failed') {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        if (status === 'completed' && videoDataRecordId && videoData?.video_url) {
          await updateVideoUrl({
            videoDataRecordId,
            videoUrl: videoData.video_url,
            status,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startPolling = (genId) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    pollingIntervalRef.current = setInterval(() => {
      checkVideoStatus(genId);
    }, 5000);
  };

  return (
    <>
      <div className='mt-7 px-6 w-full max-w-full'>
        <h2 className='font-extrabold text-3xl text-red-600 tracking-wider mb-1 drop-shadow-lg'>
          Explore and Create New Video Ads
        </h2>
        <p className='text-gray-800 text-base mb-8 max-w-4xl'>
          Start exploring new video and create one for you
        </p>
      </div>

      <div className="mt-8 p-8 rounded-xl bg-gradient-to-br from-black via-gray-900 to-gray-800 w-full max-w-full border-2 border-red-700 shadow-lg shadow-red-900/70">
        <h3 className="text-xl font-semibold mb-4 text-red-500 tracking-wide border-b border-red-600 pb-2">
          Video Status
        </h3>
        <div className="flex items-center gap-4 flex-wrap">
          {videoStatus === "processing" && (
            <>
              <div
                className="animate-spin h-6 w-6 border-4 border-red-600 border-t-transparent rounded-full"
                style={{ boxShadow: '0 0 10px #ff3b3b' }}
              ></div>
              <span className="text-red-500 font-semibold">Processing...</span>
            </>
          )}
          {videoStatus === "completed" && (
            <>
              <span className="text-green-500 text-2xl drop-shadow-lg">✔️</span>
              <span className="text-green-400 font-semibold">Completed</span>
            </>
          )}
          {videoStatus === "failed" && (
            <>
              <span className="text-red-700 text-2xl drop-shadow-lg">❌</span>
              <span className="text-red-600 font-semibold">Failed</span>
            </>
          )}
          {!["processing", "completed", "failed"].includes(videoStatus) && videoStatus && (
            <span className="text-gray-400">{videoStatus}</span>
          )}
        </div>

        {videoStatus === "completed" && videoInfo?.video_url && (
          <div className="mt-6">
            <p className="text-sm text-gray-400 mb-1">Video URL:</p>
            <a
              href={videoInfo.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 underline hover:text-red-700 transition"
            >
              Watch Video
            </a>
          </div>
        )}

        <div className="mt-8">
          <VideoList />
        </div>
      </div>
    </>
  );
}

export default Workspace;
