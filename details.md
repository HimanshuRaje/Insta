INSTA — Project Documentation & Developer Guidelines
> "Instant attention. Instant action. Instant growth."
---
1. What Is INSTA?
INSTA is a gamified productivity app built in React Native (Expo) for Android.
It uses spin wheels, a focus timer, a points system, and a punishment/reward mechanic to fight procrastination and build discipline — making personal growth feel like a game.
The name INSTA means:
Instant — tasks demand instant attention, no delay
A nod to Instagram — same randomness and dopamine, but productive
---
2. Core Philosophy
Principle	Meaning
Earn before you enjoy	You must complete focus blocks to spin the reward wheel
Guilt as a tool	Punishment wheel creates accountability through discomfort
Randomness = dopamine	Spin outcomes are unpredictable — keeps engagement high
Growth feels fun	UI must feel like a game, not a chore app
Honest by design	Cheat button exists — honesty is built into the system
---
3. Tech Stack
Tool	Version	Purpose
React Native	0.83.4	Mobile app framework
Expo	~55.0.9	Development platform
Expo Router	~55.0.8	File-based screen navigation
TypeScript	~5.9.2	Type-safe JavaScript
React Native Reanimated	4.2.1	Smooth wheel spin animations
Expo Haptics	~55.0.9	Vibration feedback
React Navigation (Bottom Tabs)	^7.4.0	Tab bar navigation
AsyncStorage	(install later)	Local data persistence
expo-av	(install later)	Sound effects
---
4. Project Folder Structure
```
Insta/
├── app/                          # All screens (Expo Router)
│   ├── _layout.tsx               # Root layout (Stack navigator)
│   ├── index.tsx                 # Entry point redirect
│   └── (tabs)/                   # Bottom tab screens
│       ├── _layout.tsx           # Tab bar config
│       ├── index.tsx             # 🏠 Home / Dashboard
│       ├── timer.tsx             # ⏱️ Focus Timer
│       ├── spin.tsx              # 🎡 Spin Wheels
│       ├── history.tsx           # 📊 Points & History
│       └── settings.tsx          # ⚙️ Settings
│
├── components/                   # Reusable UI pieces
│   ├── SpinWheel.tsx             # The animated spin wheel
│   ├── PointsBar.tsx             # Top bar showing current points
│   ├── TimerRing.tsx             # Circular countdown timer
│   ├── StreakBadge.tsx           # Streak display
│   └── WheelSelector.tsx         # Choose which wheel to spin
│
├── logic/                        # App brain — NO UI code here
│   ├── timerLogic.ts             # Start, pause, complete timer
│   ├── pointsLogic.ts            # Earn, spend, deduct points
│   ├── spinLogic.ts              # Weighted random spin outcome
│   └── cheatLogic.ts             # Cheat detection & punishment
│
├── storage/                      # AsyncStorage read/write
│   └── store.ts                  # All data save/load functions
│
├── constants/                    # Fixed app-wide values
│   ├── wheelData.ts              # All wheel items & weights
│   └── colors.ts                 # App color palette
│
├── hooks/                        # Custom React hooks
│   ├── useTimer.ts               # Timer state & logic
│   ├── usePoints.ts              # Points state & logic
│   └── useWheel.ts               # Wheel spin state
│
└── assets/                       # Images, fonts, sounds
    └── sounds/                   # Spin sounds, reward sounds
```
---
5. Screen Map
🏠 Home / Dashboard (`index.tsx`)
Shows current points (always visible)
Daily blocks completed
Current streak
Quick access to Timer and Spin
Motivational message
⏱️ Timer Screen (`timer.tsx`)
45-min countdown (customizable)
Circular progress ring
Pause button (reduces reward if paused)
On complete → +1 point + celebration animation
On exit → no reward
🎡 Spin Screen (`spin.tsx`)
Choose wheel: Reward / Break / Punishment
Animated spin wheel
Sound + vibration on result
Reward spin costs 1 point
Break spin costs 0 points
Punishment spin is forced (cheat button)
📊 History Screen (`history.tsx`)
Today's blocks completed
Total XP earned
Spin history (what did you land on)
Streak calendar
⚙️ Settings Screen (`settings.tsx`)
Customize timer duration
Add/remove wheel items
Set spin probabilities
Reset data
---
6. The Three Wheels
🎁 Reward Wheel
Trigger: Spend 1 point
Purpose: Celebrate completing a focus block
Examples: "Watch 1 YouTube video", "Eat a snack", "10-min nap", "Call a friend", "???(Mystery)"
Rule: Cannot spin without points
☕ Break Wheel
Trigger: Free (no points needed)
Purpose: Decide what to do in 15-min break
Examples: "Call mom", "Read 3 pages", "Write a random story", "Walk outside", "Stretch for 5 mins"
Rule: Spin anytime during a break
😤 Punishment Wheel
Trigger: Press "I Cheated" button
Purpose: Create guilt and accountability
Examples: "50 pushups", "Send ₹20 to a random friend", "Give a treat to a random friend", "Write 1 page of notes", "No phone for 2 hours"
Rule: Cannot skip after spinning
---
7. Points System
Action	Points
Complete 45-min focus block	+1 point
Pause during block	No point earned
Exit early	No point earned
Spin reward wheel	-1 point
Cheat detected	-2 points OR forced punishment
Point Display (always visible in top bar):
🪙 Current Points
📅 Today's Points
⭐ Total XP (never decreases)
---
8. Rule Engine
These are the laws of INSTA. The app enforces them strictly:
No points = no reward spin. Button is disabled.
Cheat button = forced punishment spin. No escape.
Pausing timer = no point earned at end of session.
Exiting timer early = no point earned.
Daily spin limit (optional setting): max 5 reward spins/day.
Streak break = lose streak bonus, no point penalty.
---
9. Data Model (What Gets Saved)
This is everything stored in AsyncStorage on the phone:
```typescript
// User's persistent data
type AppData = {
  points: {
    current: number;       // Spendable points right now
    todayEarned: number;   // Reset every midnight
    totalXP: number;       // Never decreases, lifetime total
  };

  streak: {
    current: number;       // Days in a row with 1+ block
    longest: number;       // All-time best streak
    lastActiveDate: string; // ISO date string
  };

  timer: {
    defaultDuration: number;  // In minutes, default 45
    todayBlocks: number;      // Blocks completed today
    totalBlocks: number;      // All-time blocks completed
  };

  history: SpinResult[];     // Log of all spin outcomes

  settings: {
    timerDuration: number;
    dailySpinLimit: number;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  };

  wheels: {
    reward: WheelItem[];
    punishment: WheelItem[];
    break: WheelItem[];
  };
}

// A single item on any wheel
type WheelItem = {
  id: string;
  label: string;
  weight: number;    // Higher = more likely to land on it
  color: string;
}

// A single spin result saved to history
type SpinResult = {
  id: string;
  wheelType: 'reward' | 'punishment' | 'break';
  outcome: string;
  timestamp: string;
}
```
---
10. Weighted Probability (How Spin Outcomes Work)
Not all wheel items are equal. Rare rewards are harder to land on.
```typescript
// Example reward wheel weights:
{ label: "Watch 1 YouTube video", weight: 30 }  // Common
{ label: "Eat a snack",           weight: 25 }  // Common
{ label: "10-min nap",            weight: 20 }  // Uncommon
{ label: "Call a friend",         weight: 15 }  // Uncommon
{ label: "???  Mystery Reward",   weight: 10 }  // Rare
```
Total weight = 100. Each item's probability = its weight / total.
---
11. MVP Build Order
Build in this exact order. Don't skip ahead.
```
Phase 1 — Foundation
  ✅ Project setup (DONE)
  ✅ Folder structure (DONE)
  ✅ Navigation (tabs) (NEXT)
  [ ] Color constants
  [ ] Wheel data constants

Phase 2 — Data Layer
  [ ] AsyncStorage store.ts
  [ ] usePoints hook
  [ ] useTimer hook

Phase 3 — Core Screens
  [ ] Home screen (basic)
  [ ] Timer screen (working countdown)
  [ ] Points bar component

Phase 4 — Spin System
  [ ] spinLogic.ts (weighted random)
  [ ] SpinWheel component (animated)
  [ ] Spin screen (all 3 wheels)

Phase 5 — Polish
  [ ] Sound effects
  [ ] Haptic feedback
  [ ] Streak system
  [ ] History screen
  [ ] Settings screen

Phase 6 — Advanced
  [ ] App lock during focus
  [ ] Progress graphs
  [ ] Level system
  [ ] Mystery rewards
```
---
12. UI/UX Guidelines
Visual Identity
Feel: Energetic, dark, game-like — like a productivity RPG
Primary color: Deep purple `#1a0533`
Accent: Electric gold `#FFD700`
Success: Neon green `#39FF14`
Danger: Hot red `#FF3B30`
Background: Near black `#0D0D0D`
Text: Off white `#F5F5F5`
Animation Rules
Wheel spin must feel SATISFYING — slow start, fast middle, dramatic slow end
Use spring animations for buttons (scale down on press)
Confetti on completing a focus block
Never use plain instant transitions
Sound Design
Spin start: whoosh sound
Spin result: satisfying click/chime
Reward: celebration sound
Punishment: dramatic "oh no" sound
Timer complete: gentle bell
---
13. Key Developer Rules (For You)
Never write UI in logic files. `logic/` has zero imports from `react-native`.
Never write logic in components. Components only display and call hooks.
Always type everything. No `any` in TypeScript. Ever.
One thing per file. If a file does 3 things, split it.
Name things clearly. `calculateSpinOutcome()` not `calc()`.
Comment the WHY, not the WHAT. Code shows what. Comments explain why.
Test on phone after every screen. Don't build 5 screens then test.
Commit to git after each phase. (We'll set this up later.)
---
14. Commands Reference
```bash
# Start the app
npm run android

# Install a new package
npx expo install <package-name>

# Check for errors
npx tsc --noEmit

# Reset Metro bundler cache (when things act weird)
npx expo start --clear
```
---

```

Last updated: Project kickoff
Developer: You
Mentor: Claude