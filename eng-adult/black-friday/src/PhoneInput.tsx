import React, { useState, useEffect, useRef } from 'react';

interface Country {
  code: string;
  flag: string;
  name: string;
  dial: string;
  maxDigits: number | null;
}

const COUNTRIES: Country[] = [
  { code: 'UA', flag: '🇺🇦', name: 'Україна (+380)', dial: '380', maxDigits: 12 },
  { code: 'PL', flag: '🇵🇱', name: 'Польща (+48)', dial: '48', maxDigits: 11 },
  { code: 'DE', flag: '🇩🇪', name: 'Німеччина (+49)', dial: '49', maxDigits: null },
  { code: 'RO', flag: '🇷🇴', name: 'Румунія (+40)', dial: '40', maxDigits: null },
  { code: 'SK', flag: '🇸🇰', name: 'Словаччина (+421)', dial: '421', maxDigits: null },
  { code: 'CZ', flag: '🇨🇿', name: 'Чехія (+420)', dial: '420', maxDigits: null },
  { code: 'GB', flag: '🇬🇧', name: 'UK (+44)', dial: '44', maxDigits: null },
  { code: 'US', flag: '🇺🇸', name: 'США (+1)', dial: '1', maxDigits: 11 },
];

function formatForCountry(digits: string, country: Country): string {
  if (!digits) return '';

  if (digits.length <= country.dial.length) {
    return '+' + digits;
  }

  switch (country.code) {
    case 'UA': {
      const raw = digits.startsWith('380') ? digits.slice(3) : digits;
      const d = raw.substring(0, 9);
      let r = '+380 ';
      if (d.length > 0) r += '(' + d.substring(0, Math.min(2, d.length));
      if (d.length >= 2) r += ') ' + d.substring(2, Math.min(5, d.length));
      if (d.length >= 5) r += '-' + d.substring(5, Math.min(7, d.length));
      if (d.length >= 7) r += '-' + d.substring(7, 9);
      return r;
    }
    case 'PL': {
      const raw = digits.startsWith('48') ? digits.slice(2) : digits;
      const d = raw.substring(0, 9);
      let r = '+48 ';
      if (d.length > 0) r += '(' + d.substring(0, Math.min(3, d.length));
      if (d.length >= 3) r += ') ' + d.substring(3, Math.min(6, d.length));
      if (d.length >= 6) r += '-' + d.substring(6, 9);
      return r;
    }
    case 'US': {
      const raw = digits.startsWith('1') ? digits.slice(1) : digits;
      const d = raw.substring(0, 10);
      let r = '+1 ';
      if (d.length > 0) r += '(' + d.substring(0, Math.min(3, d.length));
      if (d.length >= 3) r += ') ' + d.substring(3, Math.min(6, d.length));
      if (d.length >= 6) r += '-' + d.substring(6, 10);
      return r;
    }
    default: {
      const dialLen = country.dial.length;
      const raw = digits.startsWith(country.dial) ? digits.slice(dialLen) : digits;
      let r = '+' + country.dial;
      if (raw.length > 0) r += ' ' + raw.substring(0, Math.min(3, raw.length));
      if (raw.length > 3) r += ' ' + raw.substring(3, Math.min(6, raw.length));
      if (raw.length > 6) r += ' ' + raw.substring(6, Math.min(10, raw.length));
      return r;
    }
  }
}

function detectCountry(digits: string): Country | null {
  if (digits.startsWith('380') || digits.startsWith('0')) {
    return COUNTRIES.find(c => c.code === 'UA') || null;
  }
  const sorted = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
  for (const c of sorted) {
    if (digits.startsWith(c.dial)) return c;
  }
  return null;
}

