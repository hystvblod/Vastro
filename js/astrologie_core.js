document.addEventListener("DOMContentLoaded", () => {
  const astroForm = document.getElementById("astro-form");
  const resultats = document.getElementById("resultats-astro");
  const signeEl = document.getElementById("signe-resultat");
  const ascendantEl = document.getElementById("ascendant-resultat");

  const signes = [
    { nom: "Bélier", start: "03-21", end: "04-19" },
    { nom: "Taureau", start: "04-20", end: "05-20" },
    { nom: "Gémeaux", start: "05-21", end: "06-20" },
    { nom: "Cancer", start: "06-21", end: "07-22" },
    { nom: "Lion", start: "07-23", end: "08-22" },
    { nom: "Vierge", start: "08-23", end: "09-22" },
    { nom: "Balance", start: "09-23", end: "10-22" },
    { nom: "Scorpion", start: "10-23", end: "11-21" },
    { nom: "Sagittaire", start: "11-22", end: "12-21" },
    { nom: "Capricorne", start: "12-22", end: "01-19" },
    { nom: "Verseau", start: "01-20", end: "02-18" },
    { nom: "Poissons", start: "02-19", end: "03-20" }
  ];

  function getSigne(date) {
    const [year, month, day] = date.split("-");
    const dateRef = `${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    for (let i = 0; i < signes.length; i++) {
      const { nom, start, end } = signes[i];
      if (
        (start <= dateRef && dateRef <= end) ||
        (start > end && (dateRef >= start || dateRef <= end))
      ) {
        return nom;
      }
    }
    return "Inconnu";
  }

  function getAscendant(heure) {
    if (!heure) return "Inconnu";
    const [h] = heure.split(":").map(Number);
    if (h >= 6 && h < 8) return "Bélier";
    if (h >= 8 && h < 10) return "Taureau";
    if (h >= 10 && h < 12) return "Gémeaux";
    if (h >= 12 && h < 14) return "Cancer";
    if (h >= 14 && h < 16) return "Lion";
    if (h >= 16 && h < 18) return "Vierge";
    if (h >= 18 && h < 20) return "Balance";
    if (h >= 20 && h < 22) return "Scorpion";
    if (h >= 22 || h < 0) return "Sagittaire";
    if (h >= 0 && h < 2) return "Capricorne";
    if (h >= 2 && h < 4) return "Verseau";
    if (h >= 4 && h < 6) return "Poissons";
    return "Inconnu";
  }

  astroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const birthDate = document.getElementById("birth-date").value;
    const birthTime = document.getElementById("birth-time").value;

    if (!birthDate) {
      alert("Veuillez saisir une date de naissance.");
      return;
    }

    const signe = getSigne(birthDate);
    const ascendant = getAscendant(birthTime);

    signeEl.textContent = signe;
    ascendantEl.textContent = ascendant;
    resultats.classList.remove("hidden");
  });
});
