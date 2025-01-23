'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ThumbsUpAnimation } from '@/components/ui/thumbs-up-animation';

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

  // 检查并重置每日计数
  useEffect(() => {
    const lastResetDate = localStorage.getItem('lastResetDate');
    const today = new Date().toDateString();
    
    if (lastResetDate !== today) {
      setTodayLearnedCount(0);
      localStorage.setItem('lastResetDate', today);
    } else {
      const savedCount = localStorage.getItem('todayLearnedCount');
      if (savedCount) {
        setTodayLearnedCount(parseInt(savedCount));
      }
    }
  }, []);

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
    fetchNextWord();
  }, []);

  const handleRemembered = () => {
    setShowThumbsUp(true);
    const newCount = todayLearnedCount + 1;
    setTodayLearnedCount(newCount);
    localStorage.setItem('todayLearnedCount', newCount.toString());
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
    <div className="flex h-screen w-full items-center justify-center p-4 flex-col">
      <div className="mb-4 text-lg font-semibold">
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
        <CardFooter className="flex gap-4 justify-center">
          <Button
            variant="secondary"
            onClick={handleRemembered}
            disabled={loading}
          >
            记住
          </Button>
          <Button
            variant="destructive"
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