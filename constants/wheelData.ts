import { WheelItem } from '../types';
import { COLORS } from './colors';

export const DEFAULT_REWARD_WHEEL: WheelItem[] = [
  {
    id: 'reward_1',
    label: 'Watch YouTube',
    weight: 30,
    color: COLORS.gold,
  },
  {
    id: 'reward_2',
    label: 'Eat a snack',
    weight: 25,
    color: COLORS.neonGreen,
  },
  {
    id: 'reward_3',
    label: '10-min nap',
    weight: 20,
    color: '#00BFFF',
  },
  {
    id: 'reward_4',
    label: 'Call a friend',
    weight: 15,
    color: '#FF69B4',
  },
  {
    id: 'reward_5',
    label: '🎉 Mystery',
    weight: 10,
    color: '#FF1493',
  },
];

export const DEFAULT_PUNISHMENT_WHEEL: WheelItem[] = [
  {
    id: 'punish_1',
    label: '50 pushups',
    weight: 25,
    color: COLORS.red,
  },
  {
    id: 'punish_2',
    label: 'Send ₹20 to friend',
    weight: 25,
    color: '#FF6347',
  },
  {
    id: 'punish_3',
    label: 'Give treat to friend',
    weight: 25,
    color: '#FF69B4',
  },
  {
    id: 'punish_4',
    label: 'Write 1 page notes',
    weight: 15,
    color: '#FF4500',
  },
  {
    id: 'punish_5',
    label: 'No phone 2 hours',
    weight: 10,
    color: '#DC143C',
  },
];

export const DEFAULT_BREAK_WHEEL: WheelItem[] = [
  {
    id: 'break_1',
    label: 'Call mom',
    weight: 20,
    color: '#FFB6C1',
  },
  {
    id: 'break_2',
    label: 'Read 3 pages',
    weight: 20,
    color: '#00BFFF',
  },
  {
    id: 'break_3',
    label: 'Write random story',
    weight: 20,
    color: '#FFD700',
  },
  {
    id: 'break_4',
    label: 'Walk outside',
    weight: 20,
    color: COLORS.neonGreen,
  },
  {
    id: 'break_5',
    label: 'Stretch 5 mins',
    weight: 20,
    color: '#FF69B4',
  },
];

export const DEFAULT_TIMER_DURATION = 45; // minutes
export const DEFAULT_DAILY_SPIN_LIMIT = 5;
