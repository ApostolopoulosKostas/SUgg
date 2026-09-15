import React from 'react';
import { CardInfo } from '../types';
import { formatStatValue } from '../utils/gameLogic';

interface CardViewProps {
  card: CardInfo;
  interactive?: boolean;
  disabled?: boolean;
  selectedStatIndex?: number | null;
  highlightStatIndex?: number | null;
  onSelectStat?: (index: number) => void;
  // Browser controls (from Android CardActivity)
  showBrowserNav?: boolean;
  onPrev?: () => void;
  onHome?: () => void;
  onNext?: () => void;
  compact?: boolean;
  isWinner?: boolean;
}

const STAT_CONFIGS = [
  { bg: '#D93B3B', hoverBg: '#E84A4A', labelColor: '#000000', valueColor: '#000000' }, // Stat 1: SPEED
  { bg: '#2E8B57', hoverBg: '#3AA569', labelColor: '#000000', valueColor: '#000000' }, // Stat 2: AUTONOMY
  { bg: '#8A2BE2', hoverBg: '#9B45EC', labelColor: '#000000', valueColor: '#000000' }, // Stat 3: WINGSPAN
  { bg: '#00A8E8', hoverBg: '#1CBDFD', labelColor: '#000000', valueColor: '#000000' }, // Stat 4: LENGTH
  { bg: '#1F6FD8', hoverBg: '#3483EC', labelColor: '#000000', valueColor: '#000000' }, // Stat 5: WEIGHT
  { bg: '#F39C12', hoverBg: '#F5B041', labelColor: '#000000', valueColor: '#000000' }, // Stat 6: MAX HEIGHT
];

