// app/api/video-status/route.js
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json({ error: "Missing videoId parameter." }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`,
      {
        headers: {
          "X-Api-Key": process.env.HEYGEN_API_TOKEN,
        },
      }
    );

    const videoStatus = response.data?.data?.status || "processing";

    return NextResponse.json({
      status: videoStatus,
      data: response.data.data,
    });
  } catch (error) {
    console.error("Error fetching video status:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch video status." },
      { status: 500 }
    );
  }
}
