import React, { useRef, useState, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
}

interface KanjiWritingCanvasProps {
  character: string;
  canvasSize?: number;
  mode?: 'guided' | 'free';
  onStrokeComplete?: () => void;
}

export const KanjiWritingCanvas: React.FC<KanjiWritingCanvasProps> = ({
  character,
  canvasSize = 256,
  mode = 'guided',
  onStrokeComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [showGrid, setShowGrid] = useState(true);
  const [showHint, setShowHint] = useState(mode === 'guided');

  // Sync hint state with mode changes
  useEffect(() => {
    setShowHint(mode === 'guided');
  }, [mode]);

  // Reset strokes and currentStroke when character or mode changes
  useEffect(() => {
    setStrokes([]);
    setCurrentStroke([]);
  }, [character, mode]);

  const strokeColor = '#4f46e5'; // indigo-600
  const strokeWidth = 8;

  // Initialize and redraw canvas whenever state changes
  useEffect(() => {
    redrawCanvas();
  }, [strokes, currentStroke, showGrid, showHint, character, canvasSize, mode]);

  // Redraw logic
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Grid Guide (Behind everything)
    if (showGrid) {
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)'; // light indigo
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Diagonal lines
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(canvas.width, 0);
      ctx.lineTo(0, canvas.height);
      ctx.stroke();

      ctx.setLineDash([]); // Reset line dash
    }

    // 2. Draw Sample Hint Character (Semi-transparent) - Only allowed in guided mode
    if (mode === 'guided' && showHint && character) {
      ctx.fillStyle = 'rgba(148, 163, 184, 0.15)'; // slate-400 opacity 15%
      ctx.font = `bold ${canvasSize * 0.7}px 'Noto Sans JP', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(character, canvas.width / 2, canvas.height / 2 + 5);
    }

    // 3. Draw All Completed Strokes
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    strokes.forEach(stroke => {
      if (stroke.points.length < 1) return;
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });

    // 4. Draw Current Active Stroke
    if (currentStroke.length > 0) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.beginPath();
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      for (let i = 1; i < currentStroke.length; i++) {
        ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
      }
      ctx.stroke();
    }
  };

  // Helper: Get coordinate point inside Canvas
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    
    // Scale standard coordinates appropriately based on canvas high-dpi scaling
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  // Draw Start
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pt = getCoordinates(e);
    if (!pt) return;
    
    setIsDrawing(true);
    setCurrentStroke([pt]);
  };

  // Draw Move
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const pt = getCoordinates(e);
    if (!pt) return;
    
    setCurrentStroke(prev => [...prev, pt]);
  };

  // Draw End
  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (currentStroke.length > 1) {
      setStrokes(prev => [...prev, {
        points: currentStroke,
        color: strokeColor,
        width: strokeWidth
      }]);
      if (onStrokeComplete) {
        onStrokeComplete();
      }
    }
    setCurrentStroke([]);
  };

  // Actions
  const handleClear = () => {
    setStrokes([]);
    setCurrentStroke([]);
  };

  const handleUndo = () => {
    setStrokes(prev => prev.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Canvas Box */}
      <div className="relative border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="touch-none cursor-crosshair block"
          style={{ width: `${canvasSize}px`, height: `${canvasSize}px` }}
        />
      </div>

      {/* Toolbar controls */}
      <div className="flex gap-2 justify-center flex-wrap w-full max-w-[280px]">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            showGrid
              ? 'bg-slate-100 border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
              : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50'
          }`}
          title="Bật/Tắt Khung ô lưới"
        >
          Khung lưới
        </button>

        {mode === 'guided' && (
          <button
            onClick={() => setShowHint(!showHint)}
            className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              showHint
                ? 'bg-slate-100 border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
                : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50'
            }`}
            title="Bật/Tắt Chữ mẫu mờ"
          >
            Chữ mẫu
          </button>
        )}

        <button
          onClick={handleUndo}
          disabled={strokes.length === 0}
          className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-colors cursor-pointer"
          title="Hoàn tác nét vẽ"
        >
          Hoàn tác
        </button>

        <button
          onClick={handleClear}
          disabled={strokes.length === 0 && currentStroke.length === 0}
          className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-colors cursor-pointer"
          title="Xóa nét vẽ"
        >
          Xóa nét
        </button>
      </div>
    </div>
  );
};

export default KanjiWritingCanvas;
