import React, { useRef, useEffect, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import { Play, RotateCcw, Loader2 } from 'lucide-react';

interface StrokeOrderViewerProps {
  character: string;
  unicode?: string;
  size?: number;
}

export const StrokeOrderViewer: React.FC<StrokeOrderViewerProps> = ({
  character,
  size = 200,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous writer
    containerRef.current.innerHTML = '';
    writerRef.current = null;
    setLoading(true);
    setError(false);
    setIsAnimating(false);

    try {
      const writer = HanziWriter.create(containerRef.current, character, {
        width: size,
        height: size,
        padding: 12,
        showOutline: true,
        showCharacter: false,
        strokeColor: '#6366f1',
        outlineColor: '#e2e8f0',
        drawingColor: '#6366f1',
        radicalColor: '#818cf8',
        strokeAnimationSpeed: 1.2,
        delayBetweenStrokes: 300,
        charDataLoader: (char: string) => {
          return fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`)
            .then(res => {
              if (!res.ok) throw new Error('Character not found');
              return res.json();
            });
        },
        onLoadCharDataSuccess: () => {
          setLoading(false);
          setError(false);
        },
        onLoadCharDataError: () => {
          setLoading(false);
          setError(true);
        },
      });

      writerRef.current = writer;

      // Auto-play animation on load
      setTimeout(() => {
        if (writerRef.current) {
          setIsAnimating(true);
          writerRef.current.animateCharacter({
            onComplete: () => {
              setIsAnimating(false);
            },
          });
        }
      }, 500);

    } catch {
      setLoading(false);
      setError(true);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      writerRef.current = null;
    };
  }, [character, size]);

  const handleAnimate = () => {
    if (!writerRef.current || isAnimating) return;
    setIsAnimating(true);
    writerRef.current.hideCharacter();
    writerRef.current.animateCharacter({
      onComplete: () => {
        setIsAnimating(false);
      },
    });
  };

  const handleShowCharacter = () => {
    if (!writerRef.current) return;
    writerRef.current.showCharacter();
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      <div className="flex justify-between items-center w-full mb-3">
        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
          Thứ tự nét viết
        </span>
        {!error && !loading && (
          <div className="flex gap-1.5">
            <button
              onClick={handleAnimate}
              disabled={isAnimating}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-500/15 hover:bg-indigo-200 dark:hover:bg-indigo-500/25 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-current" /> Chạy lại
            </button>
            <button
              onClick={handleShowCharacter}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Hiện chữ
            </button>
          </div>
        )}
      </div>

      {/* Writer Container */}
      <div className={`relative bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center overflow-hidden kanji-grid-bg`}
        style={{ width: size + 24, height: size + 24 }}
      >
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 bg-white/80 dark:bg-slate-950/80">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <span className="text-xs text-slate-400 font-medium">Đang tải nét vẽ...</span>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
            <div className="text-7xl font-black font-jp text-slate-200 dark:text-slate-800 select-none">
              {character}
            </div>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-100 dark:bg-amber-500/10 px-2 py-0.5 rounded">
              Không tìm thấy dữ liệu nét vẽ
            </span>
          </div>
        )}

        <div 
          ref={containerRef}
          className="hanzi-writer-container" 
          style={{ width: size, height: size }}
        />
      </div>
      
      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium text-center mt-2 leading-relaxed">
        {error 
          ? "Chữ này chưa có trong cơ sở dữ liệu hanzi-writer." 
          : "Nét vẽ được hiển thị bởi thư viện hanzi-writer (open source)."}
      </p>
    </div>
  );
};
export default StrokeOrderViewer;
