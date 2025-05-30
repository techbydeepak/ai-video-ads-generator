"use client"

// PreviewAd2.jsx
import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
} from 'remotion';

function PreviewAd2({ videoInfo }) {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const assets = videoInfo?.assets || [];
  const videoUrl = videoInfo?.videoUrl || '';

  const videoDuration = Math.floor(durationInFrames * 0.4);
  const imageStartFrame = videoDuration;
  const eachImageDuration = Math.floor((durationInFrames - videoDuration) / (assets.length || 1));

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      
      {/* Always render video, but fade it out after imageStartFrame */}
      {videoUrl && (
        <OffthreadVideo
          src={videoUrl}
          muted={false}
          volume={1}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            opacity: frame < imageStartFrame
              ? 1
              : interpolate(frame, [imageStartFrame, imageStartFrame + 10], [1, 0], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
            zIndex: 0,
          }}
        />
      )}

      {/* Then show assets above video */}
      {frame >= imageStartFrame && (
        <>
          {assets.map((img, index) => {
            const fromFrame = imageStartFrame + index * eachImageDuration;
            const visible = frame >= fromFrame && frame < fromFrame + eachImageDuration;
            const localFrame = frame - fromFrame;

            const opacity = interpolate(localFrame, [0, 15], [0, 1], {
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
                    zIndex: 1,
                  }}
                />
              </Sequence>
            ) : null;
          })}
        </>
      )}
    </AbsoluteFill>
  );
}

export default PreviewAd2;
