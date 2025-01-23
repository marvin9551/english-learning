interface DailyRecord {
  date: string;
  count: number;
}

export class LearningStats {
  private static readonly LEARNED_COUNT_PREFIX = 'learnedCount_';
  private static readonly LAST_RESET_DATE_KEY = 'lastResetDate';
  private static readonly TODAY_LEARNED_COUNT_KEY = 'todayLearnedCount';

  static getTodayLearnedCount(): number {
    const savedCount = localStorage.getItem(this.TODAY_LEARNED_COUNT_KEY);
    return savedCount ? parseInt(savedCount) : 0;
  }

  static incrementTodayLearnedCount(): void {
    const newCount = this.getTodayLearnedCount() + 1;
    localStorage.setItem(this.TODAY_LEARNED_COUNT_KEY, newCount.toString());
    
    // 保存每日学习记录
    const today = new Date().toISOString().split('T')[0];
    const dailyCount = parseInt(localStorage.getItem(`${this.LEARNED_COUNT_PREFIX}${today}`) || '0');
    localStorage.setItem(`${this.LEARNED_COUNT_PREFIX}${today}`, (dailyCount + 1).toString());
  }

  static checkAndResetDailyCount(): number {
    const lastResetDate = localStorage.getItem(this.LAST_RESET_DATE_KEY);
    const today = new Date().toDateString();
    
    if (lastResetDate !== today) {
      localStorage.setItem(this.TODAY_LEARNED_COUNT_KEY, '0');
      localStorage.setItem(this.LAST_RESET_DATE_KEY, today);
      return 0;
    }
    
    return this.getTodayLearnedCount();
  }

  static getWeeklyStats(): { records: DailyRecord[]; streak: number } {
    const records: DailyRecord[] = [];
    const today = new Date();
    let currentStreak = 0;
    let lastLearningDate: Date | null = null;

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = parseInt(localStorage.getItem(`${this.LEARNED_COUNT_PREFIX}${dateStr}`) || '0');
      records.push({ date: dateStr, count });

      if (count > 0) {
        if (!lastLearningDate) {
          currentStreak = 1;
        } else {
          const dayDiff = Math.floor((date.getTime() - lastLearningDate.getTime()) / (1000 * 60 * 60 * 24));
          if (dayDiff === 1) {
            currentStreak++;
          } else {
            currentStreak = 1;
          }
        }
        lastLearningDate = date;
      }
    }

    return { records, streak: currentStreak };
  }
}