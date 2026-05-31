import { NextRequest, NextResponse } from "next/server";
import { createBackboardClient } from "@/lib/backboard";
import { createSnowflakeConnection, connectSnowflake } from "@/lib/snowflake";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const connection = createSnowflakeConnection();

  try {
    const body = await req.json();

    const {
      userId = "user123",
      message,
      petName = "Puppie",
      walkDistanceMiles = 0,
      petMood = "happy",
      threadId,
    } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: "message is required" },
        { status: 400 }
      );
    }

    const backboard = createBackboardClient();

    const memoryResponse = (await backboard.sendMessage({
      content: `User ID: ${userId}
Pet name: ${petName}
Walk distance today: ${walkDistanceMiles}
Pet mood: ${petMood}
User message: ${message}`,
      threadId,
      memory: "Auto",
    })) as {
      content: string;
      threadId: string;
    };

    const memoryContext = memoryResponse.content;
    const newThreadId = memoryResponse.threadId;

    const gradientResponse = await fetch(
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
You are Walkie Puppie AI, a friendly AR puppy companion.

Use the user's Backboard memory/context to personalize your answer.

Rules:
- Be warm, cute, and encouraging.
- Help the user walk more.
- Mention the pet naturally.
- Keep the response short.
- If the user asks what you remember, answer from memory context.
              `,
            },
            {
              role: "user",
              content: `
Backboard memory/context:
${memoryContext}

Current user:
${userId}

Pet:
${petName}

Walk distance today:
${walkDistanceMiles} miles

Pet mood:
${petMood}

User message:
${message}
              `,
            },
          ],
          max_tokens: 350,
        }),
      }
    );

    const gradientData = await gradientResponse.json();

    if (!gradientResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Gradient AI request failed",
          details: gradientData,
        },
        { status: gradientResponse.status }
      );
    }

    const aiResponse =
      gradientData?.choices?.[0]?.message?.content ?? "Woof! No response returned.";

    await connectSnowflake(connection);

    await new Promise<void>((resolve, reject) => {
      connection.execute({
        sqlText: `
          INSERT INTO MY_DB.PUBLIC.STUDY_SESSIONS (
            ID,
            USER_ID,
            TOPIC,
            QUESTION,
            AI_RESPONSE,
            SCORE,
            CREATED_AT,
            THREAD_ID,
            PET_MOOD
          )
          SELECT
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            CURRENT_TIMESTAMP(),
            ?,
            ?
        `,
        binds: [
          crypto.randomUUID(),
          userId,
          "AI Chat",
          message,
          aiResponse,
          Math.round(Number(walkDistanceMiles)),
          newThreadId,
          petMood,
        ],
        complete: (err) => {
          if (err) reject(err);
          else resolve();
        },
      });
    });

    return NextResponse.json({
      success: true,
      reply: aiResponse,
      aiResponse,
      userId,
      petName,
      message,
      threadId: newThreadId,
      memoryContext,
      memoryEnabled: true,
      savedToSnowflake: true,
    });
  } catch (error) {
    console.error("Gradient Backboard chat error:", error);

    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  } finally {
    connection.destroy(() => {});
  }
}