function isPhoneValid(digits: string, country: Country): boolean {
  if (country.code === 'UA') {
    if (digits.length !== 12) return false;
    const operator = digits.substring(3, 5);
    const validOps = ['50', '63', '66', '67', '68', '73', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
    return validOps.includes(operator);
  }
  if (country.code === 'PL') return digits.length === 11;
  if (country.code === 'US') return digits.length === 11;
  return digits.length >= 9 && digits.length <= 15;
}

interface Props {
  value: string;
  onChange: (phone: string, isValid: boolean) => void;
  disabled?: boolean;
  initialCountry?: string;
  theme?: 'dark' | 'light';
}

export default function PhoneInput({
  value,
  onChange,
  disabled = false,
  initialCountry = 'UA',
  theme = 'dark',
}: Props) {
  const [country, setCountry] = useState<Country>(
    () => COUNTRIES.find(c => c.code === initialCountry) || COUNTRIES[0]
  );
  const [display, setDisplay] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialCountry) {
      const found = COUNTRIES.find(c => c.code === initialCountry);
      if (found) setCountry(found);
    }
  }, [initialCountry]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    let digits = inputVal.replace(/\D/g, '');

    if (country.code === 'UA' && digits.startsWith('0')) {
      digits = '38' + digits;
    }

    const detected = detectCountry(digits);
    const activeCountry = detected || country;
    if (detected && detected.code !== country.code) {
      setCountry(detected);
    }

    const formatted = formatForCountry(digits, activeCountry);
    setDisplay(formatted);

    const valid = isPhoneValid(digits, activeCountry);
    onChange('+' + digits, valid);
  };

  const handleFocus = () => {
    if (!display) {
      const prefix = '+' + country.dial + ' ';
      setDisplay(prefix);
      onChange('+' + country.dial, false);
    }
  };

  const handleBlur = () => {
    const digits = display.replace(/\D/g, '');
    if (!digits || digits === country.dial) {
      setDisplay('');
      onChange('', false);
    }
  };

  const selectCountry = (c: Country) => {
    setCountry(c);
    setDisplay('+' + c.dial + ' ');
    onChange('+' + c.dial, false);
    setIsOpen(false);
  };

  const isDark = theme === 'dark';

  return (
    <div className="relative" ref={wrapRef}>
      <div
        className={`flex items-center border-2 rounded-2xl transition-all shadow-sm ${
          isDark
            ? 'bg-[#121212] text-white border-[#2A2A2A] focus-within:border-[#FF3D2E] focus-within:ring-4 focus-within:ring-[#FF3D2E]/20'
            : 'bg-white text-slate-900 border-slate-300 focus-within:border-[#FF3D2E] focus-within:ring-4 focus-within:ring-[#FF3D2E]/20'
        }`}
      >
        {/* Flag dropdown button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(o => !o)}
          disabled={disabled}
          aria-label="Вибрати країну"
          className={`flex items-center gap-1.5 pl-4 pr-3 py-4 shrink-0 border-r rounded-l-2xl transition-colors disabled:opacity-50 ${
            isDark
              ? 'border-[#262626] hover:bg-[#1C1C1C]'
              : 'border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className="text-xl leading-none">{country.flag}</span>
          <span className={`text-[10px] font-bold ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
            ▼
          </span>
        </button>

        {/* Input */}
        <input
          type="tel"
          value={display}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={'+' + country.dial + ' ...'}
          autoComplete="tel"
          className="flex-1 px-3 py-4 text-base font-semibold bg-transparent outline-none disabled:opacity-50 min-w-0"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl z-50 overflow-hidden border max-h-64 overflow-y-auto ${
            isDark
              ? 'bg-[#181818] border-[#333333] text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {COUNTRIES.map(c => (
            <button
              key={c.code}
              type="button"
              onClick={() => selectCountry(c)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors text-sm font-semibold ${
                c.code === country.code
                  ? isDark ? 'bg-[#FF3D2E]/20 text-[#FF3D2E]' : 'bg-orange-50 text-orange-600'
                  : isDark ? 'hover:bg-[#222222]' : 'hover:bg-slate-50'
              }`}
            >
              <span className="text-xl leading-none">{c.flag}</span>
              <span className="flex-1">{c.name}</span>
              <span className={`text-xs ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>
                +{c.dial}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
