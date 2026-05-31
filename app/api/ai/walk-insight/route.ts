import { NextRequest, NextResponse } from "next/server";
import { createSnowflakeConnection, connectSnowflake } from "@/lib/snowflake";

export const runtime = "nodejs";

function extractNumber(text: string, label: string): number {
  const regex = new RegExp(`${label}=([0-9.]+)`);
  const match = text.match(regex);
  return match ? Number(match[1]) : 0;
}

function extractText(text: string, label: string): string {
  const regex = new RegExp(`${label}=([^;]+)`);
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

function isSimpleStatsQuestion(message: string) {
  const lower = message.toLowerCase();

  return (
    lower.includes("how did i do") ||
    lower.includes("this week") ||
    lower.includes("how far") ||
    lower.includes("how many") ||
    lower.includes("total") ||
    lower.includes("summary")
  );
}

export async function POST(req: NextRequest) {
  const connection = createSnowflakeConnection();

  try {
    const body = await req.json();
    const { userId = "user123", message = "" } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: "message is required" },
        { status: 400 }
      );
    }

    await connectSnowflake(connection);

    const rows = await new Promise<any[]>((resolve, reject) => {
      connection.execute({
        sqlText: `
          SELECT
            USER_ID,
            QUESTION,
            AI_RESPONSE,
            SCORE,
            PET_MOOD,
            CREATED_AT
          FROM MY_DB.PUBLIC.STUDY_SESSIONS
          WHERE TOPIC = 'Walk Session'
            AND USER_ID = ?
          ORDER BY CREATED_AT DESC
          LIMIT 20
        `,
        binds: [userId],
        complete: (err, stmt, rows) => {
          if (err) reject(err);
          else resolve(rows ?? []);
        },
      });
    });

    if (rows.length === 0) {
      return NextResponse.json({
        success: true,
        reply:
          "🐶 I do not see any walk data yet. Take your first walk with your puppy, then I can give you insights!",
        stats: null,
      });
    }

    const totalWalks = rows.length;

    const totalMiles = rows.reduce((sum, row) => {
      return sum + extractNumber(String(row.QUESTION), "Distance");
    }, 0);

    const totalMinutes = rows.reduce((sum, row) => {
      return sum + extractNumber(String(row.QUESTION), "Duration");
    }, 0);

    const petName =
      extractText(String(rows[0]?.QUESTION ?? ""), "Pet") || "your puppy";

    const location =
      extractText(String(rows[0]?.QUESTION ?? ""), "Location") ||
      "your walk area";

    const happyCount = rows.filter(
      (row) => String(row.PET_MOOD).toLowerCase() === "happy"
    ).length;

    const latestWalkDate = rows[0]?.CREATED_AT;

    const stats = {
      userId,
      petName,
      totalWalks,
      totalMiles,
      totalMinutes,
      happyCount,
      location,
      latestWalkDate,
    };

    if (isSimpleStatsQuestion(message)) {
      return NextResponse.json({
        success: true,
        reply: `🐶 You completed ${totalWalks} walks with ${petName}, totaling ${totalMiles} miles and ${totalMinutes} minutes. ${petName} was happy on ${happyCount} walks!`,
        stats,
      });
    }

    const walkDetails = rows
      .map((row, index) => {
        const q = String(row.QUESTION);
        const distance = extractNumber(q, "Distance");
        const duration = extractNumber(q, "Duration");
        const rowLocation = extractText(q, "Location") || location;

        return `Walk ${index + 1}: ${distance} miles, ${duration} minutes, mood=${row.PET_MOOD}, location=${rowLocation}, date=${row.CREATED_AT}`;
      })
      .join("\n");

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
              content:
                "You are Walkie Puppie AI. Analyze only the provided walking data. Do not invent dates, streaks, places, goals, or achievements. Keep the answer under 60 words. Be friendly, practical, and concise.",
            },
            {
              role: "user",
              content: `
User question:
${message}

Stats:
- Pet: ${petName}
- Walk count: ${totalWalks}
- Total miles: ${totalMiles}
- Total minutes: ${totalMinutes}
- Happy mood count: ${happyCount}
- Main location: ${location}
- Latest walk: ${latestWalkDate}

Walk details:
${walkDetails}

Give one useful insight based only on this data.
              `,
            },
          ],
          max_tokens: 100,
          temperature: 0.2,
        }),
      }
    );

    const gradientData = await gradientResponse.json();

    if (!gradientResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "AI request failed",
          details: gradientData,
        },
        { status: gradientResponse.status }
      );
    }

    const reply =
      gradientData?.choices?.[0]?.message?.content ??
      "🐶 I checked your walks, but I could not generate an insight.";

    return NextResponse.json({
      success: true,
      reply,
      stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  } finally {
    connection.destroy(() => {});
  }
}