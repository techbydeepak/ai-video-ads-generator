import React from "react";
import PreviewAd1 from "../app/workspace/view-ads/_components/PreviewAd1";
import PreviewAd2 from "../app/workspace/view-ads/_components/PreviewAd2";
import PreviewAd3 from "../app/workspace/view-ads/_components/PreviewAd3";
import PreviewAd4 from "../app/workspace/view-ads/_components/PreviewAd4";
import PreviewAd5 from "../app/workspace/view-ads/_components/PreviewAd5";
import PreviewAd6 from "../app/workspace/view-ads/_components/PreviewAd6";

const errorStyle = {
  backgroundColor: "red",
  color: "white",
  fontSize: 32,
  fontWeight: "bold",
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
};

export const MyComposition = ( {videoInfo} ) => {
   console.log("ALL PROPS:", videoInfo);
    //  const videoInfo = props.videoInfo || props;


  if (!videoInfo?.videoUrl) {
  return (
    <div style={errorStyle}>
      <div>
        <h1>Temporary Rendering Issue</h1>
        <p>Our rendering service is currently experiencing delays.</p>
        <p>Please try again later.</p>
      </div>
    </div>
  );
}


 

  const adNumber = videoInfo.adNumber || 1;

  switch (adNumber) {
    case 1:
      return <PreviewAd1 videoInfo={videoInfo} />;
    case 2:
      return <PreviewAd2 videoInfo={videoInfo} />;
    case 3:
      return <PreviewAd3 videoInfo={videoInfo} />;
    case 4:
      return <PreviewAd4 videoInfo={videoInfo} />;
    case 5:
      return <PreviewAd5 videoInfo={videoInfo} />;
    case 6:
      return <PreviewAd6 videoInfo={videoInfo} />;
    default:
      return <PreviewAd1 videoInfo={videoInfo} />;
  }
};