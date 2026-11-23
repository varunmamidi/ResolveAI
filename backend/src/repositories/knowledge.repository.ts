
import { Op } from "sequelize";
import { KnowledgeArticle } from "../models";

export class KnowledgeRepository {
  static async create(data: {
    title: string;
    content: string;
    category: string;
  }) {
    return KnowledgeArticle.create(data);
  }

  static async findAll() {
    return KnowledgeArticle.findAll({
      order: [["createdAt", "DESC"]]
    });
  }

  static async findById(id: number) {
    return KnowledgeArticle.findByPk(id);
  }

  static async search(query: string) {
    const pattern = `%${query}%`;

    return KnowledgeArticle.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: pattern } },
          { content: { [Op.iLike]: pattern } },
          { category: { [Op.iLike]: pattern } }
        ]
      },
      order: [["createdAt", "DESC"]],
      limit: 20
    });
  }

  static async update(
    article: KnowledgeArticle,
    data: {
      title: string;
      content: string;
      category: string;
    }
  ) {
    return article.update(data);
  }

  static async delete(article: KnowledgeArticle) {
    await article.destroy();
  }
}
