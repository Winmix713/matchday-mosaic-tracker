import { Tip, Notification, Tipster } from './types';

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Új Tipp Elérhető!',
    message: 'ProTipster új tippet osztott meg: Barcelona vs Real Madrid mérkőzésre.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: '2',
    title: 'Sikeres Előrejelzés!',
    message: 'Gratulálunk! A Bayern München vs Dortmund tipped bejött!',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: '3',
    title: 'Új Követő',
    message: 'SportGuru követni kezdte a profilodat. Oszd meg vele legjobb tippjeidet!',
    timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: '4',
    title: 'Heti Rangsor',
    message: 'A #3 helyen állsz a heti tipster ranglistán. Továbbra is szép munka!',
    timestamp: new Date(Date.now() - 1440 * 60 * 1000).toISOString(),
    read: true,
  },
];

export const mockTips: Tip[] = [
  {
    id: 'tip1',
    title: 'Barcelona vs Real Madrid',
    description: 'El Clásico - La Liga',
    image: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
    status: 'upcoming',
    startTime: new Date(Date.now() + 120 * 60 * 1000).toISOString(),
    teams: {
      home: {
        id: 'barca',
        name: 'FC Barcelona',
        recentForm: ['W', 'W', 'D', 'W', 'L'],
      },
      away: {
        id: 'real',
        name: 'Real Madrid',
        recentForm: ['W', 'W', 'W', 'D', 'W'],
      },
    },
    prediction: {
      type: 'winner',
      value: 'Real Madrid',
      odds: 2.10,
      confidence: 75,
    },
    analysis: 'Real Madrid jobb formában van, az utóbbi 5 meccsükből 4-et megnyertek. A Barcelona védelme gyengélkedik, különösen idegenben.',
    category: 'football',
    tipster: {
      id: 'tipster1',
      username: 'ProTipster',
      winRate: 68,
      expertise: ['La Liga', 'Champions League'],
    },
    stats: {
      likes: 245,
      comments: 57,
      shares: 89,
    },
    minStake: 50,
    maxStake: 5000,
  },
  {
    id: 'tip2',
    title: 'Lakers vs Warriors',
    description: 'NBA Regular Season',
    image: 'https://images.pexels.com/photos/945471/pexels-photo-945471.jpeg',
    status: 'live',
    startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    teams: {
      home: {
        id: 'lakers',
        name: 'Los Angeles Lakers',
        recentForm: ['W', 'L', 'W', 'W', 'W'],
      },
      away: {
        id: 'warriors',
        name: 'Golden State Warriors',
        recentForm: ['L', 'W', 'L', 'W', 'L'],
      },
    },
    prediction: {
      type: 'score',
      value: 'Over 220.5',
      odds: 1.95,
      confidence: 85,
    },
    analysis: 'Mindkét csapat támadó szellemű játékot játszik. Az utóbbi 5 mérkőzésükön átlagosan 230+ pont született.',
    category: 'basketball',
    tipster: {
      id: 'tipster2',
      username: 'NBAExpert',
      winRate: 72,
      expertise: ['NBA', 'Basketball'],
    },
    stats: {
      likes: 189,
      comments: 34,
      shares: 56,
    },
    minStake: 50,
    maxStake: 3000,
  },
];

export const mockTipsters: Tipster[] = [
  {
    id: 'tipster1',
    username: 'ProTipster',
    tipId: 'tip1',
    tipTitle: 'Barcelona vs Real Madrid',
    stake: 200,
    return: 420,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    successRate: 68,
    expertise: ['La Liga', 'Champions League'],
  },
  {
    id: 'tipster2',
    username: 'NBAExpert',
    tipId: 'tip2',
    tipTitle: 'Lakers vs Warriors',
    stake: 150,
    return: 292,
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    successRate: 72,
    expertise: ['NBA', 'Basketball'],
  },
  {
    id: 'tipster3',
    username: 'TennisGuru',
    tipId: 'tip3',
    tipTitle: 'Djokovic vs Nadal',
    stake: 300,
    return: 510,
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    successRate: 75,
    expertise: ['Tennis', 'Grand Slams'],
  },
];
