import { NextRequest, NextResponse } from "next/server";
import { createSnowflakeConnection, connectSnowflake } from "@/lib/snowflake";

export const runtime = "nodejs";

export async function GET() {
  const connection = createSnowflakeConnection();

  try {
    await connectSnowflake(connection);

    const rows = await new Promise<any[]>((resolve, reject) => {
      connection.execute({
        sqlText: `
          SELECT
            ID,
            USER_ID,
            TOPIC,
            QUESTION,
            AI_RESPONSE,
            SCORE,
            THREAD_ID,
            PET_MOOD,
            CREATED_AT
          FROM MY_DB.PUBLIC.STUDY_SESSIONS
          WHERE TOPIC = 'Walk Session'
          ORDER BY CREATED_AT DESC
        `,
        complete: (err, stmt, rows) => {
          if (err) reject(err);
          else resolve(rows ?? []);
        },
      });
    });

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  } finally {
    connection.destroy(() => {});
  }
}
export async function POST(req: NextRequest) {
  const connection = createSnowflakeConnection();

  try {
    const body = await req.json();

    const {
      userId,
      petName = "Puppie",
      distanceMiles = 0,
      durationMinutes = 0,
      locationName = "Unknown",
      petMood = "happy",
    } = body;

    await connectSnowflake(connection);

await new Promise<void>((resolve, reject) => {
  const walkId = crypto.randomUUID();

  connection.execute({
    sqlText: `
      INSERT INTO MY_DB.PUBLIC.STUDY_SESSIONS (
        ID,
        USER_ID,
        TOPIC,
        QUESTION,
        AI_RESPONSE,
        SCORE,
        THREAD_ID,
        PET_MOOD,
        CREATED_AT
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())
    `,
    binds: [
      crypto.randomUUID(),
      userId,
      "Walk Session",
      `Pet=${petName}; Distance=${distanceMiles}; Duration=${durationMinutes}; Location=${locationName}`,
      `Walk completed with ${petName}. Pet mood: ${petMood}.`,
      Math.round(Number(distanceMiles)),
      walkId,
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
      message: "Walk saved to existing Snowflake table",
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