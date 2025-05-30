"use client";



import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
} from 'remotion';

function PreviewAd4({ videoInfo }) {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const assets = videoInfo?.assets || [];
  const videoUrl = videoInfo?.videoUrl || '';

  const eachImageDuration = Math.floor(durationInFrames / (assets.length || 1));

  return (
    <div>
      <AbsoluteFill style={{ backgroundColor: 'black' }}>
        {/* Diagonal Split Section */}
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
          }}
        >
          {/* Image Section (Left Side) */}
          <div
            style={{
              width: '50%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              borderRight: '2px solid white',
            }}
          >
            {assets.map((image, index) => {
              const fromFrame = index * eachImageDuration;
              const visible = frame >= fromFrame && frame < fromFrame + eachImageDuration;
              const localFrame = frame - fromFrame;

              const scale = interpolate(localFrame, [0, eachImageDuration], [1.05, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });

              return visible ? (
                <Sequence key={index} from={fromFrame} durationInFrames={eachImageDuration}>
                  <img
                    src={image}
                    alt={`img-${index}`}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: `scale(${scale})`,
                    }}
                  />
                </Sequence>
              ) : null;
            })}
          </div>

          {/* Video Section (Right Side) */}
          <div
            style={{
              width: '50%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderLeft: '2px solid white',
            }}
          >
            {videoUrl ? (
              <OffthreadVideo
                src={videoUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.1) saturate(1.1)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#111',
                  color: 'white',
                  fontSize: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ⚠️ No video found!
              </div>
            )}
          </div>
        </div>
      </AbsoluteFill>
    </div>
  );
}

export default PreviewAd4;
