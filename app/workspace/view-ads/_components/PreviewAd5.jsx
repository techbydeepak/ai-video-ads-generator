
"use client";


// PreviewAd3.jsx
import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
} from 'remotion';

function PreviewAd5({ videoInfo }) {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const assets = videoInfo?.assets || [];
  const videoUrl = videoInfo?.videoUrl || '';
  const eachImageDuration = Math.floor(durationInFrames / (assets.length || 1));

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Background image slideshow with parallax and zoom effect */}
      {assets.map((img, index) => {
        const fromFrame = index * eachImageDuration;
        const visible = frame >= fromFrame && frame < fromFrame + eachImageDuration;

        // Parallax effect for movement
        const translateY = interpolate(frame - fromFrame, [0, eachImageDuration], [0, 20], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        // Zoom-in effect with opacity
        const scale = interpolate(frame - fromFrame, [0, 15], [1, 1.05], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const opacity = interpolate(frame - fromFrame, [0, 15], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return visible ? (
          <Sequence key={index} from={fromFrame} durationInFrames={eachImageDuration}>
            <img
              src={img}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity,
                transform: `scale(${scale}) translateY(${translateY}px)`,
              }}
            />
          </Sequence>
        ) : null;
      })}

      {/* Small video at bottom center with zoom-in effect */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '350px',
          border: '2px solid white',
          overflow: 'hidden',
          borderRadius: '10px',
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)', // Added shadow for 3D effect
        }}
      >
        {videoUrl ? (
          <OffthreadVideo
            src={videoUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scale(1.05)', // Slight zoom-in effect for the video
              transition: 'transform 0.5s ease', // Smooth transition for zoom
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#333',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            No Video
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

export default PreviewAd5;
