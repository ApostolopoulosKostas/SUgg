import React, { useState, useEffect } from 'react';
import { CardInfo } from '../types';
import { AIRPLANES_DECK } from '../data/airplanesDeck';
import { CardView } from './CardView';
import { soundFx } from '../utils/audio';
import { ArrowLeft, Grid, Search, Sparkles } from 'lucide-react';

interface DeckBrowserProps {
  onBackToMenu: () => void;
  onStartGameWithDeck?: () => void;
}

const QUARTET_NAMES: Record<string, string> = {
  A: 'Fighters A',
  B: 'Reconnaissance B',
  C: 'Trainers C',
  D: 'Strike Fighters D',
  E: 'Transports E',
  F: 'Recon & EW F',
  G: 'Tankers & Transports G',
  H: 'Strike & Bombers H',
};

export const DeckBrowser: React.FC<DeckBrowserProps> = ({
  onBackToMenu,
  onStartGameWithDeck,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGridModal, setShowGridModal] = useState(false);

  const cards = AIRPLANES_DECK;
  const currentCard = cards[currentIndex];

  const handleNext = () => {
    soundFx.playCardFlip();
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    soundFx.playCardFlip();
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleSelectCardIndex = (index: number) => {
    soundFx.playCardFlip();
    setCurrentIndex(index);
    setShowGridModal(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') {
        if (showGridModal) setShowGridModal(false);
        else onBackToMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGridModal]);

  const filteredCards = cards.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="deck-browser-container" className="min-h-screen bg-[#10131A] flex flex-col items-center p-3 sm:p-5">
      {/* Top Header */}
      <header className="w-full max-w-4xl flex items-center justify-between py-2 border-b border-neutral-800 mb-4">
        <button
          id="browser-back-btn"
          onClick={() => {
            soundFx.playClick();
            onBackToMenu();
          }}
          className="flex items-center gap-2 text-[#FFD700] hover:text-amber-300 font-pixel text-lg cursor-pointer px-3 py-1.5 rounded-lg hover:bg-neutral-800/60 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>BACK TO MENU</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-homevideo text-xs sm:text-sm text-neutral-400">
            AIRPLANES PACK 1
          </span>
          <span className="bg-neutral-800 text-[#FFD700] font-pixel text-xs px-2 py-0.5 rounded border border-neutral-700">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>

        <button
          id="browser-grid-toggle-btn"
          onClick={() => {
            soundFx.playClick();
            setShowGridModal(!showGridModal);
          }}
          className="flex items-center gap-1.5 bg-[#252A31] hover:bg-[#343B45] text-white font-pixel text-sm px-3 py-1.5 rounded-lg border border-neutral-700 transition-colors cursor-pointer"
        >
          <Grid className="w-4 h-4 text-[#FFD700]" />
          <span className="hidden sm:inline">ALL CARDS</span>
        </button>
      </header>

      {/* Main Showcase */}
      <main className="w-full max-w-md flex flex-col items-center my-auto">
        <CardView
          card={currentCard}
          showBrowserNav={true}
          onPrev={handlePrev}
          onHome={onBackToMenu}
          onNext={handleNext}
        />

        {/* Quick info beneath card */}
        <div className="w-full mt-3 bg-[#1C2127] rounded-xl p-3 border border-neutral-800 text-center">
          <p className="font-homevideo text-xs text-neutral-400">
            QUARTET {currentCard.letter}: <span className="text-[#FFD700]">{QUARTET_NAMES[currentCard.letter]}</span>
          </p>
          {currentCard.superUltima && (
            <p className="font-pixel text-xs text-amber-400 mt-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              SUPER ULTIMA TRUMP CARD: Defeats any card except card #1!
            </p>
          )}
          {currentCard.number === 1 && (
            <p className="font-pixel text-xs text-blue-400 mt-1">
              #1 CARD: The only card that can defeat the Super Ultima card!
            </p>
          )}
        </div>
      </main>

      {/* Quick Carousel / Grid Drawer Modal */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C2127] border-2 border-neutral-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="font-pixel text-xl text-[#FFD700]">ALL 32 AIRPLANES</h3>
                <p className="text-xs text-neutral-400 font-homevideo">Click any card to inspect</p>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search code or plane..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1 bg-black/60 border border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD700]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {filteredCards.map((c) => {
                const actualIndex = cards.findIndex((orig) => orig.code === c.code);
                const isSelected = actualIndex === currentIndex;
                return (
                  <button
                    key={c.code}
                    id={`grid-card-${c.code}`}
                    onClick={() => handleSelectCardIndex(actualIndex)}
                    className={`p-2 rounded-xl text-left transition-all border flex flex-col items-center text-center cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-800 border-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.4)]'
                        : 'bg-black/40 border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800/40'
                    }`}
                  >
                    <div className="relative w-16 h-16 rounded overflow-hidden mb-1.5 bg-neutral-900 flex items-center justify-center">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-full h-full object-cover"
                      />
                      <span className={`absolute top-0 left-0 font-pixel text-[11px] px-1 rounded-br ${
                        c.superUltima ? 'bg-amber-500 text-black font-bold' : 'bg-blue-600 text-white'
                      }`}>
                        {c.code}
                      </span>
                    </div>
                    <span className="font-pixel text-xs text-white truncate w-full">
                      {c.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-homevideo truncate w-full">
                      {c.type}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setShowGridModal(false)}
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
