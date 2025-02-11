import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const text = completion.choices[0]?.message?.content || '';
    return Response.json({ text });

  } catch (error: any) {
    console.error('OpenAI API error:', error.message);
    return Response.json(
      { error: error.message || 'Failed to generate text' },
      { status: error.status || 500 }
    );
  }
} 