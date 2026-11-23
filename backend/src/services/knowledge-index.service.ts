
import { KnowledgeArticle } from "../models";
import { EmbeddingService } from "./embedding.service";
import { VectorRepository } from "../repositories/vector.repository";

export class KnowledgeIndexService {
  static async indexArticle(article: KnowledgeArticle) {
    const text = [
      `Title: ${article.title}`,
      `Category: ${article.category}`,
      `Content: ${article.content}`
    ].join("\n");

    const vector = await EmbeddingService.generate(
      text,
      "RETRIEVAL_DOCUMENT"
    );

    await VectorRepository.upsert(article.id, vector);

    return {
      articleId: article.id,
      dimensions: vector.length
    };
  }

  static async indexAll() {
    const articles = await KnowledgeArticle.findAll();

    const results = [];

    for (const article of articles) {
      try {
        const result = await this.indexArticle(article);
        results.push(result);

        console.log(`Indexed article ${article.id}`);
      } catch (error) {
        console.error(
          `Failed to index article ${article.id}:`,
          error
        );
      }
    }

    return {
      total: articles.length,
      indexed: results.length,
      failed: articles.length - results.length
    };
  }
}
