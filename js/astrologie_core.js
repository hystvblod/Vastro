// ========== js/astro_calc.js ==========

// 1. Gestion de la langue multilingue
let LANG = {};
let langCode = localStorage.getItem("astro-lang") || "fr";

function loadLang(code, callback) {
  fetch(`lang/${code}.json`)
    .then(r => r.json())
    .then(obj => {
      LANG = obj;
      langCode = code;
      localStorage.setItem("astro-lang", code);
      if (callback) callback();
    });
}

function t(key) {
  return LANG[key] || key;
}

// 2. Fonctions astro (cities = ton array cities.json chargé AVANT)
function getSigneSolaire(dateNaissance) {
  const signes = [
    { nom: t("Bélier"), start: "03-21", end: "04-19" },
    { nom: t("Taureau"), start: "04-20", end: "05-20" },
    { nom: t("Gémeaux"), start: "05-21", end: "06-20" },
    { nom: t("Cancer"), start: "06-21", end: "07-22" },
    { nom: t("Lion"), start: "07-23", end: "08-22" },
    { nom: t("Vierge"), start: "08-23", end: "09-22" },
    { nom: t("Balance"), start: "09-23", end: "10-22" },
    { nom: t("Scorpion"), start: "10-23", end: "11-21" },
    { nom: t("Sagittaire"), start: "11-22", end: "12-21" },
    { nom: t("Capricorne"), start: "12-22", end: "01-19" },
    { nom: t("Verseau"), start: "01-20", end: "02-18" },
    { nom: t("Poissons"), start: "02-19", end: "03-20" }
  ];
  const [year, month, day] = dateNaissance.split('-');
  const dateRef = `${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  for (const signe of signes) {
    if (
      (signe.start <= dateRef && dateRef <= signe.end) ||
      (signe.start > signe.end && (dateRef >= signe.start || dateRef <= signe.end))
    ) {
      return signe.nom;
    }
  }
  return t("Inconnu");
}

function findCity(nomVille, cities) {
  const clean = str => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return cities.find(city => clean(city.name) === clean(nomVille));
}

function calculAscendant(dateNaissance, heureNaissance, nomVille, cities) {
  const city = findCity(nomVille, cities);
  if (!city) return t("Ville inconnue");

  const lat = parseFloat(city.lat);
  const lng = parseFloat(city.lng);

  // Fuseau horaire simplifié par pays (adapte si besoin !)
  let tzOffset = 3; // Default: Turquie
  if (city.country === "FR") tzOffset = 1;
  if (city.country === "CN") tzOffset = 8;
  if (city.country === "RU") tzOffset = 3;
  if (city.country === "US") tzOffset = -5;

  const [year, month, day] = dateNaissance.split('-').map(Number);
  const [hour, minute] = heureNaissance.split(':').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour - tzOffset, minute));

  const JD = utcDate.getTime() / 86400000 + 2440587.5;
  const T = (JD - 2451545.0) / 36525.0;

  let GMST = 6.697374558 + 2400.051336 * T + 0.000025862 * T * T;
  const UT = utcDate.getUTCHours() + utcDate.getUTCMinutes() / 60 + utcDate.getUTCSeconds() / 3600;
  GMST += UT * 1.002737909;
  GMST = (GMST % 24) * 15;

  let LST = GMST + lng;
  LST = (LST + 360) % 360;

  const obliquity = 23.4393;
  const asc = Math.atan2(
    -Math.cos(LST * Math.PI / 180),
    Math.sin(obliquity * Math.PI / 180) * Math.tan(lat * Math.PI / 180) +
    Math.cos(obliquity * Math.PI / 180) * Math.sin(LST * Math.PI / 180)
  ) * 180 / Math.PI;
  const ascDeg = (asc + 360) % 360;

  const signes = [
    t("Bélier"), t("Taureau"), t("Gémeaux"), t("Cancer"),
    t("Lion"), t("Vierge"), t("Balance"), t("Scorpion"),
    t("Sagittaire"), t("Capricorne"), t("Verseau"), t("Poissons")
  ];
  const signeAsc = signes[Math.floor(((ascDeg + 30) % 360) / 30)];
  return signeAsc;
}

// Pour charger la langue au lancement :
loadLang(langCode);

// Pour changer de langue dynamiquement (ex : anglais)
// loadLang("en");

// Utilisation exemple (quand cities est chargé)
// const signe = getSigneSolaire("1992-06-23");
// const asc = calculAscendant("1992-06-23", "15:30", "Paris", cities);
// document.getElementById("signe").textContent = `${t("Signe solaire")} : ${signe}`;
// document.getElementById("ascendant").textContent = `${t("Ascendant")} : ${asc}`;
