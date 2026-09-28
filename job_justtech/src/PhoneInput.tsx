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
  value?: string;
  onChange: (raw: string, valid: boolean) => void;
  initialCountry?: string;
  disabled?: boolean;
}

export default function PhoneInput({
  value = '',
  onChange,
  initialCountry = 'UA',
  disabled = false,
}: PhoneInputProps) {
  const [country, setCountry] = useState<Country>(() => {
    return COUNTRIES.find(c => c.code === initialCountry.toUpperCase()) || COUNTRIES[0];
  });
  const [display, setDisplay] = useState(() => {
    if (value) {
      const digits = value.replace(/\D/g, '');
      const detected = detectCountry(digits) || COUNTRIES[0];
      return formatForCountry(digits, detected);
    }
    return '';
  });
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const digits = value.replace(/\D/g, '');
      const detected = detectCountry(digits) || country;
      setCountry(detected);
      setDisplay(formatForCountry(digits, detected));
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (initialCountry && !value) {
      const found = COUNTRIES.find(c => c.code === initialCountry.toUpperCase());
      if (found) setCountry(found);
    }
  }, [initialCountry]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    let digits = raw.replace(/\D/g, '');

    if (digits.startsWith('0') && country.code === 'UA') {
      digits = '380' + digits.slice(1);
    } else if (digits.startsWith('0') && country.code === 'PL') {
      digits = '48' + digits.slice(1);
    }

    const detected = detectCountry(digits);
    const activeCountry = detected || country;
    if (detected && detected.code !== country.code) {
      setCountry(detected);
    }

    if (activeCountry.maxDigits && digits.length > activeCountry.maxDigits) {
      digits = digits.slice(0, activeCountry.maxDigits);
    } else if (digits.length > 15) {
      digits = digits.slice(0, 15);
    }

    const formatted = formatForCountry(digits, activeCountry);
    setDisplay(formatted);

    const fullRaw = digits ? '+' + digits : '';
    const valid = checkValidity(digits, activeCountry);
    onChange(fullRaw, valid);
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

  return (
    <div className="relative" ref={wrapRef} style={{ width: '100%', position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          border: isOpen ? '2px solid #f46600' : '1.5px solid #dcdcdc',
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          boxShadow: isOpen ? '0 0 0 3px rgba(244, 102, 0, 0.15)' : 'none',
          transition: 'all 150ms ease',
          height: '56px',
          overflow: 'hidden',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Flag button */}
        <button
          type="button"
          id="phone-country-btn"
          onClick={() => !disabled && setIsOpen(o => !o)}
          disabled={disabled}
          aria-label="Вибрати країну"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0 12px 0 16px',
            height: '100%',
            background: 'none',
            border: 'none',
            borderRight: '1px solid #ebebeb',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '20px', lineHeight: 1 }}>{country.flag}</span>
          <span style={{ fontSize: '10px', color: '#8f8f8f', fontWeight: 'bold' }}>▼</span>
        </button>

        {/* Input */}
        <input
          id="phone-input"
          type="tel"
          value={display}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={'+' + country.dial + ' (XX) XXX-XX-XX'}
          autoComplete="tel"
          style={{
            flex: 1,
            height: '100%',
            padding: '0 16px',
            fontSize: '16px',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            color: '#09090a',
            width: '100%',
            boxSizing: 'border-box',
            opacity: disabled ? 0.6 : 1,
          }}
        />
      </div>

      {/* Dropdown list */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '16px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
            zIndex: 100,
            maxHeight: '260px',
            overflowY: 'auto',
          }}
        >
          {COUNTRIES.map(c => (
            <button
              key={c.code}
              type="button"
              id={`country-${c.code}`}
              onClick={() => selectCountry(c)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 18px',
                textAlign: 'left',
                border: 'none',
                background: c.code === country.code ? '#fff5eb' : 'transparent',
                color: c.code === country.code ? '#f46600' : '#09090a',
                cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                transition: 'background-color 120ms ease',
              }}
              onMouseEnter={e => {
                if (c.code !== country.code) (e.currentTarget.style.backgroundColor = '#f9f9f9');
              }}
              onMouseLeave={e => {
                if (c.code !== country.code) (e.currentTarget.style.backgroundColor = 'transparent');
              }}
            >
              <span style={{ fontSize: '20px' }}>{c.flag}</span>
              <span style={{ flex: 1 }}>{c.name}</span>
              {c.code === country.code && (
                <span style={{ color: '#f46600', fontWeight: 'bold' }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
