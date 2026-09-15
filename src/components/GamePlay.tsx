import React, { useState, useEffect, useRef } from 'react';
import { PlayerState, RoundResolution, CardInfo } from '../types';
import { initializeGame, resolveRound, pickBestAiStat, countQuartets, formatStatValue } from '../utils/gameLogic';
import { CardView } from './CardView';
import { soundFx } from '../utils/audio';
import { ArrowLeft, RotateCcw, Award, Layers, Volume2, VolumeX, Sparkles, AlertCircle } from 'lucide-react';

interface GamePlayProps {
  numPlayers: number;
  isAiMode: boolean;
  onBackToMenu: () => void;
}

export const GamePlay: React.FC<GamePlayProps> = ({
  numPlayers,
  isAiMode,
  onBackToMenu,
}) => {
  // Game state
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [firstRound, setFirstRound] = useState<boolean>(true);
  const [leftoverCards, setLeftoverCards] = useState<CardInfo[]>([]);
  const [selectedStatIndex, setSelectedStatIndex] = useState<number | null>(null);
  const [resolution, setResolution] = useState<RoundResolution | null>(null);
  const [showResolution, setShowResolution] = useState<boolean>(false);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<PlayerState | null>(null);
  const [showQuartetsModal, setShowQuartetsModal] = useState<boolean>(false);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize new game
  const startNewGame = () => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);

    const names = isAiMode
      ? ['Player 1', 'CPU Alpha', 'CPU Bravo', 'CPU Delta']
      : ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
    const aiConfig = isAiMode
      ? [false, true, true, true]
      : [false, false, false, false];

    const init = initializeGame(numPlayers, names, aiConfig);
    setPlayers(init.players);
    setCurrentPlayer(init.startingPlayer);
    setLeftoverCards(init.leftoverCards);
    setFirstRound(true);
    setRoundNumber(1);
    setSelectedStatIndex(null);
    setResolution(null);
    setShowResolution(false);
    setGameOver(false);
    setWinner(null);
    setIsAiThinking(false);
  };

  useEffect(() => {
    startNewGame();
    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [numPlayers, isAiMode]);

  const activePlayer = players[currentPlayer];
  const activeCard = activePlayer?.cards[0];

  // AI Turn handler
  useEffect(() => {
    if (gameOver || showResolution || !activePlayer) return;

    if (activePlayer.isAi && activeCard) {
      setIsAiThinking(true);
      aiTimerRef.current = setTimeout(() => {
        const bestStat = pickBestAiStat(activeCard);
        handleSelectStat(bestStat);
        setIsAiThinking(false);
      }, 1400);
    } else {
      setIsAiThinking(false);
    }

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [currentPlayer, showResolution, gameOver, activePlayer, activeCard]);

  // Player or AI selects a statistic to battle
  const handleSelectStat = (statIndex: number) => {
    if (gameOver || showResolution || !activeCard) return;

    soundFx.playStatSelect();
    setSelectedStatIndex(statIndex);

    // Resolve round
    const res = resolveRound(players, statIndex);
    setResolution(res);
    setShowResolution(true);

    // Audio cue
    if (res.plays.some((p) => p.isSuperUltima)) {
      soundFx.playSuperUltima();
    } else if (res.winnerId === 0) {
      soundFx.playRoundWin();
    } else {
      soundFx.playRoundLoss();
    }
  };

  // Collect cards and advance to next round
  const handleNextRound = () => {
    if (!resolution) return;
    soundFx.playClick();

    const winnerId = resolution.winnerId;

    // Remove top card from all players that played
    const updatedPlayers = players.map((p) => ({
      ...p,
      cards: [...p.cards],
    }));

    const wonCards: CardInfo[] = [];
    for (const p of updatedPlayers) {
      if (p.cards.length > 0) {
        const removed = p.cards.shift();
        if (removed) wonCards.push(removed);
      }
    }

    // Winner gets all collected cards at the bottom of their deck
    const winnerPlayer = updatedPlayers.find((p) => p.id === winnerId);
    if (winnerPlayer) {
      winnerPlayer.cards.push(...wonCards);
      if (firstRound && leftoverCards.length > 0) {
        winnerPlayer.cards.push(...leftoverCards);
        setLeftoverCards([]);
      }
    }

    if (firstRound) {
      setFirstRound(false);
    }

    // Check game over (only 1 player has cards left)
    const alivePlayers = updatedPlayers.filter((p) => p.cards.length > 0);
    if (alivePlayers.length <= 1) {
      setPlayers(updatedPlayers);
      setGameOver(true);
      setWinner(alivePlayers[0] || null);
      setShowResolution(false);
      setSelectedStatIndex(null);
      soundFx.playRoundWin();
      return;
    }

    setPlayers(updatedPlayers);
    setCurrentPlayer(winnerId);
    setSelectedStatIndex(null);
    setResolution(null);
    setShowResolution(false);
    setRoundNumber((r) => r + 1);
  };

  const toggleSound = () => {
    soundFx.enabled = !soundFx.enabled;
    setSoundMuted(!soundFx.enabled);
  };

  if (!activePlayer || !activeCard) {
    return (
      <div className="min-h-screen bg-[#10131A] flex items-center justify-center text-white">
        <p className="font-pixel text-xl">LOADING CARDS...</p>
      </div>
    );
  }

  const isHumanTurn = !activePlayer.isAi;

  return (
    <div
      id="gameplay-screen"
      className="min-h-screen bg-[#10131A] flex flex-col justify-between text-white select-none relative pb-3"
    >
      {/* Top Navbar */}
      <header className="w-full bg-neutral-900/90 border-b border-neutral-800 px-3 sm:px-6 py-2 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <button
            id="back-menu-btn"
            onClick={() => {
              soundFx.playClick();
              onBackToMenu();
            }}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Return to Menu"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <span className="font-pixel text-lg sm:text-xl text-[#FFD700] leading-none">
              ROUND {roundNumber}
            </span>
            <span className="font-homevideo text-[10px] sm:text-xs text-neutral-400 mt-0.5">
              {isAiMode ? 'SOLO VS CPU' : 'PASS & PLAY'}
            </span>
          </div>
        </div>

        {/* Turn Status Pill */}
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full font-pixel text-xs sm:text-sm flex items-center gap-1.5 border shadow ${
              activePlayer.id === 0
                ? 'bg-blue-600/30 text-blue-300 border-blue-500/50'
                : 'bg-amber-600/30 text-amber-300 border-amber-500/50 animate-pulse'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current inline-block" />
            <span>
              {isAiThinking
                ? `${activePlayer.name} is choosing...`
                : `${activePlayer.name}'s turn`}
            </span>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="quartets-toggle-btn"
            onClick={() => {
              soundFx.playClick();
              setShowQuartetsModal(true);
            }}
            className="flex items-center gap-1 bg-[#252A31] hover:bg-[#343B45] text-neutral-200 font-pixel text-xs px-2.5 py-1.5 rounded-lg border border-neutral-700 transition-colors cursor-pointer"
            title="View Quartets"
          >
            <Award className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">QUARTETS</span>
          </button>

          <button
            id="restart-game-btn"
            onClick={() => {
              soundFx.playClick();
              startNewGame();
            }}
            className="p-1.5 rounded-lg bg-[#252A31] hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Restart Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="p-1.5 rounded-lg bg-[#252A31] hover:bg-neutral-700 text-neutral-300 hover:text-[#FFD700] transition-colors"
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Players Standings Bar */}
      <div className="w-full max-w-4xl mx-auto px-3 pt-2 pb-1">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {players.map((p) => {
            const isTurn = p.id === currentPlayer;
            const quartets = countQuartets(p.cards);
            const isEliminated = p.cards.length === 0;

            return (
              <div
                key={p.id}
                id={`player-badge-${p.id}`}
                className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                  isEliminated
                    ? 'opacity-40 bg-neutral-900 border-neutral-800'
                    : isTurn
                    ? 'bg-neutral-800/90 border-[#FFD700] shadow-[0_0_12px_rgba(255,215,0,0.3)]'
                    : 'bg-[#1C2127]/80 border-neutral-800'
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-pixel text-xs sm:text-sm text-white truncate font-bold">
                      {p.name}
                    </span>
                    {isTurn && (
                      <span className="text-[10px] bg-[#FFD700] text-black px-1 rounded font-pixel">
                        LEAD
                      </span>
                    )}
                  </div>
                  <span className="font-homevideo text-[10px] text-neutral-400">
                    {quartets.total > 0
                      ? `${quartets.total} Quartet${quartets.total > 1 ? 's' : ''}`
                      : '0 Quartets'}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-lg border border-neutral-700">
                  <Layers className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span className="font-pixel text-xs sm:text-sm text-white font-bold">
                    {p.cards.length}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CENTER: Main Active Card Duel Arena */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 my-auto">
        {/* Instruction Guidance Banner */}
        <div className="mb-2 text-center">
          {isHumanTurn ? (
            <p className="font-homevideo text-xs sm:text-sm text-amber-300 animate-pulse bg-amber-500/10 px-4 py-1 rounded-full border border-amber-500/30 inline-block">
              ★ YOUR TURN: Click any of the 6 colored statistics to duel!
            </p>
          ) : (
            <p className="font-homevideo text-xs sm:text-sm text-neutral-400 bg-neutral-800/60 px-4 py-1 rounded-full border border-neutral-700 inline-block">
              Waiting for {activePlayer.name} to choose a statistic...
            </p>
          )}
        </div>

        {/* The Active Card */}
        <CardView
          card={activeCard}
          interactive={isHumanTurn && !isAiThinking && !showResolution}
          disabled={!isHumanTurn || isAiThinking || showResolution}
          selectedStatIndex={selectedStatIndex}
          onSelectStat={handleSelectStat}
        />
      </main>

      {/* SHOWDOWN / ROUND RESOLUTION MODAL */}
      {showResolution && resolution && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            id="round-resolution-modal"
            className="bg-[#1C2127] border-2 border-[#FFD700] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 my-auto"
          >
            {/* Resolution Banner */}
            <div className="p-4 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 border-b border-neutral-700 text-center relative">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFD700]" />
                <h3 className="font-pixel text-xl sm:text-2xl text-[#FFD700] tracking-wider">
                  STAT DUEL: {resolution.statLabel}
                </h3>
              </div>
              <p className="font-homevideo text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl mx-auto">
                {resolution.explanation}
              </p>
            </div>

            {/* Revealed Cards Comparison Grid */}
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40">
              {resolution.plays.map((play) => {
                const isWinnerCard = play.playerId === resolution.winnerId;
                return (
                  <div
                    key={play.playerId}
                    className={`rounded-xl p-2.5 flex flex-col items-center text-center border-2 transition-transform ${
                      isWinnerCard
                        ? 'bg-amber-500/15 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.5)] scale-105 z-10'
                        : 'bg-[#252A31]/70 border-neutral-700 opacity-85'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between mb-1.5">
                      <span className="font-pixel text-xs text-neutral-300 truncate">
                        {play.playerName}
                      </span>
                      {isWinnerCard && (
                        <span className="bg-[#FFD700] text-black font-pixel text-[10px] px-1.5 py-0.2 rounded font-bold">
                          WINNER!
                        </span>
                      )}
                    </div>

                    {/* Small card preview */}
                    <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden border border-neutral-600 mb-2 bg-black flex items-center justify-center">
                      <img
                        src={play.card.image}
                        alt={play.card.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-0 left-0 bg-blue-600 text-white font-pixel text-[10px] px-1 rounded-br">
                        {play.card.code}
                      </span>
                      {play.isSuperUltima && (
                        <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-black font-pixel text-[9px] font-black uppercase text-center py-0.5">
                          SUPER ULTIMA
                        </span>
                      )}
                    </div>

                    <span className="font-pixel text-xs text-white truncate w-full font-bold">
                      {play.card.name}
                    </span>

                    {/* Highlighted Duel Stat */}
                    <div
                      className={`mt-2 w-full py-1.5 px-2 rounded-lg font-pixel flex flex-col items-center ${
                        isWinnerCard
                          ? 'bg-[#FFD700] text-black font-bold'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-homevideo">
                        {resolution.statLabel}
                      </span>
                      <span className="text-sm">
                        {formatStatValue(play.statValue)} {resolution.statUnit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Round Action */}
            <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between">
              <span className="font-homevideo text-xs text-neutral-400">
                {resolution.winnerName} takes {resolution.cardsTransferred} card
                {resolution.cardsTransferred > 1 ? 's' : ''} to bottom of deck
              </span>

              <button
                id="next-round-btn"
                onClick={handleNextRound}
                className="px-6 py-2.5 bg-[#FFD700] hover:bg-amber-400 text-black font-pixel text-base font-bold rounded-xl shadow-lg border border-amber-300 transition-all cursor-pointer transform active:scale-95"
              >
                NEXT ROUND →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME OVER DIALOG (matches Android AlertDialog) */}
      {gameOver && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1C2127] border-2 border-[#FFD700] rounded-2xl w-full max-w-md p-6 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(255,215,0,0.6)]">
              <Award className="w-10 h-10 text-black" />
            </div>

            <h2 className="font-pixel text-3xl text-[#FFD700] mb-2">GAME OVER</h2>
            <p className="font-homevideo text-lg text-white mb-2">
              {winner ? `${winner.name} wins the match!` : 'Match concluded!'}
            </p>
            <p className="font-homevideo text-xs text-neutral-400 mb-6">
              Total rounds played: {roundNumber}
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  soundFx.playClick();
                  onBackToMenu();
                }}
                className="px-5 py-2.5 bg-[#252A31] hover:bg-[#343B45] text-white font-pixel text-base rounded-xl border border-neutral-700"
              >
                MAIN MENU
              </button>
              <button
                onClick={() => {
                  soundFx.playStatSelect();
                  startNewGame();
                }}
                className="px-6 py-2.5 bg-[#FFD700] hover:bg-amber-400 text-black font-pixel text-base font-bold rounded-xl shadow-lg"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUARTETS INSPECTOR MODAL */}
      {showQuartetsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C2127] border-2 border-neutral-700 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-pixel text-xl text-[#FFD700]">QUARTET STATUS</h3>
              <button
                onClick={() => setShowQuartetsModal(false)}
                className="text-neutral-400 hover:text-white font-pixel text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              {players.map((p) => {
                const quartets = countQuartets(p.cards);
                return (
                  <div key={p.id} className="bg-[#252A31] p-3 rounded-xl border border-neutral-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-pixel text-base text-white">{p.name}</span>
                      <span className="font-homevideo text-xs text-[#FFD700]">
                        {quartets.total} Complete Quartet{quartets.total !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {quartets.letters.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {quartets.letters.map((l) => (
                          <span
                            key={l}
                            className="bg-purple-600/40 text-purple-200 border border-purple-500 font-pixel text-xs px-2.5 py-0.5 rounded-full"
                          >
                            SET {l} (ALL 4 CARDS)
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400 font-homevideo">
                        No complete quartets yet. Needs all 4 cards of any letter (e.g. A1-A4).
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-3 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setShowQuartetsModal(false)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white font-pixel text-sm px-4 py-1.5 rounded-lg border border-neutral-700"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
