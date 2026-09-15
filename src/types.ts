export interface Statistic {
  label: string;
  value: number;
  unit: string;
}

export interface CardInfo {
  code: string;
  name: string;
  type: string;
  image: string;
  letter: string;
  number: number;
  superUltima: boolean;
  statistics: [Statistic, Statistic, Statistic, Statistic, Statistic, Statistic];
}

export interface PlayerState {
  id: number;
  name: string;
  isAi: boolean;
  cards: CardInfo[];
}

export interface RoundPlay {
  playerId: number;
  playerName: string;
  card: CardInfo;
  statValue: number;
  isSuperUltima: boolean;
  isNumberOne: boolean;
}

export interface RoundResolution {
  statIndex: number;
  statLabel: string;
  statUnit: string;
  plays: RoundPlay[];
  winnerId: number;
  winnerName: string;
  explanation: string;
  cardsTransferred: number;
}
