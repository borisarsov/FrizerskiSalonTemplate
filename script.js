/* ==========================================================
   Salon Makaze – skripta
   1) mobilni meni
   2) radno vreme + "Otvoreno / Zatvoreno"
   3) godina u footeru
   ========================================================== */

/* ---- IZMENI: radno vreme ----
   Ključevi: 0 = nedelja, 1 = ponedeljak ... 6 = subota
   Vrednost: ["od", "do"] ili null ako je zatvoreno */
const RADNO_VREME = {
  1: ["09:00", "20:00"],
  2: ["09:00", "20:00"],
  3: ["09:00", "20:00"],
  4: ["09:00", "20:00"],
  5: ["09:00", "20:00"],
  6: ["09:00", "16:00"],
  0: null,
};

const DANI = ["Nedelja", "Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota"];
const REDOSLED = [1, 2, 3, 4, 5, 6, 0]; // prikaz počinje od ponedeljka

/* ---------- 1) Mobilni meni ---------- */
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("glavni-meni");

function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
}

toggle.addEventListener("click", () => {
  setMenu(toggle.getAttribute("aria-expanded") !== "true");
});

// zatvori meni kad se klikne link ili pritisne Escape
nav.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

/* ---------- 2) Radno vreme ---------- */
const hoursList = document.getElementById("hours");
const statusEl = document.getElementById("status");

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function renderHours() {
  const today = new Date().getDay();
  hoursList.innerHTML = "";

  REDOSLED.forEach((d) => {
    const li = document.createElement("li");
    if (d === today) li.classList.add("today");

    const day = document.createElement("span");
    day.textContent = DANI[d];

    const time = document.createElement("span");
    time.textContent = RADNO_VREME[d]
      ? `${RADNO_VREME[d][0]} – ${RADNO_VREME[d][1]}`
      : "Zatvoreno";

    li.append(day, time);
    hoursList.appendChild(li);
  });
}

function renderStatus() {
  const now = new Date();
  const today = RADNO_VREME[now.getDay()];
  const minutes = now.getHours() * 60 + now.getMinutes();

  const isOpen = today && minutes >= toMinutes(today[0]) && minutes < toMinutes(today[1]);

  statusEl.classList.toggle("is-open", Boolean(isOpen));
  statusEl.classList.toggle("is-closed", !isOpen);
  statusEl.textContent = isOpen
    ? `Otvoreno do ${today[1]}`
    : "Trenutno zatvoreno";
}

renderHours();
renderStatus();
setInterval(renderStatus, 60 * 1000); // osvežava se svakog minuta

/* ---------- 3) Godina ---------- */
document.getElementById("godina").textContent = new Date().getFullYear();
