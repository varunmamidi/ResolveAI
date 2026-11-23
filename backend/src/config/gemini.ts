
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is missing from environment variables"
  );
}

export const gemini = new GoogleGenAI({
  apiKey
});

export const GEMINI_CHAT_MODEL =
  process.env.GEMINI_CHAT_MODEL || "gemini-2.5-flash";

export const GEMINI_EMBEDDING_MODEL =
  process.env.GEMINI_EMBEDDING_MODEL ||
  "gemini-embedding-001";
