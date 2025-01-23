'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LearningStats } from '@/lib/learning-stats';
import { ThumbsUpAnimation } from '@/components/thumbs-up-animation';

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
  const [showThumbsUp, setShowThumbsUp] = useState(false);
  const [reviewList, setReviewList] = useState<Word[]>([]);
  const [todayLearnedCount, setTodayLearnedCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 检查并重置每日计数
  useEffect(() => {
    if (mounted) {
      const count = LearningStats.checkAndResetDailyCount();
      setTodayLearnedCount(count);
    }
  }, [mounted]);

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

  useEffect(() => {
    if (mounted) {
      fetchNextWord();
    }
  }, [mounted]);

  const handleRemembered = () => {
    setShowThumbsUp(true);
    LearningStats.incrementTodayLearnedCount();
    setTodayLearnedCount(LearningStats.getTodayLearnedCount());
    setTimeout(() => {
      setShowThumbsUp(false);
      fetchNextWord();
    }, 1000);
  };

  const handleForgotten = () => {
    if (currentWord) {
      setReviewList(prev => [...prev, currentWord]);
      toast({
        title: '已添加到复习列表',
        description: `${currentWord.word} 已添加到复习列表中`,
      });
    }
    fetchNextWord();
  };

  if (!mounted) {
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
    <div className="relative flex h-screen w-full items-center justify-center p-4 flex-col">
      <div className="absolute top-4 right-4">
        <Button variant="outline" onClick={() => window.location.href = '/learn/stats'}>
          查看学习记录
        </Button>
      </div>
      <div className="text-lg font-semibold mb-4">
        今日已记住: <span className="text-green-600">{todayLearnedCount}</span> 个单词
      </div>
      <ThumbsUpAnimation isVisible={showThumbsUp} />
      <Card className="w-[400px]">
        <CardHeader className="flex items-center justify-center text-center">
          <CardTitle className="text-2xl font-bold mb-2">{currentWord.word}</CardTitle>
          <CardDescription className="text-lg">{currentWord.meaning}</CardDescription>
        </CardHeader>
        {currentWord.example && (
          <CardContent>
            <p className="text-gray-600 italic text-center">{currentWord.example}</p>
          </CardContent>
        )}
        <CardFooter className="flex gap-6 justify-center">
          <Button
            variant="secondary"
            size="lg"
            className="w-32 text-lg font-semibold hover:scale-105 transition-transform shadow-md border border-gray-200 dark:border-gray-700"
            onClick={handleRemembered}
            disabled={loading}
          >
            记住
          </Button>
          <Button
            variant="destructive"
            size="lg"
            className="w-32 text-lg font-semibold hover:scale-105 transition-transform shadow-md border border-gray-200 dark:border-gray-700"
            onClick={handleForgotten}
            disabled={loading}
          >
            遗忘
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}