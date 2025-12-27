import routes from './routes.js';

export const store = Vue.reactive({
    dark: JSON.parse(localStorage.getItem('dark')) || false,
    toggleDark() {
        this.dark = !this.dark;
        localStorage.setItem('dark', JSON.stringify(this.dark));
    },
});

const app = Vue.createApp({
    data: () => ({ store }),
});
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

app.use(router);

app.mount('#app');

// ====== Funkcja generująca ranking z filtrowaniem weryfikatorów teamowych ======
function generateRanking(levels) {
    const playerPoints = {};

    levels.forEach(level => {
        const verifier = level.verifier;

        // 🔹 IGNORUJ weryfikatorów teamowych
        if (!verifier) return; // puste pole
        if (verifier.includes("_Verifier") || verifier.includes("[Team]") || verifier.includes("(Team)")) {
            return; // nie dodawaj punktów
        }

        // 🔹 Dodaj punkty dla prawdziwych graczy
        if (!playerPoints[verifier]) {
            playerPoints[verifier] = 0;
        }

        // Przykład: każdemu poziomowi 1 punkt
        playerPoints[verifier] += 1;
    });

    // 🔹 Konwersja do posortowanej listy rankingowej
    const ranking = Object.entries(playerPoints)
        .sort((a, b) => b[1] - a[1]);

    // 🔹 Wyświetlanie rankingu w div#ranking
    const rankingDiv = document.getElementById("ranking");
    if (!rankingDiv) return;

    rankingDiv.innerHTML = "";
    ranking.forEach(([player, points], index) => {
        const el = document.createElement("div");
        el.textContent = `${index + 1}. ${player} - ${points} pkt`;
        rankingDiv.appendChild(el);
    });
}

// ====== Automatyczne wywołanie funkcji po wczytaniu JSON ======
if (typeof levels !== "undefined" && Array.isArray(levels)) {
    generateRanking(levels);
} else {
    console.error("Nie znaleziono zmiennej 'levels' lub nie jest tablicą.");
}

