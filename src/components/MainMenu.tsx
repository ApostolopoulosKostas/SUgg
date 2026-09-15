import React, { useState } from 'react';
import { Play, BookOpen, Eye, Users, Bot, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface MainMenuProps {
  onBrowseDeck: () => void;
  onStartGame: (numPlayers: number, isAiMode: boolean) => void;
  onOpenRules: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onBrowseDeck,
  onStartGame,
  onOpenRules,
}) => {
  const [showPlayOptions, setShowPlayOptions] = useState(false);
  const [numPlayers, setNumPlayers] = useState(2);
  const [isAiMode, setIsAiMode] = useState(true);
  const [soundMuted, setSoundMuted] = useState(false);

  const toggleSound = () => {
    soundFx.enabled = !soundFx.enabled;
    setSoundMuted(!soundFx.enabled);
  };

  return (
    <div
      id="main"
      className="min-h-screen bg-[#10131A] flex flex-col justify-between items-center text-white relative overflow-hidden"
    >
      {/* Sound Toggle (Top Right) */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleSound}
          aria-label="Toggle Sound"
          className="p-2 rounded-full bg-neutral-900/80 border border-neutral-700 text-neutral-400 hover:text-[#FFD700] transition-colors"
        >
          {soundMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* HEADER: Title from activity_main.xml */}
      <header className="pt-10 sm:pt-14 pb-4 flex flex-col items-center text-center px-4">
        <div className="relative">
          <h1
            id="titleText"
            className="font-pixel text-4xl sm:text-6xl text-[#FFD700] tracking-widest font-black drop-shadow-[0_4px_12px_rgba(255,215,0,0.4)]"
          >
            SUPER ULTIMA
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="font-homevideo text-xs sm:text-sm text-neutral-400 tracking-wider">
              RETRO TOP TRUMPS CARD DUEL
            </span>
            <span className="bg-red-600/30 text-red-400 text-[10px] font-pixel px-1.5 py-0.5 rounded border border-red-500/40">
              ΥΠΕΡΑΤΟΥ
            </span>
          </div>
        </div>
      </header>

      {/* CENTER: Pack Selection matching activity_main.xml */}
      <main className="w-full max-w-2xl px-4 flex flex-col items-center my-auto">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 my-6">
          {/* AIRPLANES PACK 1 (Direct from Android airplanesPack1) */}
          <div className="flex flex-col items-center">
            <div
              id="airplanesPack1"
              onClick={() => {
                soundFx.playCardFlip();
                onBrowseDeck();
              }}
              className="relative w-[130px] sm:w-[150px] h-[170px] sm:h-[195px] rounded-[16px] border-2 border-[#FFD700] p-1 shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-105 hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] transition-all cursor-pointer group bg-[#252A31]"
            >
              <div className="w-full h-full rounded-[12px] overflow-hidden relative flex items-center justify-center bg-black">
                {/* Background card texture */}
                <img
                  src="/assets/cards/cardeckbackround.png"
                  alt="Pack Background"
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                {/* Airplane illustration */}
                <img
                  src="/assets/cards/airplane1frontimage.png"
                  alt="Airplanes Pack 1"
                  className="relative z-10 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* 32 Cards Ribbon */}
                <div className="absolute top-2 right-2 z-20 bg-amber-400 text-black font-pixel text-[11px] px-1.5 py-0.5 rounded font-bold shadow">
                  32 CARDS
                </div>

                {/* Inspect Action Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                  <span className="font-pixel text-xs text-white bg-black/80 px-2.5 py-1 rounded-md border border-[#FFD700] flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-[#FFD700]" /> VIEW DECK
                  </span>
                </div>
              </div>
            </div>

            <p
              id="airplanesText"
              className="mt-2 text-[#2B65EC] text-base sm:text-lg font-homevideo font-bold tracking-wider"
            >
              AIRPLANES
            </p>
          </div>

          {/* CARS PACK (Preview as hinted by CarsDeck.java) */}
          <div className="flex flex-col items-center opacity-60">
            <div className="relative w-[130px] sm:w-[150px] h-[170px] sm:h-[195px] rounded-[16px] border-2 border-neutral-600 p-1 bg-neutral-900">
              <div className="w-full h-full rounded-[12px] overflow-hidden relative flex flex-col items-center justify-center bg-neutral-950 p-2 text-center">
                <span className="font-pixel text-xs text-neutral-400 mb-1">PACK 2</span>
                <span className="font-pixel text-sm text-[#FFD700]">SUPER CARS</span>
                <span className="text-[10px] font-homevideo text-neutral-500 mt-2 bg-neutral-800 px-2 py-0.5 rounded">
                  COMING SOON
                </span>
              </div>
            </div>
            <p className="mt-2 text-neutral-500 text-base sm:text-lg font-homevideo font-bold tracking-wider">
              CARS
            </p>
          </div>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm mt-4">
          <button
            onClick={() => {
              soundFx.playClick();
              setShowPlayOptions(true);
            }}
            className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-pixel text-xl rounded-xl shadow-lg border border-red-400 flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>PLAY NOW</span>
          </button>

          <button
            onClick={() => {
              soundFx.playCardFlip();
              onBrowseDeck();
            }}
            className="w-full py-3.5 bg-[#252A31] hover:bg-[#343B45] text-[#FFD700] font-pixel text-lg rounded-xl border border-neutral-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Eye className="w-5 h-5" />
            <span>BROWSE ALL CARDS</span>
          </button>
        </div>
      </main>

      {/* BOTTOM TOOLBAR: Exactly matching activity_main.xml bottomToolbar */}
      <footer
        id="bottomToolbar"
        className="w-full h-[54px] bg-[#FFD700] flex items-center justify-between border-t-2 border-amber-500 shadow-2xl relative z-10"
      >
        {/* PLAY BUTTON (Android: backgroundTint #252A31, textColor #F8C11B17) */}
        <button
          id="playButton"
          onClick={() => {
            soundFx.playClick();
            setShowPlayOptions(true);
          }}
          className="h-full px-6 sm:px-10 bg-[#252A31] hover:bg-[#343B45] text-[#C11B17] font-pixel text-base sm:text-xl font-bold tracking-wider border-r border-amber-600 transition-colors flex items-center justify-center cursor-pointer"
        >
          PLAY
        </button>

        {/* WELCOME TEXT (Android: textColor black, font homevideobold, 24sp) */}
        <div
          id="welcomeText"
          className="flex-1 text-center font-homevideo text-black text-lg sm:text-2xl font-bold tracking-widest uppercase select-none truncate px-2"
        >
          WELCOME
        </div>

        {/* RULES BUTTON (Android: backgroundTint #252A31, textColor #000000) */}
        <button
          id="rulesButton"
          onClick={() => {
            soundFx.playClick();
            onOpenRules();
          }}
          className="h-full px-6 sm:px-10 bg-[#252A31] hover:bg-[#343B45] text-black font-pixel text-base sm:text-xl font-bold tracking-wider border-l border-amber-600 transition-colors flex items-center justify-center cursor-pointer"
        >
          RULES
        </button>
      </footer>

      {/* PLAY OPTIONS DIALOG (matches Android AlertDialog for PLAY GAME) */}
      {showPlayOptions && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C2127] border-2 border-[#FFD700] rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="font-pixel text-2xl text-[#FFD700] text-center mb-1">
              GAME SETUP
            </h3>
            <p className="text-center font-homevideo text-xs text-neutral-400 mb-5">
              Choose your Super Ultima duel mode
            </p>

            {/* Game Mode Choice */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-homevideo text-neutral-300 mb-2">
                  DUEL MODE
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setIsAiMode(true);
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isAiMode
                        ? 'bg-amber-500/20 border-[#FFD700] text-white shadow'
                        : 'bg-[#252A31] border-neutral-700 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Bot className="w-5 h-5 text-[#FFD700]" />
                    <span className="font-pixel text-sm">VS BOT / CPU</span>
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setIsAiMode(false);
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      !isAiMode
                        ? 'bg-amber-500/20 border-[#FFD700] text-white shadow'
                        : 'bg-[#252A31] border-neutral-700 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Users className="w-5 h-5 text-[#FFD700]" />
                    <span className="font-pixel text-sm">PASS & PLAY</span>
                  </button>
                </div>
              </div>

              {/* Number of Players */}
              <div>
                <label className="block text-xs font-homevideo text-neutral-300 mb-2">
                  NUMBER OF PLAYERS (2 - 4)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        soundFx.playClick();
                        setNumPlayers(num);
                      }}
                      className={`py-2 rounded-lg font-pixel text-base border transition-all cursor-pointer ${
                        numPlayers === num
                          ? 'bg-[#FFD700] text-black font-bold border-[#FFD700] shadow'
                          : 'bg-[#252A31] text-neutral-300 border-neutral-700 hover:border-neutral-500'
                      }`}
                    >
                      {num} PLAYERS
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-black/50 p-3 rounded-lg border border-neutral-800 text-[11px] font-homevideo text-neutral-400">
                Deck has 32 cards. Each player starts with {Math.floor(32 / numPlayers)} cards.
                {32 % numPlayers > 0 && ` (${32 % numPlayers} leftover card awarded to round 1 winner)`}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setShowPlayOptions(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-pixel text-sm rounded-lg border border-neutral-700"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  soundFx.playStatSelect();
                  setShowPlayOptions(false);
                  onStartGame(numPlayers, isAiMode);
                }}
                className="px-6 py-2 bg-[#FFD700] hover:bg-amber-400 text-black font-pixel text-base font-bold rounded-lg shadow-lg"
              >
                START DUEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
