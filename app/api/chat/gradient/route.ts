import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      message,
      userId = "anonymous",
      petName = "Puppie",
      walkDistanceMiles = 0,
      petMood = "happy",
    } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.DIGITALOCEAN_MODEL_ACCESS_KEY) {
      return NextResponse.json(
        { success: false, error: "Missing DIGITALOCEAN_MODEL_ACCESS_KEY" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://inference.do-ai.run/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DIGITALOCEAN_MODEL_ACCESS_KEY}`,
        },
        body: JSON.stringify({
          model: "mistral-3-14B",
          messages: [
            {
              role: "system",
              content: `
You are Walkie Puppie AI, a friendly AR pet companion.
You talk like a cute encouraging puppy.
You help the user walk more, stay motivated, and understand their pet's mood.
Keep answers short, warm, and playful.
              `,
            },
            {
              role: "user",
              content: `
User ID: ${userId}
Pet name: ${petName}
Walk distance today: ${walkDistanceMiles} miles
Pet mood: ${petMood}

User message:
${message}
              `,
            },
          ],
          max_tokens: 300,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("DigitalOcean Gradient error:", data);

      return NextResponse.json(
        {
          success: false,
          error: "DigitalOcean Gradient request failed",
          details: data,
        },
        { status: response.status }
      );
    }

    const aiResponse =
      data?.choices?.[0]?.message?.content ?? "Woof! I could not think of a reply.";

    return NextResponse.json({
      success: true,
      userId,
      petName,
      petMood,
      walkDistanceMiles,
      message,
      aiResponse,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}