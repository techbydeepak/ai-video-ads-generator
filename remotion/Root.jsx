import React from "react";

import { Composition } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionRoot = () => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((designId) => (
        <Composition
          key={`Design${designId}`}
          id={`Design${designId}`}
          component={MyComposition}
          durationInFrames={480}
          fps={30}
          width={720}
          height={1280}
          defaultProps={{
            videoInfo: {
              videoUrl: " https://www.w3schools.com/html/mov_bbb.mp4",
              assets: [],
              adNumber: designId,
            },
          }}
        />
      ))}
    </>
  );
};
