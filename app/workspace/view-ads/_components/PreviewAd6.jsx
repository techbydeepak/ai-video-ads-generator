"use client";


// PreviewAd6.jsx
import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
} from 'remotion';

function PreviewAd6({ videoInfo }) {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const assets = videoInfo?.assets || [];
  const videoUrl = videoInfo?.videoUrl || '';
  const eachImageDuration = Math.floor(durationInFrames / (assets.length || 1));

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Background image slideshow with pan and fade effect */}
      {assets.map((img, index) => {
        const fromFrame = index * eachImageDuration;
        const visible = frame >= fromFrame && frame < fromFrame + eachImageDuration;

        // Pan effect from left to right
        const translateX = interpolate(frame - fromFrame, [0, eachImageDuration], [-10, 10], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        // Smooth fade-in
        const opacity = interpolate(frame - fromFrame, [0, 10], [0, 1], {
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
                transform: `translateX(${translateX}px)`,
              }}
            />
          </Sequence>
        ) : null;
      })}

      {/* Video at top-right with border and slight rotation effect */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          width: '220px',
          height: '320px',
          border: '2px solid white',
          overflow: 'hidden',
          borderRadius: '12px',
          boxShadow: '0px 8px 18px rgba(0, 0, 0, 0.5)',
          transform: 'rotate(1deg)', // Slight rotation for visual difference
        }}
      >
        {videoUrl ? (
          <OffthreadVideo
            src={videoUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scale(1.02)',
              transition: 'transform 0.5s ease',
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

export default PreviewAd6;
