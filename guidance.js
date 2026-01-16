// guidance.js

const GD_PLANET_THEMES = {
  Sun: {
    action: "Authority, illumination, alignment with purpose",
    caution: "Avoid ego driven action",
    suitable: "Invocation, leadership decisions, consecration"
  },
  Moon: {
    action: "Reflection, memory, psychic sensitivity",
    caution: "Avoid instability or emotional excess",
    suitable: "Divination, scrying, dream work"
  },
  Mercury: {
    action: "Communication, learning, symbolic work",
    caution: "Avoid deception or haste",
    suitable: "Writing, study, sigil construction"
  },
  Venus: {
    action: "Harmony, attraction, reconciliation",
    caution: "Avoid indulgence",
    suitable: "Talismans, artistic work, relational magic"
  },
  Mars: {
    action: "Force, separation, courage",
    caution: "Avoid anger and rash acts",
    suitable: "Banishing, defense, decisive action"
  },
  Jupiter: {
    action: "Expansion, justice, wisdom",
    caution: "Avoid excess or arrogance",
    suitable: "Blessings, prosperity rites, oaths"
  },
  Saturn: {
    action: "Restriction, endurance, structure",
    caution: "Avoid melancholy",
    suitable: "Bindings, discipline, long term planning"
  }
};

const GD_SIGN_MODIFIERS = {
  Aries: "direct and forceful",
  Taurus: "stable and material",
  Gemini: "intellectual and fluid",
  Cancer: "protective and internal",
  Leo: "expressive and radiant",
  Virgo: "precise and corrective",
  Libra: "balanced and relational",
  Scorpio: "intense and transformative",
  Sagittarius: "aspirational and expansive",
  Capricorn: "structured and disciplined",
  Aquarius: "detached and innovative",
  Pisces: "visionary and dissolving"
};

/**
 * Generate guidance text for a planetary hour
 * @param {string} planetName - Planet ruling the hour
 * @param {string} zodiacName - Zodiac sign of the planet
 * @param {boolean} natalMatch - Whether the hour resonates with natal chart
 * @returns {string} Guidance text
 */
function generateGuidance(planetName, zodiacName, natalMatch) {
  const planet = GD_PLANET_THEMES[planetName];
  const modifier = GD_SIGN_MODIFIERS[zodiacName];

  if (!planet || !modifier) return "No guidance available for this combination.";

  let text = `
Planetary ruler: ${planetName}

Primary current: ${planet.action}.
Expression is ${modifier}.

Suitable works: ${planet.suitable}.
Caution: ${planet.caution}.
`;

  if (natalMatch) {
    text += "\nThis hour resonates strongly with your natal chart, amplifying its effects.";
  }

  return text.trim();
}
