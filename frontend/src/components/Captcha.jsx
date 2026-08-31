import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';

// Characters to use — removed confusing ones: 0, O, 1, l, I
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function generateCode(length = 6) {
  return Array.from({ length }, randomChar).join('');
}

// Exposed via ref: { validate(input) => boolean, refresh() }
const Captcha = forwardRef(function Captcha({ onValidChange, onValueChange }, ref) {
  const canvasRef = useRef(null);
  const [code, setCode]     = useState(() => generateCode());
  const [value, setValue]   = useState('');
  const [status, setStatus] = useState('idle'); // idle | success | error

  // Draw CAPTCHA on canvas whenever `code` changes
  const draw = useCallback((currentCode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Background
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, W, H);

    // Subtle noise dots
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.arc(randomBetween(0, W), randomBetween(0, H), randomBetween(0.5, 2), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${randomBetween(220, 260)}, 40%, 60%, 0.4)`;
      ctx.fill();
    }

    // Noise lines
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(randomBetween(0, W), randomBetween(0, H));
      ctx.lineTo(randomBetween(0, W), randomBetween(0, H));
      ctx.strokeStyle = `hsla(${randomBetween(200, 270)}, 50%, 55%, 0.35)`;
      ctx.lineWidth = randomBetween(0.5, 1.5);
      ctx.stroke();
    }

    // Draw each character individually with tilt + size variation
    const slotW = W / currentCode.length;
    currentCode.split('').forEach((char, i) => {
      const x = slotW * i + slotW / 2;
      const y = H / 2 + randomBetween(-4, 4);
      const angle = randomBetween(-0.45, 0.45); // tilt in radians (≈ ±26°)
      const fontSize = Math.floor(randomBetween(22, 30));

      // Pick from a few fonts for variety
      const fonts = ['Arial', 'Georgia', 'Trebuchet MS', 'Verdana'];
      const font = fonts[Math.floor(Math.random() * fonts.length)];
      const bold = Math.random() > 0.4 ? 'bold ' : '';

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Subtle shadow for depth
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      ctx.font = `${bold}${fontSize}px ${font}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Randomise color between deep indigo and teal
      const hue = Math.floor(randomBetween(220, 270));
      ctx.fillStyle = `hsl(${hue}, 60%, 35%)`;
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });
  }, []);

  useEffect(() => {
    draw(code);
    setValue('');
    setStatus('idle');
    if (onValidChange) onValidChange(false);
    if (onValueChange) onValueChange('');
  }, [code, draw]);

  const refresh = useCallback(() => {
    const next = generateCode();
    setCode(next);
  }, []);

  const validate = useCallback((input) => {
    const ok = input.trim().toLowerCase() === code.toLowerCase();
    setStatus(ok ? 'success' : 'error');
    if (onValidChange) onValidChange(ok);
    return ok;
  }, [code, onValidChange]);

  // Expose refresh + validate to parent via ref
  useImperativeHandle(ref, () => ({ validate, refresh }), [validate, refresh]);

  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    setStatus('idle');
    if (onValidChange) onValidChange(false);
    if (onValueChange) onValueChange(v);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">CAPTCHA Verification</label>
      <div className="flex items-center gap-3">
        {/* Canvas */}
        <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner select-none">
          <canvas
            ref={canvasRef}
            width={180}
            height={56}
            className="block"
            aria-label="CAPTCHA image"
          />
        </div>

        {/* Refresh button */}
        <button
          type="button"
          onClick={refresh}
          title="Get a new CAPTCHA"
          className="p-2 rounded-xl hover:bg-indigo-50 text-indigo-500 hover:text-indigo-700 transition-colors border border-slate-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466L6 13.938V11.5a.5.5 0 0 0-.5-.5H3.062a.5.5 0 0 0-.5.5v3.5a.5.5 0 0 0 .5.5h.938l.111-.111A7.5 7.5 0 0 0 17.5 10.5a.5.5 0 0 0-1 0 6.5 6.5 0 0 1-1.188.924ZM4.688 8.576A5.5 5.5 0 0 1 13.889 6.11L14 6.062V8.5a.5.5 0 0 0 .5.5h2.438a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5h-.938l-.111.111A7.5 7.5 0 0 0 2.5 9.5a.5.5 0 0 0 1 0 6.5 6.5 0 0 1 1.188-.924Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Type the characters above"
        maxLength={6}
        autoComplete="off"
        spellCheck={false}
        className={`w-full border rounded-xl px-4 py-3 text-sm tracking-widest font-mono outline-none transition-all
          focus:ring-2 focus:ring-indigo-300 focus:border-transparent
          ${status === 'success' ? 'border-green-400 bg-green-50' : ''}
          ${status === 'error'   ? 'border-red-400 bg-red-50'   : ''}
          ${status === 'idle'    ? 'border-slate-200'           : ''}
        `}
      />
      {status === 'error'   && <p className="text-xs text-red-500 font-medium">Incorrect CAPTCHA. Please try again.</p>}
      {status === 'success' && <p className="text-xs text-green-600 font-medium">✓ Verified</p>}
    </div>
  );
});

export default Captcha;
