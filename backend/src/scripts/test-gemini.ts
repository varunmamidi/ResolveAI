
import {
  gemini,
  GEMINI_CHAT_MODEL,
  GEMINI_EMBEDDING_MODEL
} from "../config/gemini";

import { withGeminiRetry } from "../utils/gemini-retry";

async function testGemini() {
  try {
    console.log("Testing Gemini chat model...");
    console.log("Model:", GEMINI_CHAT_MODEL);

    const response = await withGeminiRetry(() =>
      gemini.models.generateContent({
        model: GEMINI_CHAT_MODEL,
        contents: "Explain RAG in one simple sentence."
      })
    );

    console.log("Gemini response:", response.text);

    console.log("\nTesting Gemini embeddings...");

    const embeddingResponse = await withGeminiRetry(() =>
      gemini.models.embedContent({
        model: GEMINI_EMBEDDING_MODEL,
        contents: "How do I reset my password?",
        config: {
          outputDimensionality: 768
        }
      })
    );

    const vector =
      embeddingResponse.embeddings?.[0]?.values;

    if (!vector || vector.length !== 768) {
      throw new Error(
        "Embedding generation failed or dimensions mismatch"
      );
    }

    console.log("Embedding generated successfully");
    console.log("Vector dimensions:", vector.length);
    console.log("First five values:", vector.slice(0, 5));

  } catch (error) {
    console.error("Gemini test failed:", error);
    process.exitCode = 1;
  }
}

testGemini();
