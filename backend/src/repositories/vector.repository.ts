
import { QueryTypes } from "sequelize";
import { sequelize } from "../config/database";

export interface KnowledgeMatch {
  id: number;
  title: string;
  content: string;
  category: string;
  similarity: number;
}

export class VectorRepository {
  static async upsert(
    articleId: number,
    vector: number[]
  ): Promise<void> {
    const vectorString = JSON.stringify(vector);

    await sequelize.query(
      `
      INSERT INTO knowledge_embeddings
        (article_id, embedding)
      VALUES
        (:articleId, CAST(:vector AS vector))
      ON CONFLICT (article_id)
      DO UPDATE SET
        embedding = EXCLUDED.embedding,
        updated_at = NOW()
      `,
      {
        replacements: {
          articleId,
          vector: vectorString
        }
      }
    );
  }

  static async search(
    vector: number[],
    limit = 3
  ): Promise<KnowledgeMatch[]> {
    const vectorString = JSON.stringify(vector);

    const rows = await sequelize.query<KnowledgeMatch>(
      `
      SELECT
        a.id,
        a.title,
        a.content,
        a.category,
        1 - (
          e.embedding <=> CAST(:vector AS vector)
        ) AS similarity
      FROM knowledge_embeddings e
      JOIN knowledge_articles a
        ON a.id = e.article_id
      ORDER BY
        e.embedding <=> CAST(:vector AS vector)
      LIMIT :limit
      `,
      {
        replacements: {
          vector: vectorString,
          limit: Math.max(1, Math.min(limit, 10))
        },
        type: QueryTypes.SELECT
      }
    );

    return rows;
  }
}
