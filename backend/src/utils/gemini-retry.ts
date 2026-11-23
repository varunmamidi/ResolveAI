
export async function withGeminiRetry<T>(
  operation: () => Promise<T>,
  maxAttempts = 2
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      const status = (error as { status?: number })?.status;

      const retryable =
        status === 503 ||
        status === 502 ||
        status === 504 ||
        status === 429;

      if (!retryable || attempt === maxAttempts) {
        throw error;
      }

      const delay = Math.min(
        1000 * 2 ** (attempt - 1),
        8000
      );

      console.log(
        `Gemini temporarily unavailable (${status}). ` +
        `Retrying in ${delay / 1000}s...`
      );

      await new Promise(resolve =>
        setTimeout(resolve, delay)
      );
    }
  }

  throw new Error("Gemini request failed");
}
