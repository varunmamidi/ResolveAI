
import "dotenv/config";

import { sequelize } from "../config/database";
import { KnowledgeIndexService } from "../services/knowledge-index.service";

async function main() {
  try {
    await sequelize.authenticate();

    console.log("Connected to PostgreSQL");
    console.log("Starting knowledge indexing...");

    const result = await KnowledgeIndexService.indexAll();

    console.log("Indexing result:", result);

    if (result.failed > 0) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error("Indexing failed:", error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();
