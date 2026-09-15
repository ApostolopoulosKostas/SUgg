import React from 'react';
import { X, Trophy, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        id="rules-modal-content"
        className="bg-[#1C2127] border-2 border-[#FFD700] rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-neutral-900 to-neutral-800 border-b border-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#FFD700]" />
            <h2 className="font-pixel text-xl sm:text-2xl text-[#FFD700] tracking-wider">
              SUPER ULTIMA RULES
            </h2>
          </div>
          <button
            id="close-rules-btn"
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-neutral-200 text-sm">
          {/* Card Duel Core */}
          <div className="bg-[#252A31] p-3.5 rounded-xl border border-neutral-700">
            <h3 className="font-pixel text-base text-[#FFD700] mb-1 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              HOW THE DUEL WORKS
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-homevideo">
              Each player draws from their top card. The active player picks one of the 6 statistics:
              <strong className="text-white"> SPEED, AUTONOMY, WINGSPAN, LENGTH, WEIGHT, or MAX HEIGHT</strong>.
              Opponents reveal their cards — the highest value takes all cards into the bottom of their deck and leads the next turn!
            </p>
          </div>

          {/* Super Ultima Rule */}
          <div className="bg-amber-950/30 p-3.5 rounded-xl border border-amber-500/50">
            <h3 className="font-pixel text-base text-amber-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              THE SUPER ULTIMA TRUMP (ΥΠΕΡΑΤΟΥ)
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-homevideo">
              <span className="text-[#FFD700] font-bold">A4 (F-22 Raptor)</span> is the legendary Super Ultima card.
              It automatically defeats cards with numbers <strong className="text-white">2, 3, and 4</strong> regardless of their stats!
            </p>
          </div>

          {/* The Trump Killer Rule */}
          <div className="bg-blue-950/30 p-3.5 rounded-xl border border-blue-500/50">
            <h3 className="font-pixel text-base text-blue-300 mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
              THE #1 TRUMP KILLER EXCEPTION
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-homevideo">
              Super Ultima is invincible against #2, #3, and #4, <strong className="text-yellow-300">BUT</strong> cards numbered
              <span className="text-blue-400 font-bold"> #1</span> (A1, B1, C1, D1, E1, F1, G1, H1) can challenge Super Ultima!
              When facing a #1 card, normal statistic comparison decides the victor.
            </p>
          </div>

          {/* Quartets */}
          <div className="bg-[#252A31] p-3.5 rounded-xl border border-neutral-700">
            <h3 className="font-pixel text-base text-purple-300 mb-1">
              QUARTETS (ΤΕΤΡΑΔΕΣ)
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-homevideo">
              The deck has 8 letter groups (A through H) with 4 airplanes each.
              Collecting all 4 cards of a letter (e.g., A1, A2, A3, A4) forms a complete Quartet!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex justify-end">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="bg-[#FFD700] hover:bg-amber-400 text-black font-pixel text-sm px-6 py-2 rounded-lg font-bold shadow transition-colors"
          >
            GOT IT!
          </button>
        </div>
      </div>
    </div>
  );
};
