import React, { useEffect, useRef, useState } from 'react';
import { strokeOrderService } from '../../../services/strokeOrderService';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

interface KanjiVGViewerProps {
  character: string;
  size?: number;
  mode?: 'static' | 'animate';
}

interface AnimationState {
  currentIndex: number;
  strokeProgress: number;
  isPlaying: boolean;
}

export const KanjiVGViewer: React.FC<KanjiVGViewerProps> = ({
  character,
  size = 200,
  mode = 'static',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgText, setSvgText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Player controls state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // 0.5, 1, 1.5, 2
  const [showOutline, setShowOutline] = useState<boolean>(true);
  const [showNumbers, setShowNumbers] = useState<boolean>(true);
  const [pathsCount, setPathsCount] = useState<number>(0);

  // Core animation tracker state
  const [animationState, setAnimationState] = useState<AnimationState>({
    currentIndex: 0,
    strokeProgress: 0,
    isPlaying: false,
  });

  const lastTimeRef = useRef<number>(0);

  // Fetch the SVG source when character shifts
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setSvgText('');
    setIsPlaying(false);
    setPathsCount(0);
    setAnimationState({
      currentIndex: 0,
      strokeProgress: 0,
      isPlaying: false,
    });
    
    strokeOrderService.fetchKanjiVgSvg(character)
      .then((data) => {
        if (active) {
          setSvgText(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Không thể tải dữ liệu nét vẽ.');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [character]);

  // Set paths count once SVG loaded
  useEffect(() => {
    if (loading || error || !svgText || !containerRef.current) return;
    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;
    
    const mainGroup = svgElement.querySelector('[id*="StrokePaths"]');
    if (mainGroup) {
      const paths = mainGroup.querySelectorAll('path');
      setPathsCount(paths.length);
    } else {
      const paths = svgElement.querySelectorAll('path');
      setPathsCount(paths.length);
    }
  }, [svgText, loading, error]);

  // Auto start animation if mode is "animate" on load
  useEffect(() => {
    if (mode === 'animate' && !loading && !error && svgText) {
      // Auto play on character/mode load
      const timer = setTimeout(() => {
        setIsPlaying(true);
        setAnimationState({
          currentIndex: 0,
          strokeProgress: 0,
          isPlaying: true,
        });
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsPlaying(false);
      setAnimationState({
        currentIndex: 0,
        strokeProgress: 0,
        isPlaying: false,
      });
    }
  }, [mode, loading, error, svgText, character]);

  // RequestAnimationFrame Tick loop
  useEffect(() => {
    if (mode !== 'animate' || !isPlaying || loading || error || !svgText || pathsCount === 0) return;
    
    let animFrameId: number;
    lastTimeRef.current = performance.now();
    
    const tick = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;
      
      setAnimationState(prev => {
        if (prev.currentIndex >= pathsCount) {
          setIsPlaying(false);
          return { ...prev, isPlaying: false, strokeProgress: 1 };
        }
        
        // Base stroke duration: 600ms, pause gap: 150ms. Scale inversely with speed.
        const duration = 650 / speed;
        const gap = 150 / speed;
        
        let { currentIndex, strokeProgress } = prev;
        
        // Progress incremented by fraction of duration elapsed
        const progressIncrement = delta / duration;
        strokeProgress += progressIncrement;
        
        // If stroke is fully drawn and we finished the gap period
        if (strokeProgress >= 1 + gap / duration) {
          currentIndex += 1;
          strokeProgress = 0;
          
          if (currentIndex >= pathsCount) {
            setIsPlaying(false);
            return { ...prev, currentIndex: pathsCount, strokeProgress: 1, isPlaying: false };
          }
        }
        
        return {
          ...prev,
          currentIndex,
          strokeProgress
        };
      });
      
      animFrameId = requestAnimationFrame(tick);
    };
    
    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [mode, isPlaying, speed, loading, error, svgText, pathsCount]);

  // Synchronize state values onto actual SVG DOM styles
  useEffect(() => {
    if (loading || error || !svgText || !containerRef.current) return;
    
    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    // Standardize SVG dimensions and aspect ratio
    svgElement.setAttribute('width', '100%');
    svgElement.setAttribute('height', '100%');
    svgElement.setAttribute('viewBox', '0 0 109 109');

    // Retrieve all stroke paths inside the main group
    let mainGroup = svgElement.querySelector('[id*="StrokePaths"]');
    if (!mainGroup) {
      // Fallback if KanjiVG id format deviates
      mainGroup = svgElement;
    }
    
    const paths = Array.from(mainGroup.querySelectorAll('path')).filter(
      p => p.parentElement?.id !== 'kvg:OutlinePaths'
    );

    // 1. Create or Update transparent Outline Paths
    let outlineGroup = svgElement.querySelector('#kvg\\:OutlinePaths');
    if (!outlineGroup) {
      outlineGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      outlineGroup.setAttribute('id', 'kvg:OutlinePaths');
      
      // Clone all paths from mainGroup
      paths.forEach((p) => {
        const clonedPath = p.cloneNode(true) as SVGPathElement;
        clonedPath.removeAttribute('id');
        clonedPath.style.stroke = 'var(--color-outline, #f1f5f9)';
        clonedPath.style.strokeWidth = '3';
        clonedPath.style.fill = 'none';
        clonedPath.style.strokeLinecap = 'round';
        clonedPath.style.strokeLinejoin = 'round';
        outlineGroup!.appendChild(clonedPath);
      });
      
      // Insert outlineGroup as underlay (before mainGroup)
      svgElement.insertBefore(outlineGroup, mainGroup);
    }

    // Toggle outline visibility
    (outlineGroup as SVGElement).style.display = (mode === 'animate' && showOutline) ? 'block' : 'none';
    
    // Resolve Light/Dark Mode color dynamically
    const isDarkMode = document.documentElement.classList.contains('dark');
    const outlineColor = isDarkMode ? '#27272a' : '#f1f5f9'; // zinc-800 or slate-100
    const clonedPaths = outlineGroup.querySelectorAll('path');
    clonedPaths.forEach(p => {
      (p as SVGPathElement).style.stroke = outlineColor;
    });

    // 2. Synchronize main paths (Animate or Static)
    paths.forEach((path, index) => {
      const length = path.getTotalLength();
      
      // Basic styling
      path.style.stroke = 'var(--color-stroke, #6366f1)'; // Indigo primary
      path.style.strokeWidth = '3';
      path.style.fill = 'none';
      path.style.strokeLinecap = 'round';
      path.style.strokeLinejoin = 'round';
      path.style.strokeDasharray = `${length}`;

      if (mode === 'static') {
        path.style.strokeDashoffset = '0';
        path.style.transition = 'none';
      } else {
        // Active Animator syncing
        if (index < animationState.currentIndex) {
          // Previously fully drawn
          path.style.strokeDashoffset = '0';
          path.style.transition = 'none';
        }
        else if (index === animationState.currentIndex) {
          // Currenly drawing
          const currentProgress = Math.min(1, animationState.strokeProgress);
          path.style.strokeDashoffset = `${length * (1 - currentProgress)}`;
          path.style.transition = 'none';
        }
        else {
          // Future strokes hidden
          path.style.strokeDashoffset = `${length}`;
          path.style.transition = 'none';
        }
      }
    });

    // 3. Sync numbers (StrokeNumbers group)
    const textGroup = svgElement.querySelector('[id*="StrokeNumbers"]');
    if (textGroup) {
      (textGroup as SVGElement).style.display = showNumbers ? 'block' : 'none';
      
      const textElements = textGroup.querySelectorAll('text');
      textElements.forEach((text, idx) => {
        text.setAttribute('fill', '#ef4444'); // Red stroke numbers
        text.setAttribute('font-size', '6.5');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-family', 'monospace');
        
        if (mode === 'animate') {
          // Only show number labels when stroke is drawn or drawing
          if (idx <= animationState.currentIndex) {
            (text as SVGTextElement).style.display = 'block';
          } else {
            (text as SVGTextElement).style.display = 'none';
          }
        } else {
          (text as SVGTextElement).style.display = 'block';
        }
      });
    }

  }, [svgText, loading, error, mode, showOutline, showNumbers, animationState]);

  // Control Actions
  const handlePlayPause = () => {
    if (pathsCount === 0) return;
    const isFinished = animationState.currentIndex >= pathsCount;
    
    setIsPlaying(!isPlaying);
    
    setAnimationState(prev => {
      const nextIndex = isFinished ? 0 : prev.currentIndex;
      const nextProgress = isFinished ? 0 : prev.strokeProgress;
      return {
        ...prev,
        currentIndex: nextIndex,
        strokeProgress: nextProgress,
        isPlaying: !isPlaying
      };
    });
  };

  const handleReplay = () => {
    setIsPlaying(true);
    setAnimationState({
      currentIndex: 0,
      strokeProgress: 0,
      isPlaying: true
    });
  };

  const handlePrevStroke = () => {
    setIsPlaying(false);
    setAnimationState(prev => {
      const nextIndex = Math.max(0, prev.currentIndex - 1);
      return {
        ...prev,
        currentIndex: nextIndex,
        strokeProgress: 0,
        isPlaying: false
      };
    });
  };

  const handleNextStroke = () => {
    setIsPlaying(false);
    setAnimationState(prev => {
      if (prev.currentIndex >= pathsCount) return prev;
      
      // If we are currently halfway through a stroke, skip to the end of it
      if (prev.strokeProgress > 0 && prev.currentIndex < pathsCount) {
        return {
          ...prev,
          strokeProgress: 1
        };
      }
      
      const nextIndex = Math.min(pathsCount, prev.currentIndex + 1);
      return {
        ...prev,
        currentIndex: nextIndex,
        strokeProgress: 0,
        isPlaying: false
      };
    });
  };

  const currentDisplayStroke = Math.min(pathsCount, animationState.currentIndex + 1);

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto select-none">
      {/* Control panel title */}
      {mode === 'static' && (
        <div className="flex justify-between items-center w-full mb-3 no-print">
          <span className="text-xs font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-wider">
            KanjiVG Stroke order
          </span>
          {!error && !loading && (
            <button
              onClick={() => setShowNumbers(!showNumbers)}
              className="flex items-center gap-1 px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
            >
              {showNumbers ? (
                <>
                  <EyeOff className="w-3 h-3" /> Ẩn số nét
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3" /> Hiện số nét
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Grid container with handwriting guide lines */}
      <div
        className="relative bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex items-center justify-center overflow-hidden"
        style={{ width: size + 24, height: size + 24 }}
      >
        {/* Dash lines grid background (Kanji grid) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border border-neutral-150/40 dark:border-neutral-850/40 relative rounded-2xl">
            {/* Horizontal line */}
            <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-neutral-250 dark:border-neutral-800" />
            {/* Vertical line */}
            <div className="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-neutral-250 dark:border-neutral-800" />
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 bg-white/90 dark:bg-zinc-950/90">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            <span className="text-[10px] text-neutral-450 dark:text-neutral-500 font-bold">
              Đang tải nét vẽ...
            </span>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 bg-white dark:bg-zinc-950">
            <span className="text-4xl font-bold text-neutral-300 dark:text-neutral-800 mb-1 select-none">
              {character}
            </span>
            <span className="text-[9px] text-amber-600 dark:text-amber-500 font-bold bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded">
              Không có sơ đồ nét
            </span>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="w-full h-full p-4 flex items-center justify-center"
            style={{ 
              width: size, 
              height: size,
              '--color-stroke': 'var(--color-text-primary, #6366f1)' 
            } as React.CSSProperties}
            dangerouslySetInnerHTML={{ __html: svgText }}
          />
        )}
      </div>

      {/* Dynamic Player Controls (Only visible in animate mode) */}
      {mode === 'animate' && !loading && !error && (
        <div className="w-full mt-4 space-y-3 bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 no-print">
          
          {/* Row 1: Prev, Play/Pause, Next, Replay, Stroke Index Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevStroke}
                disabled={animationState.currentIndex === 0}
                className="p-1.5 bg-white dark:bg-zinc-800 hover:bg-neutral-100 dark:hover:bg-zinc-750 text-neutral-700 dark:text-neutral-300 rounded-lg border border-neutral-200 dark:border-neutral-750 cursor-pointer disabled:opacity-40 transition-colors"
                title="Lùi 1 nét"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              
              <button
                onClick={handlePlayPause}
                className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer transition-colors"
                title={isPlaying ? 'Tạm dừng' : 'Chạy tự động'}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
              </button>
              
              <button
                onClick={handleNextStroke}
                disabled={animationState.currentIndex >= pathsCount}
                className="p-1.5 bg-white dark:bg-zinc-800 hover:bg-neutral-100 dark:hover:bg-zinc-750 text-neutral-700 dark:text-neutral-300 rounded-lg border border-neutral-200 dark:border-neutral-750 cursor-pointer disabled:opacity-40 transition-colors"
                title="Tiến 1 nét"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleReplay}
                className="p-1.5 bg-white dark:bg-zinc-800 hover:bg-neutral-100 dark:hover:bg-zinc-750 text-neutral-700 dark:text-neutral-300 rounded-lg border border-neutral-200 dark:border-neutral-750 cursor-pointer transition-colors"
                title="Chạy lại từ đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400">
              Nét: {currentDisplayStroke} / {pathsCount}
            </span>
          </div>

          {/* Row 2: Speed select, Toggle numbers, Toggle Outline */}
          <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 pt-2.5">
            {/* Speed selectors */}
            <div className="flex gap-1">
              {[0.5, 1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                    speed === s
                      ? 'bg-neutral-200 dark:bg-zinc-700 text-neutral-900 dark:text-neutral-100'
                      : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Toggle guides buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowOutline(!showOutline)}
                className={`text-[9px] font-bold transition-colors cursor-pointer ${
                  showOutline ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-400'
                }`}
              >
                {showOutline ? 'Ẩn nền mờ' : 'Hiện nền mờ'}
              </button>
              <button
                onClick={() => setShowNumbers(!showNumbers)}
                className={`text-[9px] font-bold transition-colors cursor-pointer ${
                  showNumbers ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-400'
                }`}
              >
                {showNumbers ? 'Ẩn số nét' : 'Hiện số nét'}
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default KanjiVGViewer;
