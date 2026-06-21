export type WheelItem = {
  id: string;
  label: string;
  weight: number;
  color: string;
};

export type SpinResult = {
  id: string;
  wheelType: 'reward' | 'punishment' | 'break';
  outcome: string;
  timestamp: string;
};

export type PointsData = {
  current: number;
  todayEarned: number;
  totalXP: number;
};

export type StreakData = {
  current: number;
  longest: number;
  lastActiveDate: string;
};

export type TimerData = {
  defaultDuration: number;
  todayBlocks: number;
  totalBlocks: number;
};

export type SettingsData = {
  timerDuration: number;
  dailySpinLimit: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
};

export type WheelsData = {
  reward: WheelItem[];
  punishment: WheelItem[];
  break: WheelItem[];
};

export type AppData = {
  points: PointsData;
  streak: StreakData;
  timer: TimerData;
  history: SpinResult[];
  settings: SettingsData;
  wheels: WheelsData;
};
