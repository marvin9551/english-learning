'use client';

import { useState } from 'react';
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
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);

  const fetchNextWord = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    fetchNextWord();
  }, []);

  const handleNextWord = () => {
    fetchNextWord();
  };

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
            onClick={handleNextWord}
            disabled={loading}
          >
            下一个
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}