import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create new videoData record
export const CreateNewVideoData = mutation({
  args: {
    uid: v.id("users"),
    topic: v.string(),
    scriptVariant: v.any(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("videoData", {
      uid: args.uid,
      topic: args.topic,
      scriptVariant: args.scriptVariant,
    });

    return result; // Returns videoDataRecordId
  },
});

// Get video data by ID
export const GetVideoDataById = query({
  args: {
    vid: v.id("videoData"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.vid);
    return result;
  },
});

// Update existing videoData record
export const updateInitialVideoData = mutation({
  args: {
    videoDataRecordId: v.id("videoData"),
    topic: v.string(),
    scriptVariant: v.any(),
    script: v.optional(v.any()),
    assets: v.optional(v.any()),
    avatar: v.optional(v.any()),
    voice: v.optional(v.any()),
    videoId: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
   const result =  await ctx.db.patch(args.videoDataRecordId, {
      topic: args.topic,
      scriptVariant: args.scriptVariant,
      script: args.script,
      assets: args.assets,
      avatar: args.avatar,
      voice: args.voice,
      videoId: args.videoId,
      status: args.status,
    });

    return result;
  },
});
export const updateInitialVideoUrl = mutation({
  args: {
    videoDataRecordId: v.id("videoData"), 
    videoUrl: v.optional(v.string()),
    status:v.optional(v.string())
  },
  handler: async (ctx, args) => {
   const result =  await ctx.db.patch(args.videoDataRecordId, {
      
      videoUrl:args.videoUrl,
      status:args.status
    });

    return result;
  },
});



export const GetUsersVideo = query({
    args: {
      uid: v.id("users"),
    },
    handler: async (ctx, args) => {
      const result = await ctx.db.query('videoData')
      .filter(q=>q.eq(q.field('uid'),args.uid))
      .order('desc')
      .collect();
      return result;
    },
  });
