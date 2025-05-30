import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Video } from "lucide-react";
import React from "react";

function Script({ videoData, onHandleInputChange }) {
  if (!videoData) return <p className="text-red-500 text-center mt-10 font-semibold">No video data found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-red-700">
      <h2 className="flex items-center gap-3 text-2xl font-extrabold text-red-500 mb-4 select-none">
        <Video className="p-2 bg-red-700 text-white rounded-lg w-12 h-12 shadow-md" />
        Video Ads Script
      </h2>
      <hr className="border-red-600 mb-6" />

      <div className="mb-6">
        <label className="block text-red-400 font-semibold mb-2 tracking-wide">Video Project Topic</label>
        <Input
          value={videoData.topic || ""}
          readOnly
          className="bg-gray-900 border border-red-600 text-red-300 placeholder-red-600 focus:border-red-500 focus:ring-red-500 rounded-lg shadow-sm"
        />
      </div>

      <div className="mb-8">
        <label className="block text-red-400 font-semibold mb-3 tracking-wide">Video Script</label>
        <Textarea
          className="bg-gray-900 border border-red-600 text-red-300 placeholder-red-600 focus:border-red-500 focus:ring-red-500 rounded-lg shadow-inner text-lg font-medium resize-none min-h-[140px]"
          onChange={(e) => onHandleInputChange("script", e.target.value)}
          value={
            videoData?.script ??
            (Array.isArray(videoData?.scriptVariant) && videoData?.scriptVariant.length > 0
              ? videoData.scriptVariant[0].content
              : "")
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {videoData?.scriptVariant?.map((script, index) => (
          <div
            key={index}
            onClick={() => onHandleInputChange("script", script?.content)}
            className={`cursor-pointer p-6 rounded-lg border-2 transition-transform duration-300
              ${
                script?.content === videoData?.script
                  ? "border-red-500 bg-gradient-to-tr from-red-900 to-red-700 text-white shadow-lg scale-105"
                  : "border-gray-700 bg-gray-800 text-red-300 hover:border-red-500 hover:bg-red-900 hover:text-white"
              }`}
          >
            <h2 className="line-clamp-4 text-md font-semibold leading-snug">{script?.content}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Script;
