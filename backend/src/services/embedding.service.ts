
import {
  gemini,
  GEMINI_EMBEDDING_MODEL
} from "../config/gemini";

import { withGeminiRetry } from "../utils/gemini-retry";

export class EmbeddingService {
  static async generate(
    text: string,
    taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY"
  ): Promise<number[]> {
    const response = await withGeminiRetry(() =>
      gemini.models.embedContent({
        model: GEMINI_EMBEDDING_MODEL,
        contents: text,
        config: {
          taskType,
          outputDimensionality: 768
        }
      })
    );

    const vector = response.embeddings?.[0]?.values;

    if (
      !vector ||
      vector.length !== 768 ||
      !vector.every(Number.isFinite)
    ) {
      throw new Error("Invalid embedding response");
    }

    return vector;
  }
}
