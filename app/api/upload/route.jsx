// app/api/upload/route.js
import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_KEY,
  privateKey: process.env.NEXT_PRIVATE_IMAGEKIT_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL,
});

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");

  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  try {
    const result = await imagekit.upload({
      file: `data:${file.type};base64,${base64}`,
      fileName: `${Date.now()}.png`,
    });

    return NextResponse.json({ url: result.url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
