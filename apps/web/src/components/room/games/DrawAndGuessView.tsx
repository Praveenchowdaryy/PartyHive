'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  DrawAndGuessPublicState,
  DrawAndGuessPrivateState,
  DrawStroke,
  DrawPoint,
} from '@partyhive/shared';
import {
  Palette,
  Eraser,
  Trash2,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  HelpCircle,
  Eye,
} from 'lucide-react';

interface DrawAndGuessViewProps {
  publicState: DrawAndGuessPublicState;
  privateState: DrawAndGuessPrivateState;
  myPlayerId: string;
  onSendAction: (type: string, payload: any) => void;
  onSendStroke: (stroke: DrawStroke) => void;
  onClearCanvas: () => void;
  onSendGuess?: (text: string) => void;
}

const PALETTE = [
  '#FFFFFF', // White
  '#000000', // Black
  '#FF5E62', // Coral Red
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber Yellow
  '#8B5CF6', // Electric Violet
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#84CC16', // Lime
];

export const DrawAndGuessView: React.FC<DrawAndGuessViewProps> = ({
  publicState,
  privateState,
  myPlayerId,
  onSendAction,
  onSendStroke,
  onClearCanvas,
  onSendGuess,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [quickGuessInput, setQuickGuessInput] = useState('');

  // Keep track of active stroke ID and last point for real-time streaming
  const activeStrokeId = useRef<string>('');
  const lastPoint = useRef<DrawPoint | null>(null);
  const lastDrawnStrokeCount = useRef<number>(0);

  const isDrawer = privateState.isDrawer;

  // Draw a single stroke onto the canvas context
  const drawSingleStroke = useCallback((ctx: CanvasRenderingContext2D, stroke: DrawStroke, width: number, height: number) => {
    if (!stroke.points || stroke.points.length === 0) return;

    ctx.beginPath();
    ctx.strokeStyle = stroke.isEraser ? '#0F1626' : stroke.color;
    ctx.lineWidth = stroke.isEraser ? stroke.size * 3 : stroke.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const firstPt = stroke.points[0];
    ctx.moveTo(firstPt.x * width, firstPt.y * height);

    if (stroke.points.length === 1) {
      // Single dot tap
      ctx.lineTo(firstPt.x * width + 0.5, firstPt.y * height + 0.5);
    } else {
      for (let i = 1; i < stroke.points.length; i++) {
        const pt = stroke.points[i];
        ctx.lineTo(pt.x * width, pt.y * height);
      }
    }
    ctx.stroke();
  }, []);

  // Full canvas redraw (only when canvas resizes or strokes array is reset/cleared)
  const fullRedraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0F1626';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const stroke of publicState.strokes) {
      drawSingleStroke(ctx, stroke, canvas.width, canvas.height);
    }
    lastDrawnStrokeCount.current = publicState.strokes.length;
  }, [publicState.strokes, drawSingleStroke]);

  // Fast incremental sync: If new strokes were appended, draw only the new ones!
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentCount = publicState.strokes.length;
    const prevCount = lastDrawnStrokeCount.current;

    if (currentCount === 0) {
      // Canvas was cleared
      ctx.fillStyle = '#0F1626';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      lastDrawnStrokeCount.current = 0;
      return;
    }

    if (currentCount < prevCount) {
      // State reset or round changed, full redraw
      fullRedraw();
      return;
    }

    // Incrementally draw only new strokes
    for (let i = prevCount; i < currentCount; i++) {
      drawSingleStroke(ctx, publicState.strokes[i], canvas.width, canvas.height);
    }
    lastDrawnStrokeCount.current = currentCount;
  }, [publicState.strokes, drawSingleStroke, fullRedraw]);

  // Adjust canvas resolution to parent container
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      fullRedraw();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fullRedraw]);

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent): DrawPoint | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
    };
  };

  // Start Drawing: initiates a stroke ID and streams immediately
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawer || publicState.phase !== 'PLAYING') return;
    
    // Prevent default scroll on touch devices
    if ('touches' in e && e.cancelable) {
      e.preventDefault();
    }

    const pt = getCanvasCoords(e);
    if (!pt) return;

    setIsDrawing(true);
    activeStrokeId.current = `s_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    lastPoint.current = pt;

    // Draw locally immediately
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = isEraser ? '#0F1626' : selectedColor;
        ctx.lineWidth = (isEraser ? brushSize * 3 : brushSize) * (window.devicePixelRatio || 1);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(pt.x * canvas.width, pt.y * canvas.height);
        ctx.lineTo(pt.x * canvas.width + 0.1, pt.y * canvas.height + 0.1);
        ctx.stroke();
      }
    }

    // Emit initial dot immediately so teammates see touch start instantly
    const initialStroke: DrawStroke = {
      id: activeStrokeId.current,
      points: [pt],
      color: selectedColor,
      size: brushSize * (window.devicePixelRatio || 1),
      isEraser,
    };
    onSendStroke(initialStroke);
  };

  // Move Drawing: stream segments in real-time as finger/mouse moves
  const drawMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !isDrawer || publicState.phase !== 'PLAYING') return;

    if ('touches' in e && e.cancelable) {
      e.preventDefault();
    }

    const pt = getCanvasCoords(e);
    if (!pt || !lastPoint.current) return;

    const prevPt = lastPoint.current;

    // Skip redundant points
    const dist = Math.hypot(pt.x - prevPt.x, pt.y - prevPt.y);
    if (dist < 0.002) return;

    // Render locally immediately
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = isEraser ? '#0F1626' : selectedColor;
        ctx.lineWidth = (isEraser ? brushSize * 3 : brushSize) * (window.devicePixelRatio || 1);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(prevPt.x * canvas.width, prevPt.y * canvas.height);
        ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
        ctx.stroke();
      }
    }

    // Stream line segment to teammates in real time!
    const segmentStroke: DrawStroke = {
      id: activeStrokeId.current,
      points: [prevPt, pt],
      color: selectedColor,
      size: brushSize * (window.devicePixelRatio || 1),
      isEraser,
    };
    onSendStroke(segmentStroke);

    lastPoint.current = pt;
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    lastPoint.current = null;
    activeStrokeId.current = '';
  };

  const handleQuickGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickGuessInput.trim()) return;
    if (onSendGuess) {
      onSendGuess(quickGuessInput.trim());
    } else {
      onSendAction('guess', { guess: quickGuessInput.trim() });
    }
    setQuickGuessInput('');
  };

  return (
    <div className="space-y-3.5 select-none">
      {/* Drawer / Word Status Header */}
      <div className="p-4 rounded-2xl bg-[#151821] border-2 border-black shadow-[4px_4px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#1E2330] border-2 border-black shadow-[2px_2px_0px_#000]">
            <Palette className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black text-yellow-400 tracking-wider block font-mono">
              {isDrawer ? '🎨 YOU ARE THE DRAWER!' : `👀 ${publicState.drawerNickname || 'Teammate'} is drawing`}
            </span>
            <div className="text-base sm:text-lg font-black text-white font-display">
              {isDrawer ? (
                <span className="text-yellow-400 tracking-wide font-mono">
                  WORD: {privateState.secretWord || 'Choosing word...'}
                </span>
              ) : (
                <span className="font-mono tracking-widest text-yellow-400 text-xl font-black">
                  {publicState.hintMask || '_ '.repeat(publicState.wordLength || 4)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Guesser Status Indicator */}
        {!isDrawer && (
          <div>
            {privateState.hasGuessed ? (
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-arcade-mint text-black border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black uppercase animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                <span>You guessed correctly! 🎉</span>
              </div>
            ) : (
              <div className="text-xs text-yellow-400 font-mono font-bold flex items-center gap-1.5 bg-[#0B0C10] px-3.5 py-1.5 rounded-xl border border-black shadow-[2px_2px_0px_#000]">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                <span>Type guesses below!</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Word Selection Modal for Drawer */}
      {isDrawer && publicState.isSelectingWord && privateState.wordChoices && (
        <div className="p-6 rounded-3xl bg-[#151821] border-2 border-black shadow-[6px_6px_0px_#000] text-center space-y-4 animate-fadeIn">
          <Sparkles className="w-8 h-8 text-yellow-400 mx-auto animate-pulse" />
          <h3 className="text-2xl font-black text-white font-display">Pick a Secret Word to Draw</h3>
          <p className="text-xs text-slate-300 font-medium">
            Choose which word you want teammates to guess:
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {privateState.wordChoices.map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => onSendAction('choose_word', { word: choice })}
                className="px-6 py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer font-display"
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Synchronized Canvas Container (Arcade Display Frame) */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-black shadow-[6px_6px_0px_#000] bg-[#0A0D14] touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={drawMove}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={drawMove}
          onTouchEnd={endDrawing}
          onTouchCancel={endDrawing}
          style={{ touchAction: 'none' }}
          className={`w-full h-[360px] sm:h-[440px] block ${
            isDrawer && publicState.phase === 'PLAYING' ? 'cursor-crosshair' : 'cursor-default'
          }`}
        />

        {/* Round Reveal Overlay */}
        {publicState.roundReveal && (
          <div className="absolute inset-0 bg-[#0B0C10]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3 z-10 animate-fadeIn border-2 border-yellow-400">
            <span className="text-xs uppercase font-black tracking-widest text-slate-400 font-mono">
              ROUND COMPLETE
            </span>
            <h4 className="text-2xl sm:text-4xl font-black text-white font-display">
              The secret word was <span className="text-yellow-400 font-mono underline">{publicState.roundReveal.secretWord}</span>!
            </h4>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {Object.entries(publicState.roundReveal.scoresEarned).map(([pId, pts]) => (
                <span
                  key={pId}
                  className="px-3.5 py-1 rounded-xl bg-arcade-mint text-black border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black uppercase"
                >
                  +{pts} pts
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GUESSER QUICK-GUESS BAR: Sticky under canvas */}
      {!isDrawer && publicState.phase === 'PLAYING' && !privateState.hasGuessed && (
        <form onSubmit={handleQuickGuessSubmit} className="p-2.5 rounded-2xl bg-[#151821] border-2 border-black shadow-[4px_4px_0px_#000] flex gap-2">
          <input
            type="text"
            value={quickGuessInput}
            onChange={(e) => setQuickGuessInput(e.target.value)}
            placeholder="TYPE GUESS HERE (E.G. PIZZA, GUITAR)..."
            className="flex-1 px-4 py-3 rounded-xl bg-[#0B0C10] border-2 border-black text-white text-sm font-black uppercase tracking-wider placeholder-slate-600 focus:outline-none focus:border-yellow-400 font-mono shadow-[inset_2px_2px_0px_#000]"
            autoComplete="off"
            autoCapitalize="characters"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-all flex items-center gap-1.5 cursor-pointer shrink-0 font-display"
          >
            <span>GUESS</span>
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      )}

      {/* Drawing Toolbar (Only active for Drawer) */}
      {isDrawer && publicState.phase === 'PLAYING' && (
        <div className="p-3.5 rounded-2xl bg-[#151821] border-2 border-black shadow-[4px_4px_0px_#000] flex flex-wrap items-center justify-between gap-3">
          {/* Colors */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => { setSelectedColor(c); setIsEraser(false); }}
                style={{ backgroundColor: c }}
                className={`w-7 h-7 rounded-full border-2 border-black transition-transform cursor-pointer shrink-0 shadow-[2px_2px_0px_#000] ${
                  selectedColor === c && !isEraser
                    ? 'scale-125 ring-2 ring-yellow-400 ring-offset-2 ring-offset-black'
                    : 'hover:scale-110'
                }`}
                title={`Color ${c}`}
              />
            ))}
          </div>

          {/* Tools & Size */}
          <div className="flex items-center gap-2">
            {[2, 5, 10].map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setBrushSize(sz)}
                className={`px-3 py-1.5 rounded-xl border-2 border-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer font-mono ${
                  brushSize === sz && !isEraser
                    ? 'bg-yellow-400 text-black shadow-[2px_2px_0px_#000]'
                    : 'bg-[#1E2330] text-slate-300 shadow-[2px_2px_0px_#000] hover:text-white'
                }`}
              >
                {sz === 2 ? 'Fine' : sz === 5 ? 'Med' : 'Thick'}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setIsEraser(!isEraser)}
              className={`p-2 rounded-xl border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] ${
                isEraser
                  ? 'bg-yellow-400 text-black'
                  : 'bg-[#1E2330] text-slate-300 hover:text-white'
              }`}
              title="Eraser"
            >
              <Eraser className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={onClearCanvas}
              className="p-2 rounded-xl border-2 border-black bg-[#1E2330] text-rose-400 hover:bg-rose-950 transition-all cursor-pointer shadow-[2px_2px_0px_#000]"
              title="Clear Canvas"
            >
              <Trash2 className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
