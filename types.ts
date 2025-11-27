export interface WaterLog {
  id: string;
  amount: number;
  timestamp: number;
}

export interface DailyStats {
  date: string; // ISO date string YYYY-MM-DD
  total: number;
  goal: number;
}

export enum ContainerSize {
  SMALL = 200,
  MEDIUM = 350,
  LARGE = 500,
  BOTTLE = 750,
}

export interface UserSettings {
  dailyGoal: number;
  reminderInterval: number; // in minutes
  notificationsEnabled: boolean;
}