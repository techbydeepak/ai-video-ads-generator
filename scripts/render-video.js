const { bundle } = require("@remotion/bundler");
const { getCompositions, renderMedia } = require("@remotion/renderer");
const path = require("path");
const { ConvexHttpClient } = require("convex/browser");
require("dotenv").config({ path: ".env.local" });
const fs = require("fs");

async function renderVideo(videoId, designNumber) {
  try {
    // Step 1: Initialize Convex
    const CONVEX_URL =
      process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_SITE_URL;
    if (!CONVEX_URL) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined");
    }
    const convex = new ConvexHttpClient(CONVEX_URL);

    // Step 2: Fetch Video Data
    console.log(`📦 Fetching video data for ID: ${videoId}`);
    const videoData = await convex.query("videoData:GetVideoDataById", {
      vid: videoId,
    });

    if (!videoData) {
      throw new Error("Video data not found in database");
    }

    // Step 3: Validate Video Data
    console.log("🔍 Validating video data...");
    if (!Array.isArray(videoData.assets)) {
      console.warn("⚠️ 'assets' is not an array. Defaulting to empty array.");
      videoData.assets = [];
    }

    if (!videoData.videoUrl) {
      throw new Error("Missing videoUrl in video data");
    }

    // Step 5: Bundle the Remotion Project
    console.log("📦 Bundling Remotion project...");
    const bundleLocation = await bundle(
      path.join(process.cwd(), "remotion/index.js"),
      () => {},
      { enableCaching: true }
    );

    // Step 6: Get Composition
    console.log("🔎 Finding composition...");
    const compositions = await getCompositions(bundleLocation);
    const compositionId = `Design${designNumber}`;
    const composition = compositions.find((c) => c.id === compositionId);

    if (!composition) {
      const available = compositions.map((c) => c.id).join(", ");
      throw new Error(
        `Composition "${compositionId}" not found. Available: ${available}`
      );
    }

    // Step 7: Prepare Output Directory
    const rendersDir = path.join(process.cwd(), "/tmp", "renders");
    if (!fs.existsSync(rendersDir)) {
      fs.mkdirSync(rendersDir, { recursive: true });
    }
    const outputPath = path.join(rendersDir, `${videoId}_${designNumber}.mp4`);

    // Step 8: Render the Video
    const videoInfo = {
      videoUrl: videoData.videoUrl,
      assets: videoData.assets,
      adNumber: designNumber,
    };

    console.log("🎬 Starting video render with props:", videoInfo);

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: { videoInfo },
      enforceAudioTrack: true,
      muted: false,
      everyNthFrame: 1,
      concurrency: 4,
      timeoutInMilliseconds: 30000,
    });

    console.log("✅ Render completed successfully");
    return `/renders/${videoId}_${designNumber}.mp4`;
  } catch (error) {
    console.error("❌ RENDER_ERROR:", error.message);
    console.error(error.stack);
    throw error;
  }
}

// CLI Execution Support
if (require.main === module) {
  const [videoId, designNumber] = process.argv.slice(2);
  if (!videoId || !designNumber) {
    console.error("Usage: node script.js <videoId> <designNumber>");
    process.exit(1);
  }

  renderVideo(videoId, parseInt(designNumber, 10))
    .then((url) => console.log("🎉 RENDER_SUCCESS:" + url))
    .catch((err) => {
      console.error("💥 RENDER_FAILED:", err.message);
      process.exit(1);
    });
}

module.exports = renderVideo;
