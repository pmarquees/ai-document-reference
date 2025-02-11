export async function GET() {
  return Response.json({ 
    hasKey: !!process.env.OPENAI_API_KEY,
    keyPreview: process.env.OPENAI_API_KEY?.slice(0, 7)
  });
} 