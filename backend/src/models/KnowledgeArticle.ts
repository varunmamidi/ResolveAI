
import {
  DataTypes,
  Model,
  Optional
} from "sequelize";

import { sequelize } from "../config/database";

interface KnowledgeArticleAttributes {
  id: number;
  title: string;
  content: string;
  category: string;
}

interface KnowledgeArticleCreationAttributes
  extends Optional<KnowledgeArticleAttributes, "id"> {}

export class KnowledgeArticle
  extends Model<
    KnowledgeArticleAttributes,
    KnowledgeArticleCreationAttributes
  >
  implements KnowledgeArticleAttributes {

  declare id: number;
  declare title: string;
  declare content: string;
  declare category: string;
}

KnowledgeArticle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    category: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "knowledge_articles",
    timestamps: true
  }
);
