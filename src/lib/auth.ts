import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function createUser(email: string, password: string, name?: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function getRandomWord(userId: string) {
  // 获取用户未学习过的单词
  const word = await prisma.word.findFirst({
    where: {
      NOT: {
        records: {
          some: {
            userId: userId
          }
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
  return word;
}

export async function markWordStatus(userId: string, wordId: string, status: 'known' | 'unknown') {
  return prisma.record.upsert({
    where: {
      userId_wordId: {
        userId,
        wordId
      }
    },
    update: {
      status
    },
    create: {
      userId,
      wordId,
      status
    }
  });
}