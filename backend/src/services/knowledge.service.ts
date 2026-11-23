
import { KnowledgeRepository } from "../repositories/knowledge.repository";

const httpError = (message: string, statusCode: number) =>
  Object.assign(new Error(message), { statusCode });

type ArticleInput = {
  title: string;
  content: string;
  category: string;
};

export class KnowledgeService {
  static async create(data: ArticleInput) {
    return KnowledgeRepository.create(data);
  }

  static async getAll() {
    return KnowledgeRepository.findAll();
  }

  static async getById(id: number) {
    const article = await KnowledgeRepository.findById(id);

    if (!article) {
      throw httpError("Knowledge article not found", 404);
    }

    return article;
  }

  static async search(query: string) {
    return KnowledgeRepository.search(query);
  }

  static async update(id: number, data: ArticleInput) {
    const article = await this.getById(id);

    return KnowledgeRepository.update(article, data);
  }

  static async delete(id: number) {
    const article = await this.getById(id);

    await KnowledgeRepository.delete(article);
  }
}
