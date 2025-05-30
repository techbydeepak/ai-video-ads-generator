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

function PreviewAd3({ videoInfo }) {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const assets = videoInfo?.assets || [];
  const videoUrl = videoInfo?.videoUrl || '';
  const eachImageDuration = Math.floor(durationInFrames / (assets.length || 1));

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Background image slideshow */}
      {assets.map((img, index) => {
        const fromFrame = index * eachImageDuration;
        const visible = frame >= fromFrame && frame < fromFrame + eachImageDuration;
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
              }}
            />
          </Sequence>
        ) : null;
      })}

      {/* Small video at bottom center */}
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
        }}
      >
        {videoUrl ? (
          <OffthreadVideo
            src={videoUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
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

export default PreviewAd3;