import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateRequest {
  prompt: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest
    const { prompt } = body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const text = completion.choices[0]?.message?.content || '';
    return Response.json({ text });

  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      })
    }
    return new Response(JSON.stringify({ error: 'An unknown error occurred' }), {
      status: 500,
    })
  }
} 