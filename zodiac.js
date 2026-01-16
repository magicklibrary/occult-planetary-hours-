const ZODIAC_SIGNS = [
  { name: "Aries", symbol: "♈", start: 0 },
  { name: "Taurus", symbol: "♉", start: 30 },
  { name: "Gemini", symbol: "♊", start: 60 },
  { name: "Cancer", symbol: "♋", start: 90 },
  { name: "Leo", symbol: "♌", start: 120 },
  { name: "Virgo", symbol: "♍", start: 150 },
  { name: "Libra", symbol: "♎", start: 180 },
  { name: "Scorpio", symbol: "♏", start: 210 },
  { name: "Sagittarius", symbol: "♐", start: 240 },
  { name: "Capricorn", symbol: "♑", start: 270 },
  { name: "Aquarius", symbol: "♒", start: 300 },
  { name: "Pisces", symbol: "♓", start: 330 }
];

function getZodiacFromLongitude(deg) {
  for (let i = ZODIAC_SIGNS.length - 1; i >= 0; i--) {
    if (deg >= ZODIAC_SIGNS[i].start) {
      return ZODIAC_SIGNS[i];
    }
  }
  return ZODIAC_SIGNS[0];
}
