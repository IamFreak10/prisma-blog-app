import app from './app';
import { prisma } from './lib/prisma';

const port = process.env.PORT || 5000;
async function main() {
  try {
    await prisma.$connect();
    console.log('Database connected');

    app.listen(port, () => {
      console.log(`Server running on port http://localhost:${port}`);
    });
  } catch (error) {
    console.error('An error occured', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
