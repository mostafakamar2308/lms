const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "الصف الأول الثانوى" },
        { name: "الصف الثانى الثانوى" },
        { name: "الصف الثالث الثانوى" },
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
