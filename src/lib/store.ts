import { create } from 'zustand';
import { Tip, Notification, User, TipHistory, Tipster } from './types';
import { mockTips, mockNotifications, mockTipsters } from './mock-data';

interface AppState {
  userStats: User & { notifications: Notification[] };
  tips: Tip[];
  currentTip: {
    tipId: string | null;
    stake: number;
    selectedPrediction: string | null;
  };
  tipHistory: TipHistory[];
  topTipsters: Tipster[];
  isDarkMode: boolean;
  isAuthenticated: boolean;

  // Actions
  markNotificationAsRead: (id: string) => void;
  setCurrentTip: (tip: Partial<AppState['currentTip']>) => void;
  followTip: () => void;
  toggleDarkMode: () => void;
  login: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  userStats: {
    id: '1',
    username: 'TipMaster',
    points: 1250,
    winRate: 68,
    totalTips: 42,
    successfulTips: 28,
    followers: 156,
    expertise: ['Football', 'NBA'],
    notifications: mockNotifications,
  },
  tips: mockTips,
  currentTip: {
    tipId: null,
    stake: 100,
    selectedPrediction: null,
  },
  tipHistory: [],
  topTipsters: mockTipsters,
  isDarkMode: true,
  isAuthenticated: true,

  markNotificationAsRead: (id) =>
    set((state) => ({
      userStats: {
        ...state.userStats,
        notifications: state.userStats.notifications.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        ),
      },
    })),

  setCurrentTip: (tip) =>
    set((state) => ({
      currentTip: { ...state.currentTip, ...tip },
    })),

  followTip: () => {
    const { currentTip, tips, userStats, tipHistory } = get();
    const { tipId, stake, selectedPrediction } = currentTip;

    if (!tipId || !selectedPrediction || stake <= 0) {
      console.warn('Invalid tip placement attempt');
      return;
    }

    const tip = tips.find((t) => t.id === tipId);
    if (!tip) {
      console.warn('Tip not found');
      return;
    }

    const newHistoryItem: TipHistory = {
      id: `tip-${Date.now()}`,
      tipId,
      userId: userStats.id,
      stake,
      prediction: selectedPrediction,
      odds: tip.prediction.odds,
      status: 'pending',
      placedAt: new Date().toISOString(),
      potentialReturn: stake * tip.prediction.odds,
    };

    set({
      tipHistory: [newHistoryItem, ...tipHistory],
      userStats: {
        ...userStats,
        points: userStats.points - stake,
      },
      currentTip: {
        tipId: null,
        stake: 100,
        selectedPrediction: null,
      },
    });
  },

  toggleDarkMode: () =>
    set((state) => ({
      isDarkMode: !state.isDarkMode,
    })),

  login: () =>
    set(() => ({
      isAuthenticated: true,
    })),

  logout: () =>
    set(() => ({
      isAuthenticated: false,
    })),
}));
