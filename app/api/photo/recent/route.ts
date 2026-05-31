import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export const runtime = "nodejs";

const mongoClient = new MongoClient(process.env.MONGO_URI!);

export async function GET(req: NextRequest) {
  try {
    if (!process.env.MONGO_URI) {
      return NextResponse.json(
        { success: false, error: "Missing MONGO_URI" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId") || "user123";
    const limit = Number(searchParams.get("limit") || 3);

    await mongoClient.connect();

    const photos = await mongoClient
      .db("walkie_puppie")
      .collection("minted_photos")
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .project({
        _id: 0,
        userId: 1,
        nftName: 1,
        petName: 1,
        mintAddress: 1,
        signature: 1,
        explorer: 1,
        txExplorer: 1,
        imageUrl: 1,
        metadataUri: 1,
        walkDistanceMiles: 1,
        durationMinutes: 1,
        locationName: 1,
        createdAt: 1,
      })
      .toArray();

    return NextResponse.json({
      success: true,
      count: photos.length,
      photos,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || String(error) },
      { status: 500 }
    );
  }
}