export const CardView: React.FC<CardViewProps> = ({
  card,
  interactive = false,
  disabled = false,
  selectedStatIndex = null,
  highlightStatIndex = null,
  onSelectStat,
  showBrowserNav = false,
  onPrev,
  onHome,
  onNext,
  compact = false,
  isWinner = false,
}) => {
  return (
    <div
      id={`card-${card.code}`}
      className={`relative w-full max-w-[390px] mx-auto rounded-[18px] p-2 transition-all duration-300 ${
        isWinner
          ? 'ring-4 ring-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.5)] scale-[1.02]'
          : 'shadow-2xl'
      } bg-[#252A31] border-2 border-[#737B84]`}
    >
      {/* Metallic Card Face */}
      <div className="rounded-[14px] bg-[#C0C0C0] p-1.5 flex flex-col gap-2 overflow-hidden shadow-inner">
        {/* HEADER BAR */}
        <div
          id={`header-${card.code}`}
          className="h-14 sm:h-16 bg-black rounded-lg flex items-center px-2.5 gap-2.5 shadow-md border border-neutral-800"
        >
          {/* CODE BADGE */}
          <div
            id={`code-badge-${card.code}`}
            className={`w-12 sm:w-14 h-10 sm:h-11 rounded flex items-center justify-center font-pixel text-2xl sm:text-3xl font-bold tracking-wider shrink-0 transition-transform ${
              card.superUltima
                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-[0_0_12px_rgba(255,215,0,0.8)] animate-pulse'
                : 'bg-[#0000FF] text-white'
            }`}
          >
            {card.code}
          </div>

          {/* NAME & TYPE */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h2
              className="font-pixel text-[#FFD700] text-lg sm:text-2xl leading-none font-bold truncate tracking-wide drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
              title={card.name}
            >
              {card.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-pixel text-white text-xs sm:text-sm font-bold uppercase tracking-wider">
                {card.type}
              </span>
              {card.superUltima && (
                <span className="bg-amber-400 text-black font-pixel text-[10px] px-1 rounded font-bold uppercase tracking-widest animate-bounce">
                  SUPER ULTIMA
                </span>
              )}
            </div>
          </div>
        </div>

        {/* IMAGE FRAME */}
        <div
          id={`image-frame-${card.code}`}
          className={`relative w-full ${
            compact ? 'h-40' : 'h-48 sm:h-56'
          } bg-[#1C2127] rounded-lg overflow-hidden border border-neutral-700 shadow-inner flex items-center justify-center`}
        >
          <img
            src={card.image}
            alt={card.name}
            className="w-full h-full object-cover object-center"
            loading="eager"
            onError={(e) => {
              // Fallback placeholder if image not loaded
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />

          {/* Super Ultima banner overlay */}
          {card.superUltima && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-black font-pixel px-2.5 py-0.5 rounded-full text-xs font-black shadow-lg border border-yellow-200 tracking-wider">
              ★ SUPER ULTIMA ★
            </div>
          )}

          {/* Card #1 Special indicator */}
          {card.number === 1 && (
            <div className="absolute top-2 left-2 bg-blue-700 text-white font-pixel px-2 py-0.5 rounded text-[11px] font-bold shadow tracking-wide border border-blue-400">
              #1 TRUMP KILLER
            </div>
          )}

          {/* In-Card Browser Navigation Buttons (from Android CardActivity) */}
          {showBrowserNav && (
            <div className="absolute bottom-2 inset-x-2 flex items-center justify-between pointer-events-auto z-10 px-1">
              <button
                id="browser-prev-btn"
                onClick={onPrev}
                className="w-20 sm:w-22 h-9 bg-[#333333] hover:bg-[#444444] active:bg-[#222222] text-white font-pixel text-sm sm:text-base font-bold rounded shadow-md border border-neutral-600 transition-colors flex items-center justify-center"
              >
                PREV
              </button>
              <button
                id="browser-home-btn"
                onClick={onHome}
                className="w-20 sm:w-22 h-9 bg-[#333333] hover:bg-[#444444] active:bg-[#222222] text-white font-pixel text-xs sm:text-sm font-bold rounded shadow-md border border-neutral-600 transition-colors flex items-center justify-center"
              >
                HOME
              </button>
              <button
                id="browser-next-btn"
                onClick={onNext}
                className="w-20 sm:w-22 h-9 bg-[#333333] hover:bg-[#444444] active:bg-[#222222] text-white font-pixel text-sm sm:text-base font-bold rounded shadow-md border border-neutral-600 transition-colors flex items-center justify-center"
              >
                NEXT
              </button>
            </div>
          )}
        </div>

        {/* STATISTICS GRID (3 rows x 2 columns) */}
        <div id={`stats-grid-${card.code}`} className="grid grid-cols-2 gap-2">
          {card.statistics.map((stat, idx) => {
            const config = STAT_CONFIGS[idx] || STAT_CONFIGS[0];
            const isSelected = selectedStatIndex === idx;
            const isHighlighted = highlightStatIndex === idx;
            const canClick = interactive && !disabled;

            return (
              <button
                key={stat.label}
                id={`stat-card-${idx + 1}`}
                type="button"
                disabled={!canClick}
                onClick={() => canClick && onSelectStat && onSelectStat(idx)}
                style={{ backgroundColor: config.bg }}
                className={`group h-16 sm:h-[72px] rounded-2xl p-1.5 flex flex-col items-center justify-center transition-all duration-200 border-2 ${
                  isHighlighted
                    ? 'border-yellow-300 ring-4 ring-yellow-400 scale-[1.03] shadow-lg z-10'
                    : isSelected
                    ? 'border-white ring-2 ring-white scale-[1.02]'
                    : 'border-black/20'
                } ${
                  canClick
                    ? 'cursor-pointer hover:brightness-110 active:scale-95'
                    : disabled
                    ? 'cursor-default opacity-90'
                    : ''
                }`}
              >
                {/* Stat Label in HomeVideo font */}
                <span className="font-homevideo text-black text-xs sm:text-sm md:text-base font-bold tracking-wider leading-none truncate max-w-full">
                  {stat.label}
                </span>

                {/* Stat Value + Unit in Pixeboy font */}
                <span className="font-pixel text-black text-sm sm:text-base md:text-lg font-bold mt-1 leading-none">
                  {formatStatValue(stat.value)}{' '}
                  <span className="text-[10px] sm:text-xs font-semibold opacity-90">
                    {stat.unit}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
