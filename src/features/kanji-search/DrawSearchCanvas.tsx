import React, { useRef, useState, useEffect, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

export interface DrawStroke {
  points: Point[];
  createdAt: number;
}

interface DrawSearchCanvasProps {
  size?: number;
  onSearch: (strokes: DrawStroke[]) => void;
}

export const DrawSearchCanvas: React.FC<DrawSearchCanvasProps> = ({
  size = 280,
  onSearch,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<DrawStroke[]>([]);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);

  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid guide
    ctx.strokeStyle = 'rgba(99,102,241,0.12)';
    ctx.lineWidth = 1 * dpr;
    ctx.setLineDash([4 * dpr, 4 * dpr]);

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();

    ctx.setLineDash([]);

    // Draw strokes
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 6 * dpr;

    for (const stroke of strokes) {
      if (stroke.points.length < 1) continue;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x * dpr, stroke.points[0].y * dpr);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x * dpr, stroke.points[i].y * dpr);
      }
      ctx.stroke();
    }

    // Draw current stroke
    if (currentPoints.length > 0) {
      ctx.beginPath();
      ctx.moveTo(currentPoints[0].x * dpr, currentPoints[0].y * dpr);
      for (let i = 1; i < currentPoints.length; i++) {
        ctx.lineTo(currentPoints[i].x * dpr, currentPoints[i].y * dpr);
      }
      ctx.stroke();
    }
  }, [strokes, currentPoints, dpr]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const getCoord = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDrawing(true);
    setCurrentPoints([getCoord(e)]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    setCurrentPoints(prev => [...prev, getCoord(e)]);
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentPoints.length > 1) {
      setStrokes(prev => [...prev, { points: currentPoints, createdAt: Date.now() }]);
    }
    setCurrentPoints([]);
  };

  const handleClear = () => {
    setStrokes([]);
    setCurrentPoints([]);
  };

  const handleUndo = () => {
    setStrokes(prev => prev.slice(0, -1));
  };

  const handleSearch = () => {
    onSearch(strokes);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-955 shadow-inner">
        <canvas
          ref={canvasRef}
          width={size * dpr}
          height={size * dpr}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="block cursor-crosshair"
          style={{ width: size, height: size, touchAction: 'none' }}
        />
      </div>

      {/* Stroke count indicator */}
      <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
        Số nét đã vẽ: <span className="text-indigo-600 dark:text-indigo-400 font-black">{strokes.length}</span>
      </p>

      {/* Toolbar */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          onClick={handleUndo}
          disabled={strokes.length === 0}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          Hoàn tác
        </button>
        <button
          onClick={handleClear}
          disabled={strokes.length === 0}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-655 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          Xóa nét
        </button>
        <button
          onClick={handleSearch}
          disabled={strokes.length === 0}
          className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 dark:bg-indigo-650 dark:hover:bg-indigo-700 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          Tìm kiếm
        </button>
      </div>
    </div>
  );
};

export default DrawSearchCanvas;
