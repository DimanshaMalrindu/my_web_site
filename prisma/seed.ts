import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const name = process.env.ADMIN_NAME ?? "Admin";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { email, name, passwordHash },
  });
  console.log(`✓ Admin user ready: ${email}`);

  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: process.env.ADMIN_NAME ?? "Dimansha Wijebandara",
      title: "Senior Software Developer (R&D)",
      tagline: "Building reliable, elegant software at ABB.",
      bio: "I'm a senior software developer focused on R&D at ABB in Helsinki. I love crafting clean architectures, scalable systems, and developer-friendly tools.",
      location: "Helsinki, Finland",
      accentColor: "#0ea5e9",
      email: email,
      githubUrl: "https://github.com/DimanshaMalrindu",
      linkedinUrl: "",
      websiteUrl: "",
    },
  });
  console.log("✓ Profile seeded");

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteTitle: "Dimansha Wijebandara — Senior Software Developer",
      siteDescription: "Portfolio of Dimansha Wijebandara, Senior Software Developer (R&D) at ABB, Helsinki.",
      contactToEmail: email,
    },
  });
  console.log("✓ Site settings seeded");

  const expCount = await prisma.experience.count();
  if (expCount === 0) {
    await prisma.experience.create({
      data: {
        company: "ABB",
        role: "Senior Software Developer (R&D)",
        location: "Helsinki, Finland",
        startDate: new Date("2022-01-01"),
        current: true,
        bullets: [
          "Designing and shipping R&D software for industrial-grade systems.",
          "Driving architecture, code quality, and best practices across teams.",
        ],
        order: 0,
      },
    });
    console.log("✓ Sample experience added");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
