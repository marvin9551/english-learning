'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface Word {
  id: string;
  word: string;
  meaning: string;
  example?: string;
}

export default function LearnPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && !currentWord) {
      fetchNextWord();
    }
  }, [status, router, currentWord]);

  async function fetchNextWord() {
    if (status !== 'authenticated') return;
    
    try {
      const response = await fetch('/api/words/random');
      if (!response.ok) throw new Error('获取单词失败');
      const word = await response.json();
      setCurrentWord(word);
    } catch (error) {
      toast({
        title: '错误',
        description: '获取单词失败，请重试',
        variant: 'destructive'
      });
    }
  }

  async function markWord(status: 'known' | 'unknown') {
    if (!currentWord || !session) return;
    setLoading(true);

    try {
      const response = await fetch('/api/words/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordId: currentWord.id, status })
      });

      if (!response.ok) throw new Error('标记单词状态失败');
      await fetchNextWord();
    } catch (error) {
      toast({
        title: '错误',
        description: '标记单词状态失败，请重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>加载中...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (!currentWord) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>暂无单词</CardTitle>
            <CardDescription>当前没有可学习的单词</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{currentWord.word}</CardTitle>
          <CardDescription className="text-lg">{currentWord.meaning}</CardDescription>
        </CardHeader>
        {currentWord.example && (
          <CardContent>
            <p className="text-gray-600 italic">{currentWord.example}</p>
          </CardContent>
        )}
        <CardFooter className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => markWord('unknown')}
            disabled={loading}
          >
            遗忘
          </Button>
          <Button
            onClick={() => markWord('known')}
            disabled={loading}
          >
            熟悉
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}