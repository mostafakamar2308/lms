const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.postCategory.createMany({
      data: [
        { name: "قواعد" },
        { name: "قصة" },
        { name: "كلمات" },
        { name: "ترجمة" },
        { name: "قطعة" },
      ],
    });
    console.log("Success");
  } catch (error) {
    console.log("SEED_ERROR", error);
  } finally {
    await database.$disconnect();
  }
}
main();
