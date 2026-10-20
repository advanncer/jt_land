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
      let r = '+' + country.dial + ' ';
      for (let i = 0; i < raw.length; i++) {
        if (i > 0 && i % 3 === 0) r += ' ';
        r += raw[i];
      }
      return r.trim();
    }
  }
}

function detectCountryFromDigits(digits: string): Country | null {
  if (!digits) return null;
  const sorted = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
  for (const c of sorted) {
    if (digits.startsWith(c.dial)) return c;
  }
  return null;
}

interface PhoneInputProps {
  value: string;
  onChange: (val: string, rawDigits: string, isValid: boolean) => void;
  disabled?: boolean;
  defaultCountry?: string;
}

export default function PhoneInput({
  value,
  onChange,
  disabled = false,
  defaultCountry = 'UA',
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    return COUNTRIES.find((c) => c.code === defaultCountry) || COUNTRIES[0];
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (defaultCountry) {
      const found = COUNTRIES.find((c) => c.code === defaultCountry.toUpperCase());
      if (found && !value) {
        setSelectedCountry(found);
      }
    }
  }, [defaultCountry]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    const digits = inputVal.replace(/\D/g, '');

    const detected = detectCountryFromDigits(digits);
    const country = detected || selectedCountry;
    if (detected && detected.code !== selectedCountry.code) {
      setSelectedCountry(detected);
    }

    const formatted = formatForCountry(digits, country);

    let isValid = false;
    if (country.code === 'UA') {
      isValid = digits.length === 12;
    } else if (country.code === 'PL') {
      isValid = digits.length === 11;
    } else if (country.code === 'US') {
      isValid = digits.length === 11;
    } else {
      isValid = digits.length >= 9 && digits.length <= 15;
    }

    onChange(formatted, digits ? '+' + digits : '', isValid);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setDropdownOpen(false);

    const digits = value.replace(/\D/g, '');
    let strippedDigits = digits;
    if (digits.startsWith(selectedCountry.dial)) {
      strippedDigits = digits.slice(selectedCountry.dial.length);
    }
    const newDigits = country.dial + strippedDigits;
    const formatted = formatForCountry(newDigits, country);

    let isValid = false;
    if (country.code === 'UA') isValid = newDigits.length === 12;
    else if (country.code === 'PL' || country.code === 'US') isValid = newDigits.length === 11;
    else isValid = newDigits.length >= 9 && newDigits.length <= 15;

    onChange(formatted, '+' + newDigits, isValid);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleFocus = () => {
    if (!value) {
      const prefix = '+' + selectedCountry.dial + ' ';
      onChange(prefix, '+' + selectedCountry.dial, false);
    }
  };

  const handleBlur = () => {
    const digits = value.replace(/\D/g, '');
    if (digits === selectedCountry.dial || digits.length <= selectedCountry.dial.length) {
      onChange('', '', false);
    }
  };

  const getPlaceholder = (country: Country) => {
    switch (country.code) {
      case 'UA': return '+380 (XX) XXX-XX-XX';
      case 'PL': return '+48 (XXX) XXX-XXX';
      case 'US': return '+1 (XXX) XXX-XXXX';
      default: return `+${country.dial} XXX XXX XXX`;
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center w-full rounded-2xl bg-[#131926]/90 border border-white/10 hover:border-[#8ee53f]/50 focus-within:border-[#8ee53f] focus-within:ring-2 focus-within:ring-[#8ee53f]/30 transition-all shadow-inner">
        {/* Country selector trigger */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 pl-4 pr-2.5 py-4 text-white hover:text-[#8ee53f] transition-colors select-none text-base font-medium disabled:opacity-50"
            aria-label="Оберіть країну"
          >
            <span className="text-xl leading-none">{selectedCountry.flag}</span>
            <span className="text-xs text-white/50">▼</span>
          </button>

          {/* Dropdown list */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-[#141a27] border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden py-1.5 animate-fadeIn">
              <div className="max-h-60 overflow-y-auto">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCountrySelect(c)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-[#8ee53f]/10 transition-colors ${
                      c.code === selectedCountry.code
                        ? 'bg-[#8ee53f]/20 text-[#8ee53f] font-semibold'
                        : 'text-white/80'
                    }`}
                  >
                    <span className="text-lg">{c.flag}</span>
                    <span className="flex-1">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="w-[1px] h-6 bg-white/15" />

        {/* Phone input */}
        <input
          ref={inputRef}
          type="tel"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={getPlaceholder(selectedCountry)}
          className="flex-1 bg-transparent px-4 py-4 text-white placeholder-white/40 text-base md:text-lg focus:outline-none disabled:opacity-50 font-medium"
        />
      </div>
    </div>
  );
}
