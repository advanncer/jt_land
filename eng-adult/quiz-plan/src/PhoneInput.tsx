import { useState, useEffect, useRef } from 'react';

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

  // If user is typing the country prefix, don't format it as a full mask yet
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
      const d = raw.substring(0, 12);
      let r = '+' + country.dial + ' ';
      for (let i = 0; i < d.length; i++) {
        if (i > 0 && i % 3 === 0) r += ' ';
        r += d[i];
      }
      return r;
    }
  }
}

function detectCountry(digits: string): Country | null {
  if (digits.startsWith('380')) return COUNTRIES.find(c => c.code === 'UA') || null;
  if (digits.startsWith('421')) return COUNTRIES.find(c => c.code === 'SK') || null;
  if (digits.startsWith('420')) return COUNTRIES.find(c => c.code === 'CZ') || null;
  if (digits.startsWith('49')) return COUNTRIES.find(c => c.code === 'DE') || null;
  if (digits.startsWith('48') && !digits.startsWith('480'))
    return COUNTRIES.find(c => c.code === 'PL') || null;
  if (digits.startsWith('40')) return COUNTRIES.find(c => c.code === 'RO') || null;
  if (digits.startsWith('44')) return COUNTRIES.find(c => c.code === 'GB') || null;
  if (digits.startsWith('1') && digits.length > 1)
    return COUNTRIES.find(c => c.code === 'US') || null;
  return null;
}

function checkValidity(digits: string, country: Country): boolean {
  switch (country.code) {
    case 'UA':
      return digits.length === 12 && digits.startsWith('380');
    case 'PL':
      return digits.length === 11 && digits.startsWith('48');
    case 'US':
      return digits.length === 11 && digits.startsWith('1');
    default: {
      const localLen = digits.length - country.dial.length;
      return localLen >= 6 && digits.length >= 9 && digits.length <= 15;
    }
  }
}

interface PhoneInputProps {
  onChange: (raw: string, valid: boolean) => void;
  initialCountry?: string;
  disabled?: boolean;
}

export default function PhoneInput({
  onChange,
  initialCountry = 'UA',
  disabled = false,
}: PhoneInputProps) {
  const [country, setCountry] = useState<Country>(
    COUNTRIES.find(c => c.code === initialCountry) || COUNTRIES[0],
  );
  const [display, setDisplay] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Sync when parent provides geo country
  useEffect(() => {
    const found = COUNTRIES.find(c => c.code === initialCountry);
    if (found && found.code !== country.code) {
      setCountry(found);
      setDisplay('');
      onChange('', false);
    }
  }, [initialCountry]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');

    // Allow deleting down to empty string
    if (!raw) {
      setDisplay('');
      onChange('', false);
      return;
    }

    // Leading 0 → prepend UA dial code
    if (raw.startsWith('0') && country.code === 'UA') {
      raw = '380' + raw.slice(1);
    }

    // Auto-detect country from typed digits ("Magic on the fly")
    if (raw.length > 2) {
      const detected = detectCountry(raw);
      if (detected && detected.code !== country.code) {
        setCountry(detected);
        const formatted = formatForCountry(raw, detected);
        setDisplay(formatted);
        onChange('+' + raw, checkValidity(raw, detected));
        return;
      }
    }

    const formatted = formatForCountry(raw, country);
    setDisplay(formatted);
    onChange('+' + raw, checkValidity(raw, country));
  };

  const handleFocus = () => {
    if (!display.trim()) {
      setDisplay('+' + country.dial + ' ');
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

  return (
    <div className="relative" ref={wrapRef}>
      <div
        className={`flex items-center border-2 rounded-2xl bg-white transition-colors ${
          isOpen ? 'border-violet-500' : 'border-violet-200'
        } focus-within:border-violet-500`}
      >
        {/* Flag + dial code selector */}
        <button
          type="button"
          id="phone-country-btn"
          onClick={() => !disabled && setIsOpen(o => !o)}
          disabled={disabled}
          aria-label="Вибрати країну"
          className="flex items-center gap-1 pl-4 pr-3 py-4 shrink-0 border-r border-violet-100 hover:bg-violet-50 transition-colors disabled:opacity-50 rounded-l-2xl"
        >
          <span className="text-xl leading-none">{country.flag}</span>
          <span className="text-violet-400 text-[10px] mt-0.5 font-bold">▼</span>
        </button>

        {/* Phone input */}
        <input
          id="phone-input"
          type="tel"
          value={display}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={'+' + country.dial + ' ...'}
          autoComplete="tel"
          className="flex-1 px-3 py-4 text-base font-semibold text-violet-950 bg-transparent outline-none disabled:opacity-50 min-w-0"
        />
      </div>

      {/* Country dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-violet-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          {COUNTRIES.map(c => (
            <button
              key={c.code}
              type="button"
              id={`country-${c.code}`}
              onClick={() => selectCountry(c)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-violet-50 text-left transition-colors ${
                c.code === country.code ? 'bg-violet-50' : ''
              }`}
            >
              <span className="text-xl">{c.flag}</span>
              <span className="text-sm font-semibold text-violet-900">{c.name}</span>
              {c.code === country.code && (
                <span className="ml-auto text-violet-500 text-xs font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
