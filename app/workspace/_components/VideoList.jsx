"use client";

import { Button } from "@/components/ui/button";
import { userDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { LoaderCircle } from "lucide-react";
import moment from "moment/moment";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

function VideoList() {
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(false);  // <-- loading state added
  const { userDetail } = useContext(userDetailContext);
  const convex = useConvex();

  useEffect(() => {
    if (userDetail) {
      fetchUserVideoList();
    }
  }, [userDetail]);

  const fetchUserVideoList = async () => {
    setLoading(true);  // loading start
    try {
      const result = await convex.query(api.videoData.GetUsersVideo, {
        uid: userDetail?._id,
      });
      setVideoList(result);

      const pendingVideos = result?.filter((item) => item.status === "processing");
      pendingVideos?.forEach((video) => monitorPendingVideo(video));
    } catch (error) {
      console.error("Error fetching user video list:", error);
    } finally {
      setLoading(false);  // loading end
    }
  };

  const monitorPendingVideo = (pendingVideo) => {
    const intervalId = setInterval(async () => {
      try {
        const updatedVideo = await convex.query(api.videoData.GetVideoDataById, {
          vid: pendingVideo?._id,
        });
        if (updatedVideo?.status === "completed") {
          clearInterval(intervalId);
          fetchUserVideoList();
        }
      } catch (error) {
        console.error("Error checking video status:", error);
        clearInterval(intervalId);
      }
    }, 5000);
  };

  // Render loading spinner while fetching
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800">
        <LoaderCircle className="animate-spin w-16 h-16 text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 p-8">
      {videoList?.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16">
          <img
            src="/advertisement.png"
            alt="ads"
            width={220}
            height={220}
            className="drop-shadow-lg"
          />
          <h2 className="font-extrabold text-2xl text-red-600 mt-6 text-center tracking-wide uppercase drop-shadow-md">
            No Video Ads Yet
          </h2>
          <p className="text-gray-400 mt-2 max-w-md text-center">
            You don’t have any video ads created! Ignite your campaign now.
          </p>
          <Link href="/workspace/create-ad" passHref>
            <Button className="mt-8 bg-red-700 hover:bg-red-800 text-white px-8 py-3 font-semibold tracking-wide shadow-lg transition-transform transform hover:scale-105">
              + Create New Video Ad
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-10">
          {videoList?.map((video) => (
            <Link
              key={video._id}
              href={`/workspace/view-ads/${video._id}`}
              className="relative group block rounded-xl overflow-hidden shadow-2xl shadow-red-900 hover:shadow-red-600 transition-shadow duration-300 cursor-pointer"
              title={video.topic}
            >
              {video.status === "processing" ? (
                <div className="flex flex-col gap-4 items-center justify-center h-[450px] w-full bg-gradient-to-tr from-gray-700 via-black to-gray-900 rounded-xl text-red-500">
                  <LoaderCircle className="animate-spin w-10 h-10" />
                  <h2 className="text-xl font-bold tracking-widest uppercase">
                    Generating Video...
                  </h2>
                </div>
              ) : (
                <Image
                  src={video.assets?.[0] || "/default-video-thumbnail.jpg"}
                  alt={video.topic}
                  width={300}
                  height={450}
                  className="w-full h-[450px] object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 backdrop-blur-sm p-4 rounded-b-xl">
                <h2 className="text-white font-bold text-lg truncate">{video.topic}</h2>
                <p className="text-red-500 text-sm font-mono uppercase tracking-wide">
                  {moment(video._creationTime).fromNow()}
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-30 pointer-events-none rounded-xl" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default VideoList;
