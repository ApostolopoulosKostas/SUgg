import { CardInfo, PlayerState, RoundPlay, RoundResolution } from '../types';
import { getAirplanesDeck } from '../data/airplanesDeck';

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function formatStatValue(value: number): string {
  if (Number.isInteger(value)) {
    return value.toLocaleString();
  }
  return value.toFixed(1);
}

export function countQuartets(cards: CardInfo[]): { total: number; letters: string[] } {
  const counts: Record<string, number> = {};
  for (const c of cards) {
    counts[c.letter] = (counts[c.letter] || 0) + 1;
  }
  const completedLetters: string[] = [];
  for (const [letter, count] of Object.entries(counts)) {
    if (count === 4) {
      completedLetters.push(letter);
    }
  }
  return {
    total: completedLetters.length,
    letters: completedLetters.sort(),
  };
}

export function initializeGame(
  numPlayers: number,
  playerNames: string[] = ['Player 1', 'CPU 1', 'CPU 2', 'CPU 3'],
  aiConfig: boolean[] = [false, true, true, true]
): {
  players: PlayerState[];
  leftoverCards: CardInfo[];
  startingPlayer: number;
} {
  const shuffledDeck = shuffleArray(getAirplanesDeck());
  const players: PlayerState[] = [];
  for (let i = 0; i < numPlayers; i++) {
    players.push({
      id: i,
      name: playerNames[i] || `Player ${i + 1}`,
      isAi: aiConfig[i] ?? (i > 0),
      cards: [],
    });
  }

  const cardsPerPlayer = Math.floor(shuffledDeck.length / numPlayers);
  let cardIndex = 0;

  for (const p of players) {
    for (let c = 0; c < cardsPerPlayer; c++) {
      p.cards.push(shuffledDeck[cardIndex]);
      cardIndex++;
    }
  }

  const leftoverCards: CardInfo[] = [];
  while (cardIndex < shuffledDeck.length) {
    leftoverCards.push(shuffledDeck[cardIndex]);
    cardIndex++;
  }

  const startingPlayer = Math.floor(Math.random() * numPlayers);

  return {
    players,
    leftoverCards,
    startingPlayer,
  };
}

export function resolveRound(
  players: PlayerState[],
  statIndex: number
): RoundResolution {
  const plays: RoundPlay[] = [];

  for (const p of players) {
    if (p.cards.length > 0) {
      const topCard = p.cards[0];
      const stat = topCard.statistics[statIndex];
      plays.push({
        playerId: p.id,
        playerName: p.name,
        card: topCard,
        statValue: stat.value,
        isSuperUltima: topCard.superUltima,
        isNumberOne: topCard.number === 1,
      });
    }
  }

  if (plays.length === 0) {
    throw new Error('No active players with cards');
  }

  let winnerPlayIndex = 0;
  let explanation = '';

  for (let i = 1; i < plays.length; i++) {
    const current = plays[i];
    const leader = plays[winnerPlayIndex];

    // SUPER ULTIMA VS NORMAL
    if (current.isSuperUltima && !leader.isSuperUltima) {
      if (leader.card.number !== 1) {
        winnerPlayIndex = i;
        explanation = `SUPER ULTIMA (${current.card.code} ${current.card.name}) automatically defeats ${leader.card.code}!`;
        continue;
      } else {
        // leader has card #1!
        explanation = `Card #1 (${leader.card.code}) challenges SUPER ULTIMA! Comparing ${current.card.statistics[statIndex].label}...`;
      }
    } else if (!current.isSuperUltima && leader.isSuperUltima) {
      if (current.card.number !== 1) {
        // leader stays winner
        explanation = `SUPER ULTIMA (${leader.card.code} ${leader.card.name}) defends against ${current.card.code}!`;
        continue;
      } else {
        // current has card #1!
        explanation = `Card #1 (${current.card.code}) challenges SUPER ULTIMA! Comparing ${current.card.statistics[statIndex].label}...`;
      }
    }

    // Normal comparison
    if (current.statValue > leader.statValue) {
      winnerPlayIndex = i;
      explanation = `${current.playerName}'s ${current.card.name} wins with ${formatStatValue(current.statValue)} ${current.card.statistics[statIndex].unit} vs ${formatStatValue(leader.statValue)} ${leader.card.statistics[statIndex].unit}`;
    }
  }

  const winnerPlay = plays[winnerPlayIndex];
  if (!explanation) {
    explanation = `${winnerPlay.playerName} had the top value of ${formatStatValue(winnerPlay.statValue)} ${winnerPlay.card.statistics[statIndex].unit}!`;
  }

  return {
    statIndex,
    statLabel: winnerPlay.card.statistics[statIndex].label,
    statUnit: winnerPlay.card.statistics[statIndex].unit,
    plays,
    winnerId: winnerPlay.playerId,
    winnerName: winnerPlay.playerName,
    explanation,
    cardsTransferred: plays.length,
  };
}

export function pickBestAiStat(card: CardInfo): number {
  if (card.superUltima) {
    // If it's Super Ultima, pick a high stat to be extra safe against card #1s
    return 0; // Speed is 2410 km/h
  }

  // Pre-calculated approx max for deck stats:
  // Speed max ~3540 (SR-71)
  // Autonomy max ~22780 (RQ-4)
  // Wingspan max ~67.89 (C-5B)
  // Length max ~75.31 (C-5B)
  // Weight max ~381000 (C-5B)
  // Max Height max ~27430 (U-2R)
  const maxes = [3540, 22780, 68, 76, 381000, 27500];

  let bestIndex = 0;
  let highestRatio = -1;

  for (let i = 0; i < 6; i++) {
    const ratio = card.statistics[i].value / maxes[i];
    if (ratio > highestRatio) {
      highestRatio = ratio;
      bestIndex = i;
    }
  }

  return bestIndex;
}
