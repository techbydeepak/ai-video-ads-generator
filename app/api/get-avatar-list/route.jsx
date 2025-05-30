import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Token:", process.env.HEYGEN_API_TOKEN);  // ✅ Debug log

    const result = await axios.get('https://api.heygen.com/v2/avatars', {
      headers: {
        "X-Api-Key": process.env.HEYGEN_API_TOKEN,
      }
    });

    return NextResponse.json(result?.data?.data);
  } catch (error) {
    console.error("Error fetching avatars:", error?.response?.data || error.message);
    return NextResponse.json({ error: "Failed to fetch avatars" }, { status: 500 });
  }
}
