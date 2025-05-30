// app/api/create-video/route.js or route.jsx

import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { script, avatarId, voiceId, background, videoId } = await req.json();

  if (!script || !avatarId || !voiceId || !videoId) {
    return NextResponse.json(
      { error: 'Missing required parameters: script, avatarId, voiceId, videoId' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.post(
      'https://api.heygen.com/v2/video/generate',
      {
        video_inputs: [
          {
            character: {
              type: 'avatar',
              avatar_id: avatarId,
              avatar_style: 'normal',
            },
            voice: {
              type: 'text',
              input_text: script,
              voice_id: voiceId,
            },
          },
        ],
        dimension: { width: 1280, height: 720 },
      },
      {
        headers: {
          'X-Api-Key': process.env.HEYGEN_API_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({ videoId: response.data.data.video_id });
  } catch (err) {
    console.error('Error details:', err.response?.data || err.message);
    return NextResponse.json(
      { error: 'HeyGen video generation failed.', details: err.message },
      { status: 500 }
    );
  }
}
