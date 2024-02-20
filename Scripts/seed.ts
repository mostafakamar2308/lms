const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Art Science" },
        { name: "Fitness Science" },
        { name: "Photography" },
        { name: "Accounting" },
        { name: "Engineering" },
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
