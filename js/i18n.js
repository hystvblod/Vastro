let userLang = "fr";
let horoscopesData = [];
let compatibilitesData = [];
let vastrobotData = [];

document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("lang-select");

  // Initialisation langue
  userLang = localStorage.getItem("vastro-lang") || "fr";
  langSelect.value = userLang;

  // Écouteur de changement de langue
  langSelect.addEventListener("change", (e) => {
    userLang = e.target.value;
    localStorage.setItem("vastro-lang", userLang);
    reloadContent();
  });

  // Chargement initial
  reloadContent();
});

function reloadContent() {
  loadHoroscope();
  loadCompatibilite();
  loadVastroBot();
}

// === Horoscope ===
function loadHoroscope() {
  fetch("data/lang/horoscopes.json")
    .then(res => res.json())
    .then(data => {
      horoscopesData = data;
      const today = data[Math.floor(Math.random() * data.length)];
      const phrase = today[userLang] || today["fr"] || "Pas de texte.";
      const el = document.getElementById("daily-horoscope");
      if (el) el.textContent = phrase;
    });
}

// === Compatibilité ===
function loadCompatibilite() {
  fetch("data/lang/compatibilites.json")
    .then(res => res.json())
    .then(data => {
      compatibilitesData = data;
      setupCompatibiliteSelect();
    });
}

function setupCompatibiliteSelect() {
  const signes = [...new Set(compatibilitesData.map(row => row.signe1))];
  const select1 = document.getElementById("signe1-select");
  const select2 = document.getElementById("signe2-select");
  if (!select1 || !select2) return;

  select1.innerHTML = "";
  select2.innerHTML = "";

  signes.forEach(signe => {
    const option1 = new Option(signe, signe);
    const option2 = new Option(signe, signe);
    select1.appendChild(option1);
    select2.appendChild(option2);
  });

  document.getElementById("check-compat").addEventListener("click", () => {
    const s1 = select1.value;
    const s2 = select2.value;
    const res = compatibilitesData.find(row =>
      row.signe1 === s1 && row.signe2 === s2
    );
    const texte = res ? (res[userLang] || res["fr"]) : "Aucune donnée.";
    document.getElementById("compatibilite-resultat").textContent = texte;
  });
}

// === VastroBot ===
function loadVastroBot() {
  fetch("data/lang/vastrobot.json")
    .then(res => res.json())
    .then(data => {
      vastrobotData = data;
      setupBotChat();
    });
}

function setupBotChat() {
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const chatbox = document.getElementById("chat-messages");

  if (!input || !sendBtn || !chatbox) return;

  sendBtn.onclick = () => {
    const question = input.value.trim();
    if (!question) return;
    input.value = "";

    const userMsg = document.createElement("div");
    userMsg.textContent = "🧑 " + question;
    chatbox.appendChild(userMsg);

    // Réponse simple aléatoire (remplacée plus tard par logique NLP)
    const random = vastrobotData[Math.floor(Math.random() * vastrobotData.length)];
    const botReply = document.createElement("div");
    botReply.textContent = "🔮 " + (random[userLang] || random["fr"]);
    chatbox.appendChild(botReply);

    chatbox.scrollTop = chatbox.scrollHeight;
  };
}
