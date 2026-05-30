import { BackboardClient } from "backboard-sdk";

export function createBackboardClient() {
  if (!process.env.BACKBOARD_API_KEY) {
    throw new Error("Missing BACKBOARD_API_KEY");
  }

  return new BackboardClient({
    apiKey: process.env.BACKBOARD_API_KEY,
  });
}