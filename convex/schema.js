import {defineSchema, defineTable} from "convex/server"
import {v} from "convex/values"


export default defineSchema({

    users:defineTable({
        name:v.string(),
        email:v.string(),
        picture:v.string(),
        credits:v.number(),
        paymentId:v.optional(v.string())
    }),

    videoData:defineTable({
        topic:v.string(),
        scriptVariant:v.any(),
        script:v.optional(v.any()),
        assets:v.optional(v.any()),
        avatar:v.optional(v.any()),
        voice:v.optional(v.any()),
        uid:v.id('users'),
        voiceUrl:v.optional(v.any()),
        avatarUrl:v.optional(v.any()),
        videoUrl:v.optional(v.any()),
        videoId:v.optional(v.any()),
        status:v.optional(v.any())  // 1 pending 2 completed 3 processing 4 ready to download 
    })
})