/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { DeckBrowser } from './components/DeckBrowser';
import { GamePlay } from './components/GamePlay';
import { RulesModal } from './components/RulesModal';

type AppView = 'menu' | 'browser' | 'game';

export default function App() {
  const [view, setView] = useState<AppView>('menu');
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [isAiMode, setIsAiMode] = useState<boolean>(true);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);

  const handleStartGame = (playersCount: number, aiMode: boolean) => {
    setNumPlayers(playersCount);
    setIsAiMode(aiMode);
    setView('game');
  };

  return (
    <div className="w-full min-h-screen bg-[#10131A] text-white">
      {view === 'menu' && (
        <MainMenu
          onBrowseDeck={() => setView('browser')}
          onStartGame={handleStartGame}
          onOpenRules={() => setIsRulesOpen(true)}
        />
      )}

      {view === 'browser' && (
        <DeckBrowser
          onBackToMenu={() => setView('menu')}
          onStartGameWithDeck={() => handleStartGame(2, true)}
        />
      )}

      {view === 'game' && (
        <GamePlay
          numPlayers={numPlayers}
          isAiMode={isAiMode}
          onBackToMenu={() => setView('menu')}
        />
      )}

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
}
