import { NextRequest, NextResponse } from 'next/server';
import { interpretPrompt, enhancePrompt } from '@/lib/musicTheory/engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, overrides } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Check if OpenAI API key is provided for deep LLM reasoning
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an elite music theorist, audio engineer, and composer for SONORA AI.
Translate the user's natural language music prompt into a validated JSON music specification strictly conforming to:
{
  "genre": string,
  "subgenre": string,
  "mood": string[],
  "bpm": number (40-240),
  "key": string (e.g. "A minor", "C Major"),
  "time_signature": "4/4" | "3/4" | "6/8" | "2/4" | "5/4" | "7/8",
  "instruments": string[],
  "chord_progression": string[],
  "melodic_style": string,
  "rhythm_style": string,
  "song_structure": [{"name": string, "bars": number, "description": string, "intensity": number}],
  "dynamics": string[],
  "production_effects": string[],
  "vocal_style": string,
  "duration": string,
  "generation_instructions": string
}
Return only valid JSON without markdown fences.`,
              },
              { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const spec = JSON.parse(data.choices[0].message.content);
          return NextResponse.json({
            specification: spec,
            enhancedPrompt: spec.generation_instructions || enhancePrompt(prompt, spec),
            source: 'openai-reasoning-engine',
          });
        }
      } catch (aiErr) {
        console.warn('OpenAI reasoning fallback to local theory engine:', aiErr);
      }
    }

    // Built-in Music Theory Engine
    const specification = interpretPrompt(prompt, overrides);
    const enhanced = enhancePrompt(prompt, specification);

    return NextResponse.json({
      specification,
      enhancedPrompt: enhanced,
      source: 'sonora-music-theory-engine',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error)?.message || 'Failed to interpret prompt' },
      { status: 500 }
    );
  }
}
