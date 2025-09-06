import { createApp } from "./game/app.js";
import { loadSpritesheet } from "./game/assets.js";
import { updateBalance } from "./game/utils.js";
import { setupWebSocket } from "./game/websocket.js";


let allBets = new Proxy([
    { player: "xyz", bet: 1234, x: 1.34, win: 23.32 },
    { player: "amit", bet: 12, x: 11.40, win: 33.12 },
    { player: "mohi", bet: 100, x: 0, win: 0 },
    { player: "jassi", bet: 9.8, x: 0, win: 0 }
], {
    set(target, prop, value) {
        target[prop] = value;
        renderAllBetsTable();
        return true;
    }
});

let myBets = new Proxy([
    { date: "12.03.25 10:12", bet: 1234, x: 1.34, win: 23.32, balBefore: "123,43", balAfter: "123,00" },
    { date: "12.03.25 10:12", bet: 1234, x: 0, win: 0, balBefore: "123,43", balAfter: "123,00" },
    { date: "12.03.25 10:12", bet: 1234, x: 1.34, win: 23.32, balBefore: "123,43", balAfter: "123,00" },
    { date: "12.03.25 10:12", bet: 1234, x: 0, win: 0, balBefore: "123,43", balAfter: "123,00" }
], {
    set(target, prop, value) {
        target[prop] = value;
        renderMyBetsTable();
        return true;
    }
});

let highestCrash = new Proxy([
    { date: "11:26 29/07/12", x: 1.34 },
    { date: "11:26 29/07", x: 1.34 },
    { date: "11:26 29/07", x: 1.34 },
    { date: "11:26 29/07", x: 1.34 },
    { date: "11:26 29/07", x: 1.34 }], {
    set(target, prop, value) {
        target[prop] = value;
        renderHighestTable();
        return true;
    }
});

const results = [
    { roundId: "red333334", result: 2.32 },
    { roundId: "red333335", result: 25.11 },
    { roundId: "red333336", result: 1.5 },
    { roundId: "red333337", result: 150.25 },
    { roundId: "red333338", result: 3.42 },
    { roundId: "red333339", result: 60.55 }
];
const handler = {
    set(target, property, value) {
        target[property] = value;
        renderList(target);
        return true;
    },
    deleteProperty(target, property) {
        delete target[property];
        renderList(target);
        return true;
    }
};

const prevResults = new Proxy(results, handler);
renderList(prevResults); // Initial render


(async () => {
    const app = await createApp("canvas-container");

    // Example: load assets
    const spritesheet = await loadSpritesheet(myAtlasData);

    // Example: update balance
    updateBalance(5000);

    // Example: setup WebSocket
    setupWebSocket("ws://localhost:3000", app);
})();