"use client"

import { Button } from '@/components/ui/button';
import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
} from 'remotion';

function PreviewAd1({ videoInfo }) {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const assets = videoInfo?.assets || [];
  const videoUrl = videoInfo?.videoUrl || '';

  const eachImageDuration = Math.floor(durationInFrames / (assets.length || 1));

  return (
    <div>
      <AbsoluteFill style={{ backgroundColor: 'black', flexDirection: 'column' }}>
        {/* Image Section - Top Half */}
        <div
          style={{
            height: '50%',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderBottom: '2px solid white',
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
                    transition: 'none',
                  }}
                />
              </Sequence>
            ) : null;
          })}
        </div>

        {/* Video Section - Bottom Half */}
        <div
          style={{
            height: '50%',
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
            borderTop: '2px solid white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {videoUrl ? (
            <OffthreadVideo
              src={videoUrl}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'none',
                transition: 'none',
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
      </AbsoluteFill>
    </div>
  );
}

export default PreviewAd1;
