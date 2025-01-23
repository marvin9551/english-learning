import { NextResponse } from 'next/server';
import words from '@/data/words.json' assert { type: 'json' };

export async function GET() {
  try {
    if (words.words.length === 0) {
      return NextResponse.json(
        { error: '没有可用的单词' },
        { status: 404 }
      );
    }

    const randomIndex = Math.floor(Math.random() * words.words.length);
    const randomWord = words.words[randomIndex];

    return NextResponse.json(randomWord);
  } catch (error) {
    console.error('获取随机单词失败:', error);
    return NextResponse.json(
      { error: '获取单词失败' },
      { status: 500 }
    );
  }
}