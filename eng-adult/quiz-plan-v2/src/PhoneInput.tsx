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
    case 'UA': {
      if (digits.length !== 12 || !digits.startsWith('380')) return false;
      const carrier = digits.slice(3, 5);
      const validCarriers = [
        '50', '63', '66', '67', '68', '73', '91', '92', '93', '94', '95', '96', '97', '98', '99'
      ];
      return validCarriers.includes(carrier);
    }
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

export function PhoneInput({ onChange, initialCountry = 'UA', disabled = false }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    return COUNTRIES.find(c => c.code === initialCountry.toUpperCase()) || COUNTRIES[0];
  });
  const [displayValue, setDisplayValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialCountry) {
      const match = COUNTRIES.find(c => c.code === initialCountry.toUpperCase());
      if (match && !displayValue) {
        setSelectedCountry(match);
      }
    }
  }, [initialCountry, displayValue]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    let digits = rawVal.replace(/\D/g, '');

    // Handle leading zero
    if (digits.startsWith('0') && selectedCountry.code === 'UA') {
      digits = '380' + digits.slice(1);
    } else if (digits.startsWith('0') && selectedCountry.code === 'PL') {
      digits = '48' + digits.slice(1);
    }

    // Auto-detect country code on the fly
    const detected = detectCountry(digits);
    const activeCountry = detected || selectedCountry;
    if (detected && detected.code !== selectedCountry.code) {
      setSelectedCountry(detected);
    }

    // Limit digits
    if (activeCountry.maxDigits && digits.length > activeCountry.maxDigits) {
      digits = digits.slice(0, activeCountry.maxDigits);
    } else if (digits.length > 15) {
      digits = digits.slice(0, 15);
    }

    const formatted = formatForCountry(digits, activeCountry);
    setDisplayValue(formatted);

    const fullRaw = digits ? '+' + digits : '';
    const isValid = checkValidity(digits, activeCountry);
    onChange(fullRaw, isValid);
  };

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);

    let digits = displayValue.replace(/\D/g, '');
    const oldDial = selectedCountry.dial;
    if (digits.startsWith(oldDial)) {
      digits = country.dial + digits.slice(oldDial.length);
    } else {
      digits = country.dial;
    }

    if (country.maxDigits && digits.length > country.maxDigits) {
      digits = digits.slice(0, country.maxDigits);
    }

    const formatted = formatForCountry(digits, country);
    setDisplayValue(formatted);

    const fullRaw = '+' + digits;
    const isValid = checkValidity(digits, country);
    onChange(fullRaw, isValid);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    if (!displayValue) {
      const prefix = '+' + selectedCountry.dial + ' ';
      setDisplayValue(prefix);
      onChange('+' + selectedCountry.dial, false);
    }
  };

  const handleBlur = () => {
    const digits = displayValue.replace(/\D/g, '');
    if (digits === selectedCountry.dial || !digits) {
      setDisplayValue('');
      onChange('', false);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className={`flex items-center w-full rounded-2xl border-2 bg-white transition-all overflow-hidden ${
          disabled
            ? 'border-gray-200 opacity-60 cursor-not-allowed bg-gray-50'
            : 'border-[#E0E0E0] hover:border-[#C8C8C8] focus-within:border-[#F56600] focus-within:ring-4 focus-within:ring-[#F56600]/15'
        }`}
      >
        {/* Country Selector Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(prev => !prev)}
          aria-label="Оберіть країну"
          className="flex items-center gap-1.5 px-4 py-4 bg-[#F8F8F8] border-r border-[#E0E0E0] hover:bg-[#F0F0F0] transition-colors shrink-0 text-base font-semibold text-[#141414]"
        >
          <span className="text-xl leading-none">{selectedCountry.flag}</span>
          <span className="text-xs text-[#808080]">▼</span>
        </button>

        {/* Input */}
        <input
          ref={inputRef}
          type="tel"
          disabled={disabled}
          placeholder={
            selectedCountry.code === 'UA'
              ? '+380 (XX) XXX-XX-XX'
              : selectedCountry.code === 'PL'
              ? '+48 (XXX) XXX-XXX'
              : `+${selectedCountry.dial} ...`
          }
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required
          autoComplete="tel"
          className="w-full px-4 py-4 outline-none font-semibold text-[#141414] placeholder:text-[#A8A8A8] text-base bg-transparent"
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-2 w-72 max-h-64 overflow-y-auto bg-white rounded-2xl shadow-xl border border-[#E0E0E0] z-50 p-1.5 animate-fade-in">
          {COUNTRIES.map(c => (
            <button
              key={c.code}
              type="button"
              onClick={() => handleSelectCountry(c)}
              className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-left text-sm font-medium transition-colors ${
                c.code === selectedCountry.code
                  ? 'bg-[#FFF5EB] text-[#F56600] font-bold'
                  : 'hover:bg-[#F8F8F8] text-[#141414]'
              }`}
            >
              <span className="text-lg">{c.flag}</span>
              <span className="flex-1 truncate">{c.name}</span>
              {c.code === selectedCountry.code && (
                <span className="text-[#F56600] font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
