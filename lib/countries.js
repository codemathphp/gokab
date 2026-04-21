export const COUNTRIES = [
  {
    name: 'Ghana',
    code: 'GH',
    flag: '🇬🇭',
    phone: '+233',
    placeholder: '50 123 4567'
  },
  {
    name: 'Zimbabwe',
    code: 'ZW',
    flag: '🇿🇼',
    phone: '+263',
    placeholder: '77 123 4567'
  },
  {
    name: 'Botswana',
    code: 'BW',
    flag: '🇧🇼',
    phone: '+267',
    placeholder: '71 123 456'
  },
  {
    name: 'South Africa',
    code: 'ZA',
    flag: '🇿🇦',
    phone: '+27',
    placeholder: '71 234 5678'
  },
  {
    name: 'USA',
    code: 'US',
    flag: '🇺🇸',
    phone: '+1',
    placeholder: '201 555 0123'
  },
  {
    name: 'Lesotho',
    code: 'LS',
    flag: '🇱🇸',
    phone: '+266',
    placeholder: '50 123 456'
  },
  {
    name: 'Nigeria',
    code: 'NG',
    flag: '🇳🇬',
    phone: '+234',
    placeholder: '801 234 5678'
  },
  {
    name: 'Algeria',
    code: 'DZ',
    flag: '🇩🇿',
    phone: '+213',
    placeholder: '550 123 456'
  }
];

export const getCountryByCode = (code) => {
  return COUNTRIES.find(c => c.code === code);
};

export const getCountryByPhone = (phone) => {
  const phoneStr = phone.toString();
  return COUNTRIES.find(c => phoneStr.startsWith(c.phone.replace('+', '')));
};
