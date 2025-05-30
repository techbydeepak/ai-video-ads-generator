import { exec } from 'child_process';
import path from 'path';

export const dynamic = "force-dynamic";

export async function POST(request) {
  const { videoId, designNumber } = await request.json();
  console.log("🚀 Starting render for:", { videoId, designNumber });

  const scriptPath = path.join(process.cwd(), 'scripts/render-video.js');
  const command = `node ${scriptPath} ${videoId} ${designNumber}`;

  // Enhanced environment variables
  const env = {
    ...process.env,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    PATH: process.env.PATH,
    NODE_OPTIONS: '--max-old-space-size=4096' // Add memory limit
  };

  // Execution options
  const options = {
    env,
    cwd: process.cwd(),
    timeout: 1000 * 60 * 5, // 5 minutes timeout
    maxBuffer: 1024 * 1024 * 10 // 10MB output buffer
  };

  return new Promise((resolve, reject) => {
    const child = exec(command, options, (error, stdout, stderr) => {
      // Improved logging
      console.log('📜 Script stdout:', stdout);
      if (stderr) console.error('❌ Script stderr:', stderr);
      if (error) console.error('💥 Execution error:', error);

      // Success case
      const successMatch = stdout.match(/RENDER_SUCCESS:(.*)/);
      if (successMatch) {
        console.log('✅ Render succeeded:', successMatch[1].trim());
        return resolve(Response.json({
          success: true,
          videoUrl: successMatch[1].trim()
        }));
      }

      // Error cases
      const errorMatch = stdout.match(/RENDER_ERROR:(.*)/) || 
                       stderr.match(/Error:(.*)/) || 
                       [null, error?.message || 'Unknown error'];
      
      console.error('🔴 Render failed:', errorMatch[1].trim());
      return reject(Response.json(
        {
          success: false,
          error: errorMatch[1].trim(),
          logs: stdout // Include full logs for debugging
        },
        { status: 500 }
      ));
    });

    // Real-time logging
    child.stdout.on('data', (data) => {
      console.log(`[child stdout]: ${data}`);
    });
    
    child.stderr.on('data', (data) => {
      console.error(`[child stderr]: ${data}`);
    });
  });
}