import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const USERS_FILE = path.join(process.cwd(), 'src/data/users.json');
const RECORDS_FILE = path.join(process.cwd(), 'src/data/records.json');
const WORDS_FILE = path.join(process.cwd(), 'src/data/words.json');

interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

interface Record {
  id: string;
  userId: string;
  wordId: string;
  status: 'known' | 'unknown';
  createdAt: string;
  updatedAt: string;
}

interface Word {
  id: string;
  word: string;
  meaning: string;
  example?: string;
}

async function readJsonFile(filePath: string) {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function writeJsonFile(filePath: string, data: any) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function createUser(email: string, password: string, name?: string) {
  const { users } = await readJsonFile(USERS_FILE);
  const existingUser = users.find((u: User) => u.email === email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    email,
    password: hashedPassword,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeJsonFile(USERS_FILE, { users });
  return newUser;
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export async function getUserByEmail(email: string) {
  const { users } = await readJsonFile(USERS_FILE);
  return users.find((u: User) => u.email === email) || null;
}

export async function getRandomWord(userId: string) {
  const { words } = await readJsonFile(WORDS_FILE);
  const { records } = await readJsonFile(RECORDS_FILE);
  
  const learnedWordIds = records
    .filter((r: Record) => r.userId === userId)
    .map((r: Record) => r.wordId);
  
  const availableWords = words.filter((w: Word) => !learnedWordIds.includes(w.id));
  
  if (availableWords.length === 0) return null;
  return availableWords[Math.floor(Math.random() * availableWords.length)];
}

export async function markWordStatus(userId: string, wordId: string, status: 'known' | 'unknown') {
  const { records } = await readJsonFile(RECORDS_FILE);
  const existingRecord = records.find(
    (r: Record) => r.userId === userId && r.wordId === wordId
  );

  if (existingRecord) {
    existingRecord.status = status;
    existingRecord.updatedAt = new Date().toISOString();
  } else {
    records.push({
      id: uuidv4(),
      userId,
      wordId,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  await writeJsonFile(RECORDS_FILE, { records });
  return existingRecord || records[records.length - 1];
}