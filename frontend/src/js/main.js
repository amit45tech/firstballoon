import { AnimatedSprite, Application, Assets, Container, Graphics, Sprite, Spritesheet } from 'pixi.js';

let flag = 0;
let type, rId, rStatus, bStatus, sCounter, bTime, counter = 1, serverDataTime, sound = false;
const userId = "ku1234";
let bets = [];


let balance = 5000;
let betInQueueLeft = [], betInQueueRight = [];

let betPlacedLeft = false, autoBetLeft = false, autoCashoutLeft = false;
let autoCashoutValueLeft = 2, inputBetAmountLeft = 10, autoBetRoundCountLeft = 0, betAmountLeft;

let betPlacedRight = false, autoBetRight = false, autoCashoutRight = false;
let autoCashoutValueRight = 2, inputBetAmountRight = 10, autoBetRoundCountRight = 0, betAmountRight;
const MAX_BET = 500, MIN_BET = 1;

const bgMusic = new Audio("/sound/bg.mp3");
const burnSound = new Audio("/sound/burn.mp3");
const clickSound = new Audio("/sound/click.mp3");
const loseSound = new Audio("/sound/lose.mp3");
const tiktakSound = new Audio("/sound/tiktak.mp3");
const winSound = new Audio("/sound/win.mp3");


const menuDiv = document.getElementById("menu-holder");
const menuBtn = document.getElementById("menu-btn");
const menuList = document.getElementById("menu-list");
const avatarHolder = document.getElementById("avatar-holder");
const soundSwitch = document.getElementById('sound-switch');
const betsTab = document.querySelectorAll('.bets-tabs-filled-btn');
const betsPanel = document.querySelectorAll('.bets-panel');
const allBetsBody = document.getElementById('allBetsTableBody');
const myBetsBody = document.getElementById('myBetsTableBody');
const highestTableBody = document.getElementById('highestTableBody');
const thumbs = document.querySelectorAll('.red-hot-line-timer-thumbs .thumb-item');
const betsScores = document.querySelector('.bets-scores');
const listElement = document.querySelector('.last-statistics-list');

const betInputLeft = document.getElementById("bet-amount-left");
const betInputRight = document.getElementById("bet-amount-right");
const betItemsLeft = document.querySelectorAll(".bet-mobile-item.left");
const autoBetCountHolderLeft = document.getElementById('autobet-count-holder-left');
const autoBetSwitchLeft = document.querySelector('.bets-cashout-action-check.left');
const autoCashoutInputLeft = document.querySelector(".bets-cashout-input.left");
const betItemsRight = document.querySelectorAll(".bet-mobile-item.right");
const autoBetCountHolderRight = document.getElementById('autobet-count-holder-right');
const autoBetSwitchRight = document.querySelector('.bets-cashout-action-check.right');
const autoCashoutInputRight = document.querySelector(".bets-cashout-input.right");

const L_bet_btn = document.querySelector(".left.start");
const L_wait_btn = document.querySelector(".left.wait");
const L_next_bet_btn = document.querySelector(".left.next.start");
const L_cashout_btn = document.querySelector(".left.cashout");
const L_cancel_bet_btn = document.querySelector(".left.cancel");
const L_cashout_amount_txt = document.getElementById("left_cashout_amt");

const R_bet_btn = document.querySelector(".right.start");
const R_wait_btn = document.querySelector(".right.wait");
const R_next_bet_btn = document.querySelector(".right.next.start");
const R_cashout_btn = document.querySelector(".right.cashout");
const R_cancel_bet_btn = document.querySelector(".right.cancel");
const R_cashout_amount_txt = document.getElementById("right_cashout_amt");

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

// Wrap with Proxy to auto-update
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
    const app = new Application();
    const canvas_container = document.getElementById("canvas-container");
    await app.init({
        width: canvas_container.clientWidth,
        height: canvas_container.clientHeight,
        backgroundColor: 0x30abda
    });
    app.canvas.style.position = "absolute";
    canvas_container.appendChild(app.canvas);

    const atlasData = {
        frames: {
            man1: {
                frame: { x: 0, y: 800, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man2: {
                frame: { x: 150, y: 800, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man3: {
                frame: { x: 300, y: 800, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man4: {
                frame: { x: 450, y: 800, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man5: {
                frame: { x: 600, y: 800, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man6: {
                frame: { x: 750, y: 800, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },

            man7: {
                frame: { x: 0, y: 951, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man8: {
                frame: { x: 150, y: 951, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man9: {
                frame: { x: 300, y: 951, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man10: {
                frame: { x: 450, y: 951, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man11: {
                frame: { x: 600, y: 951, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man12: {
                frame: { x: 750, y: 951, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },

            man13: {
                frame: { x: 0, y: 1102, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man14: {
                frame: { x: 150, y: 1102, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man15: {
                frame: { x: 300, y: 1102, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man16: {
                frame: { x: 450, y: 1102, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man17: {
                frame: { x: 600, y: 1102, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man18: {
                frame: { x: 750, y: 1102, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },

            man19: {
                frame: { x: 0, y: 1253, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man20: {
                frame: { x: 150, y: 1253, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man21: {
                frame: { x: 300, y: 1253, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man22: {
                frame: { x: 450, y: 1253, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man23: {
                frame: { x: 600, y: 1253, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man24: {
                frame: { x: 750, y: 1253, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },

            man25: {
                frame: { x: 0, y: 1404, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man26: {
                frame: { x: 150, y: 1404, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man27: {
                frame: { x: 300, y: 1404, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man28: {
                frame: { x: 450, y: 1404, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man29: {
                frame: { x: 600, y: 1404, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man30: {
                frame: { x: 750, y: 1404, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },

            man31: {
                frame: { x: 0, y: 1555, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man32: {
                frame: { x: 150, y: 1555, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man33: {
                frame: { x: 300, y: 1555, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man34: {
                frame: { x: 450, y: 1555, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man35: {
                frame: { x: 600, y: 1555, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man36: {
                frame: { x: 750, y: 1555, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },

            man37: {
                frame: { x: 0, y: 1706, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man38: {
                frame: { x: 150, y: 1706, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man39: {
                frame: { x: 300, y: 1706, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man40: {
                frame: { x: 450, y: 1706, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man41: {
                frame: { x: 600, y: 1706, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man42: {
                frame: { x: 750, y: 1706, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },

            man43: {
                frame: { x: 0, y: 1857, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man44: {
                frame: { x: 150, y: 1857, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },
            man45: {
                frame: { x: 300, y: 1857, w: 150, h: 150 },
                sourceSize: { w: 150, h: 150 },
                spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 },
            },



            fire1: {
                frame: { x: 0, y: 0, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            },
            fire2: {
                frame: { x: 200, y: 0, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            },
            fire3: {
                frame: { x: 400, y: 0, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            },
            fire4: {
                frame: { x: 600, y: 0, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            },
            fire5: {
                frame: { x: 800, y: 0, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            },

            fire6: {
                frame: { x: 0, y: 200, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            },
            fire7: {
                frame: { x: 200, y: 200, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            },
            fire8: {
                frame: { x: 400, y: 200, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            },
            fire9: {
                frame: { x: 600, y: 200, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            },
            fire10: {
                frame: { x: 800, y: 200, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            },

            fire11: {
                frame: { x: 0, y: 400, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            },
            fire12: {
                frame: { x: 200, y: 400, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            },
            fire13: {
                frame: { x: 400, y: 400, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            },
            fire14: {
                frame: { x: 600, y: 400, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            },
            fire15: {
                frame: { x: 800, y: 400, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            },

            fire16: {
                frame: { x: 0, y: 600, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            },
            fire17: {
                frame: { x: 200, y: 600, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            },
            fire18: {
                frame: { x: 400, y: 600, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            },
            fire19: {
                frame: { x: 600, y: 600, w: 200, h: 200 },
                sourceSize: { w: 200, h: 200 },
                spriteSourceSize: { x: 0, y: 0, w: 200, h: 200 },
            }

        },
        meta: {
            image: '/images/balloonspritesheet.png',
            size: { w: 1000, h: 2200 }
        },
        animations: {
            balloonMan: ['man1', 'man2', 'man3', 'man4', 'man5', 'man6', 'man7', 'man8', 'man9',
                'man10', 'man11', 'man12', 'man13', 'man14', 'man15', 'man16', 'man17', 'man18', 'man19', 'man20',
                'man21', 'man22', 'man23', 'man24', 'man25', 'man26', 'man27', 'man28', 'man29', 'man30', 'man31', 'man32',
                'man33', 'man34', 'man35', 'man36', 'man37', 'man38', 'man39', 'man40', 'man41', 'man42', 'man43', 'man44', 'man45'
            ],
            balloonFire: ['fire1', 'fire2', 'fire3', 'fire4', 'fire5', 'fire6', 'fire7', 'fire8', 'fire9',
                'fire10', 'fire11', 'fire12', 'fire13', 'fire14', 'fire15', 'fire16', 'fire17', 'fire18', 'fire19'
            ],

        }
    }

    const bgContainer = new Container();
    bgContainer.width = app.screen.width;
    bgContainer.height = app.screen.height;
    app.stage.addChild(bgContainer);

    const background = new Graphics();
    // background.rect(0, 0, 100, 800).fill(0x30feda);
    bgContainer.addChild(background);

    const cloudContainer = new Container();
    cloudContainer.position.set(0, 0);
    app.stage.addChild(cloudContainer);

    const balloonContainer = new Container();
    app.stage.addChild(balloonContainer);
    balloonContainer.pivot.set(balloonContainer.width / 2, balloonContainer.height / 2);
    balloonContainer.x = app.screen.width / 2;
    balloonContainer.y = app.screen.height / 2 + 60;

    const bgTexture = await Assets.load('/images/background.png');
    const bg = new Sprite(bgTexture);
    bg.position.set(-150, -400);
    bgContainer.addChild(bg);

    // Colors to transition through
    const colorSequence = [0x30abda, 0x30abda, 0x0398fc, 0x026cde, 0x3b90ff, 0x056ffa, 0x2a53b5, 0x011c5c, 0x1e3159, 0x010f2e, 0x1a2640, 0x272b33, 0x101d52, 0x081447, 0x030c33, 0x070a30, 0x020d24];
    function hexToRgb(hex) {
        return {
            r: (hex >> 16) & 0xff,
            g: (hex >> 8) & 0xff,
            b: hex & 0xff,
        };
    }

    function rgbToHex(r, g, b) {
        return (r << 16) + (g << 8) + b;
    }

    let currentIndex = 0;
    let nextIndex = 1;
    let t = 0;
    const transitionSpeed = 0.001;

    const changeColor = () => {
        t += transitionSpeed;
        if (t > 1) {
            t = 0;
            currentIndex++;
            if (currentIndex >= colorSequence.length - 1) {
                currentIndex = colorSequence.length - 1;
            }
            nextIndex = currentIndex + 1;
        }
        const from = hexToRgb(colorSequence[currentIndex]);
        const to = hexToRgb(colorSequence[Math.min(nextIndex, colorSequence.length - 1)]);

        const r = Math.round(from.r + (to.r - from.r) * t);
        const g = Math.round(from.g + (to.g - from.g) * t);
        const b = Math.round(from.b + (to.b - from.b) * t);
        const colorHex = rgbToHex(r, g, b);

        background.clear();
        background.rect(0, 0, app.screen.width, app.screen.height);
        background.fill({ color: colorHex, alpha: 1 });
    }

    const texture = await Assets.load(atlasData.meta.image);
    const spritesheet = new Spritesheet(texture, atlasData);
    await spritesheet.parse();

    const cloudTexture1 = await Assets.load('/images/cloud1.png');
    const cloud1 = new Sprite(cloudTexture1);
    cloud1.position.set(-0, -450);
    cloud1.scale = 2;
    cloudContainer.addChild(cloud1);

    const cloudTexture2 = await Assets.load('/images/cloud2.png');
    const cloud2 = new Sprite(cloudTexture2);
    cloud2.position.set(0, -400);
    cloud2.scale = 4;
    cloud2.rotation = -32;
    cloudContainer.addChild(cloud2);

    const cloudTexture3 = await Assets.load('/images/cloud3.png');
    const cloud3 = new Sprite(cloudTexture3);
    cloud3.position.set(0, -580);
    cloud3.scale = 2;
    cloud3.alpha = 0.8;
    cloudContainer.addChild(cloud3);

    const cloudTexture4 = await Assets.load('/images/cloud4.png');
    const cloud4 = new Sprite(cloudTexture4);
    cloud4.position.set(0, -250);
    cloud4.alpha = 0.8;
    cloudContainer.addChild(cloud4);

    const cloudTexture5 = await Assets.load('/images/cloud5.png');
    const cloud5 = new Sprite(cloudTexture5);
    cloud5.position.set(100, -500);
    cloud5.alpha = 0.8;
    cloudContainer.addChild(cloud5);

    const cloudTexture6 = await Assets.load('/images/cloud6.png');
    const cloud6 = new Sprite(cloudTexture6);
    cloud6.position.set(300, -500);
    cloud6.alpha = 0.8;
    cloudContainer.addChild(cloud6);

    const movingCloud1 = () => {
        cloud1.position.y += 1;
        if (cloud1.position.y > 400) {
            cloud1.position.set(0, -450);
            app.ticker.remove(movingCloud1);
        }
    }
    const movingCloud2 = () => {
        cloud2.position.y += 1;
        if (cloud2.position.y > 1000) {
            cloud2.position.set(0, -400);
            app.ticker.remove(movingCloud2);
        }
    }
    const movingCloud3 = () => {
        cloud3.position.y += 1;
        if (cloud3.position.y > 400) {
            cloud3.position.set(0, -580);
            app.ticker.remove(movingCloud3);
        }
    }
    const movingCloud4 = () => {
        cloud4.position.y += 1;
        if (cloud4.position.y > 400) {
            cloud4.position.set(0, -250);
            app.ticker.remove(movingCloud4);
        }
    }
    const movingCloud5 = () => {
        cloud5.position.y += 1;
        if (cloud5.position.y > 400) {
            cloud5.position.set(100, -500);
            app.ticker.remove(movingCloud5);
        }
    }
    const movingCloud6 = () => {
        cloud6.position.y += 1;
        if (cloud6.position.y > 400) {
            cloud6.position.set(300, -500);
            app.ticker.remove(movingCloud6);
        }
    }

    const starTexture = await Assets.load('/images/star.png');
    const star1 = new Sprite(starTexture);
    star1.position.set(0, -200);
    star1.scale = 6;
    star1.alpha = 0;
    cloudContainer.addChild(star1);

    let alphaPhase = -Math.PI / 2;
    const starTwinkle = () => {
        star1.position.x -= 0.007;
        star1.position.y += 0.02;
        alphaPhase += 0.005;
        star1.alpha = 0.7 + 0.5 * Math.sin(alphaPhase);
    }

    const satTexture = await Assets.load('/images/sat.png');
    const satelite = new Sprite(satTexture);
    satelite.position.set(950, 50);
    cloudContainer.addChild(satelite);

    const satMoving = () => {
        satelite.position.x -= 0.5;
        satelite.position.y += 0.15;
        satelite.rotation += 0.0001;
        if (satelite.position.x < -200) {
            app.ticker.remove(satMoving);
        }
    }

    const moonTexture1 = await Assets.load('/images/moon1.png');
    const moon1 = new Sprite(moonTexture1);
    moon1.position.set(950, -150);
    cloudContainer.addChild(moon1);

    const moon1Moving = () => {
        moon1.position.x -= 0.5;
        moon1.position.y += 0.15;
        if (moon1.position.x < -400) {
            app.ticker.remove(moon1Moving);
        }
    }

    const moonTexture2 = await Assets.load('/images/moon.png');
    const moon2 = new Sprite(moonTexture2);
    moon2.position.set(950, -200);
    moon2.scale = 2;
    cloudContainer.addChild(moon2);

    const moon2Moving = () => {
        moon2.position.x -= 0.02;
        moon2.position.y += 0.001;
        if (moon2.position.x < -300) {
            app.ticker.remove(moon2Moving);
        }
    }

    const rockTexture1 = await Assets.load('/images/rock1.png');
    const rock1 = new Sprite(rockTexture1);
    rock1.position.set(1100, -70);
    rock1.anchor.set(0.5);
    cloudContainer.addChild(rock1);

    const rock1Moving = () => {
        rock1.position.x -= 0.1;
        rock1.position.y += 0.1;
        rock1.rotation += 0.002;
        if (rock1.position.x < -200) {
            app.ticker.remove(rock1Moving);
        }
    }

    const balloonpartTexture = await Assets.load('/images/balloonpart.png');
    const balloonPart = new Sprite(balloonpartTexture);
    balloonPart.position.set(357, 312);
    balloonPart.scale = 0.6;
    balloonContainer.addChild(balloonPart);

    const balloonFireSprite = new AnimatedSprite(spritesheet.animations.balloonFire);
    balloonFireSprite.animationSpeed = 0.2;
    balloonFireSprite.position.set(-35, 20);
    balloonFireSprite.scale = 0.35;
    balloonFireSprite.play();
    balloonContainer.addChild(balloonFireSprite);

    const balloonManSprite = new AnimatedSprite(spritesheet.animations.balloonMan);
    balloonManSprite.animationSpeed = 0.1
    balloonManSprite.position.set(-40, 60);
    balloonManSprite.scale = 0.5;
    balloonManSprite.play();
    balloonContainer.addChild(balloonManSprite);

    const balloonTexture = await Assets.load('/images/balloon.png');
    const balloon = new Sprite(balloonTexture);
    balloon.position.set(0, 0);
    balloon.scale = 0.6;
    balloon.anchor.set(0.5);
    balloonContainer.addChild(balloon);

    // Control variables
    let isMoving = true;
    let isShakingLeft = true;
    let isShakingRight = true;
    let movingDown = false;
    let speed = 1;
    let moveDownLimit = 300; // how far to move down
    let rotSpeed = 0.0001;
    let movedDown = 0;
    let count = 0;
    let gasOut = false;

    // Ticker function to update movement
    app.ticker.add(() => {
        if (!isMoving) return;

        if (isShakingLeft) {
            balloonContainer.rotation += rotSpeed
            balloonContainer.position.y += 0.03
            count++;
            if (count == 100) {
                isShakingLeft = false;
                isShakingRight = true;
                count = -100;
            }
        } else if (isShakingRight) {
            balloonContainer.rotation -= rotSpeed
            balloonContainer.position.y -= 0.03
            count++;
            if (count == 100) {
                isShakingRight = false;
                isShakingLeft = true;
                count = -100;
            }
        }

        if (gasOut) {
            balloonContainer.position.y += 2
        }

        if (movingDown) {
            bg.position.y += 3;
            movedDown += speed;
            if (movedDown >= moveDownLimit) {
                stopMovement(); // Or you can choose to continue in another direction
            }
        }
    });

    // Function to start the movement
    function startMovement() {
        isMoving = true;
        rotSpeed = 0.001;
        movingDown = true;
        movedDown = 0;
    }

    // Function to stop movement
    function stopMovement() {
        movingDown = false;
    }

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "roundStarts") {
            if (sound) { tiktakSound.play(); tiktakSound.loop = true; }
            allBets.length = 0;
            type = data.type;
            rId = data.rId;
            rStatus = data.rStatus;
            bStatus = data.bStatus;
            sCounter = data.sCounter;
            bTime = data.bTime;

            speed = 1;
            gasOut = false;
            count = 0;
            balloonContainer.rotation = 0;
            balloonContainer.x = app.screen.width / 2;
            balloonContainer.y = app.screen.height / 2 + 60;
            bg.position.set(-150, -400);

            currentIndex = 0;
            nextIndex = 1;
            t = 0;
            background.clear();
            background.rect(0, 0, app.screen.width, app.screen.height);
            background.fill({ color: 0x30abda });

            cloud1.position.set(0, -450);
            cloud2.position.set(0, -400);
            cloud3.position.set(0, -580);
            cloud4.position.set(0, -250);
            cloud5.position.set(100, -500);
            cloud6.position.set(300, -500);
            app.ticker.remove(movingCloud1);
            app.ticker.remove(movingCloud2);
            app.ticker.remove(movingCloud3);
            app.ticker.remove(movingCloud4);
            app.ticker.remove(movingCloud5);
            app.ticker.remove(movingCloud6);

            star1.alpha = 0;
            star1.position.set(0, -200);
            app.ticker.remove(starTwinkle);

            satelite.rotation = 0;
            satelite.position.set(950, 50);
            app.ticker.remove(satMoving);

            moon1.position.set(950, -150);
            app.ticker.remove(moon1Moving);

            moon2.position.set(950, -100);
            app.ticker.remove(moon2Moving);

            rock1.rotation = 0;
            rock1.position.set(1100, -70);
            app.ticker.remove(rock1Moving);

            document.querySelector(".crash-result").classList.add("hidden");
            document.querySelector(".red-hot-line-timer-layer").style.display = "flex";
            document.querySelector(".red-hot-line-timer-count").textContent = data.bTime;

            if (betInQueueLeft.length) {
                PLACE_L_BET();
                HIDE_L_CANCEL_BTN();
                SHOW_L_WAIT_BTN();
                betInQueueLeft.pop();
                if (autoBetLeft) {
                    autoBetRoundCountLeft -= 1;
                    autoBetCountHolderLeft.textContent = autoBetRoundCountLeft;
                    if (autoBetRoundCountLeft === 0) {
                        autoBetLeft = false;
                        console.log("autobetleft    ------", autoBetLeft)
                        console.log("    ------", autoBetRoundCountLeft)
                        autoBetSwitchLeft.classList.toggle('active');
                        document.querySelector('.check-indicator.left').classList.toggle('active');
                        document.getElementById('auto-bet-icon-left').style.display = "flex";
                        autoBetCountHolderLeft.style.display = "none";
                        document.querySelector('.bets-cashout-action-check.left').classList.add('disabled');
                    }
                }
            } else {
                HIDE_L_NEXT_BET_BTN();
                SHOW_L_BET_BTN();
            }

            if (betInQueueRight.length) {
                PLACE_R_BET();
                HIDE_R_CANCEL_BTN();
                SHOW_R_WAIT_BTN();
                betInQueueRight.pop();
                if (autoBetRight) {
                    autoBetRoundCountRight -= 1;
                    autoBetCountHolderRight.textContent = autoBetRoundCountRight;
                    if (autoBetRoundCountRight === 0) {
                        autoBetRight = false;
                        autoBetSwitchRight.classList.toggle('active');
                        document.querySelector('.check-indicator.right').classList.toggle('active');
                        document.getElementById('auto-bet-icon-right').style.display = "flex";
                        autoBetCountHolderRight.style.display = "none";
                        document.querySelector('.bets-cashout-action-check.right').classList.add('disabled');
                    }
                }
            } else {
                HIDE_R_NEXT_BET_BTN();
                SHOW_R_BET_BTN();
            }

        } else if (data.type === "updateBetTime") {
            type = data.type;
            document.querySelector(".red-hot-line-timer-count").textContent = data.bTime;

        } else if (data.type === "updateBetStatus") {
            if (sound) { tiktakSound.pause(); }
            document.querySelector(".red-hot-line-timer-layer").style.display = "none";
            if (betPlacedLeft) {
                HIDE_L_WAIT_BTN();
                SHOW_L_CASHOUT_BTN();
            } else {
                HIDE_L_BET_BTN();
                SHOW_L_NEXT_BET_BTN();
            }

            if (betPlacedRight) {
                HIDE_R_WAIT_BTN();
                SHOW_R_CASHOUT_BTN();
            } else {
                HIDE_R_BET_BTN();
                SHOW_R_NEXT_BET_BTN();
            }

            startMovement();
            app.ticker.add(changeColor);

        } else if (data.type === "updateShowCounter") {
            if (data.sCounter) {
                addLoaderDiv();
                document.querySelector(".counter").classList.remove("hidden");
            } else {
                addNewResult(rId, counter);
                prevResults.pop();
                prevResults.unshift({ roundId: rId, result: counter });

                document.querySelector(".counter").classList.add("hidden");
                document.querySelector(".crash-result").innerHTML = `<span>x</span> ${counter}`;
                if (!betInQueueLeft.length) {
                    HIDE_L_CASHOUT_BTN();
                    SHOW_L_NEXT_BET_BTN();
                    document.querySelector(".bets-actions-betting-form.left").classList.remove("active");
                }

                if (autoBetLeft) {
                    HIDE_L_NEXT_BET_BTN();
                    HIDE_L_CASHOUT_BTN();
                    PLACE_L_BET_IN_QUEUE();
                    SHOW_L_CANCEL_BTN();
                }

                if (!betInQueueRight.length) {
                    HIDE_R_CASHOUT_BTN();
                    SHOW_R_NEXT_BET_BTN();
                    document.querySelector(".bets-actions-betting-form.right").classList.remove("active");
                }

                if (autoBetRight) {
                    HIDE_R_NEXT_BET_BTN();
                    HIDE_R_CASHOUT_BTN();
                    PLACE_R_BET_IN_QUEUE();
                    SHOW_R_CANCEL_BTN();
                }
                if (sound && (betPlacedLeft || betPlacedRight)) { loseSound.play(); }
            }
        } else if (data.type === "updateCounter") {
            type = data.type;
            if (flag) {
                flag = 0;
                startMovement();
                app.ticker.add(changeColor);
                addLoaderDiv();

                HIDE_L_BET_BTN();
                SHOW_L_NEXT_BET_BTN();

                HIDE_R_BET_BTN();
                SHOW_R_NEXT_BET_BTN();
            }
            counter = data.val;
            document.querySelector(".counter").innerHTML = `<span>x</span> ${counter}`;

            if (counter >= 1.01 && counter <= 1.02) {
                app.ticker.add(movingCloud1);
            }
            if (counter >= 1.33 && counter <= 1.34) {
                app.ticker.add(movingCloud2);
            }
            if (counter >= 3.02 && counter <= 3.04) {
                app.ticker.add(movingCloud6);
            }
            if (counter >= 4.96 && counter <= 5) {
                app.ticker.add(movingCloud5);
            }
            if (counter >= 6 && counter <= 6.05) {
                app.ticker.add(movingCloud4);
            }
            if (counter >= 9.2 && counter <= 9.25) {
                app.ticker.add(movingCloud3);
            }
            if (counter >= 9.25 && counter <= 9.35) {
                app.ticker.add(movingCloud1);
            }
            if (counter >= 15.3 && counter <= 15.5) {
                app.ticker.add(movingCloud4);
                app.ticker.add(starTwinkle);
            }
            if (counter >= 22.2 && counter <= 22.5) {
                app.ticker.add(movingCloud5);
            }
            if (counter >= 35.2 && counter <= 35.5) {
                app.ticker.add(movingCloud6);
            }
            if (counter >= 95 && counter <= 96) {
                app.ticker.add(satMoving);
            }
            if (counter >= 200 && counter <= 202) {
                app.ticker.add(moon2Moving);
            }
            if (counter >= 500 && counter <= 505) {
                app.ticker.add(rock1Moving);
            }


            if (betPlacedLeft) {
                L_cashout_amount_txt.textContent = parseFloat((betAmountLeft * counter).toFixed(2));
                if (autoCashoutLeft && counter >= autoCashoutValueLeft) {
                    HIDE_L_CASHOUT_BTN();
                    SHOW_L_NEXT_BET_BTN();
                    CASHOUT_L_BET();
                }
            }

            if (betPlacedRight) {
                R_cashout_amount_txt.textContent = parseFloat((betAmountRight * counter).toFixed(2));
                if (autoCashoutRight && counter >= autoCashoutValueRight) {
                    HIDE_R_CASHOUT_BTN();
                    SHOW_R_NEXT_BET_BTN();
                    CASHOUT_R_BET();
                }
            }
        } else if (data.type === "roundClosed") {
            if (sound) { burnSound.play(); }
            rotSpeed = 0.0001;
            gasOut = true;
            app.ticker.remove(changeColor);
            app.ticker.remove(starTwinkle);

            document.querySelector(".counter").classList.add("hidden");
            setTimeout(() => {
                document.querySelector(".crash-result").classList.remove("hidden");
            }, 600);

            L_cashout_amount_txt.textContent = 0;
            betPlacedLeft = false;
            document.querySelector(".bets-actions-betting-range.left").classList.remove("disabled");
            document.querySelector(".bets-cashout-action.left").classList.remove("disabled");

            R_cashout_amount_txt.textContent = 0;
            betPlacedRight = false;
            document.querySelector(".bets-actions-betting-range.right").classList.remove("disabled");
            document.querySelector(".bets-cashout-action.right").classList.remove("disabled");
            bets.forEach(element => {
                myBets.unshift(element);
            });
            bets.length = 0;

        } else if (data.type === "updateTime") {
            serverDataTime = data.time;
            document.querySelector(".timer").textContent = data.time;;
        } else if (data.type === "liveBet") {
            const betData = JSON.parse(data.msg)
            console.log(betData.x);
            if (betData.x !== 0) {
                const index = allBets.findIndex(p => p.player === betData.player && p.btnId === betData.btnId);
                if (index !== -1) {
                    allBets[index] = { ...allBets[index], x: betData.x, win: betData.win.toFixed(2) };
                }
            } else {
                allBets.unshift(betData);
            }
            console.log(Array.from(allBets));
        }
    };
})();

const socket = new WebSocket("ws://localhost:3000");
socket.onopen = (e) => {
    console.log("Connected to WebSocket server");
};

socket.onmessage = (e) => {
    // console.log(JSON.parse(e.data));
    const d = JSON.parse(e.data)
    if (d.type === "system" && !d.message.bStatus) {
        document.querySelector('.counter').classList.remove('hidden');
        document.querySelector('.red-hot-line-timer-layer').style.display = 'none';
        flag = 1;
    }
};

// Function to send (broadcast via server)
function broadcastMessage(msg) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msg));
    }
};



















menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuDiv.classList.toggle("hidden");
    document.getElementById("menu-icon").classList.toggle("fa-bars");
    document.getElementById("menu-icon").classList.toggle("fa-xmark");
})

document.addEventListener('click', (e) => {
    if (!menuDiv.classList.contains('hidden') && avatarHolder.classList.contains('hidden')) {
        if (!menuList.contains(e.target) && e.target !== menuBtn) {
            menuDiv.classList.add("hidden");
            document.getElementById("menu-icon").classList.add("fa-bars");
            document.getElementById("menu-icon").classList.remove("fa-xmark");
        }
    }
})

document.getElementById("change-avatar").addEventListener('click', () => {
    document.getElementById("avatar-holder").classList.remove("hidden");
})

document.getElementById("close-avatar-holder").addEventListener('click', () => {
    avatarHolder.classList.add("hidden");
})

// TODO: set avatar image to as profile

soundSwitch.addEventListener('click', () => {
    soundSwitch.classList.toggle('active');
    document.getElementById('vol-icon').classList.toggle("fa-volume-xmark");
    document.getElementById('vol-icon').classList.toggle("fa-volume-high");
    if (sound) {
        sound = false;
        bgMusic.pause();
    }
    else {
        sound = true;
        bgMusic.play();
        bgMusic.loop = true;
        bgMusic.volume = 0.3;
    }
})


// SELECT BETS TAB AND PANEL

betsTab.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        betsTab.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        betsPanel.forEach(panel => {
            if (panel.dataset.tab === target) {
                panel.classList.remove('hidden');
            } else {
                panel.classList.add('hidden');
            }
        })
    })
})


// POPULATE ALL BETS PANEL
function renderAllBetsTable() {
    allBetsBody.innerHTML = allBets.map(bet => `
      <div class="bets-table-row ${bet.x > 0 ? 'active' : ''}">
        <div class="bets-table-col body-col">${bet.player}</div>
        <div class="bets-table-col body-col bold bet-col">${bet.bet}₹</div>
        <div class="bets-table-col body-col bold count-col">${bet.x > 0 ? bet.x : '-'}</div>
        <div class="bets-table-col body-col hero-color win-col">${bet.win > 0 ? bet.win + '₹' : '-'}</div>
      </div>
    `).join('');
}


renderAllBetsTable();


// POPULATE MY BETS PANEL
function renderMyBetsTable() {
    myBetsBody.innerHTML = myBets.map(bet => `
      <div class="bets-table-row my-bets ${bet.x > 0 ? 'active' : ''}">
        <div class="bets-table-row-inner">
          <div class="bets-table-col body-col">${bet.date}</div>
          <div class="bets-table-col body-col bold bet-col">${bet.bet}₹</div>
          <div class="bets-table-col body-col bold count-col">${bet.x > 0 ? bet.x : '-'}</div>
          <div class="bets-table-col body-col hero-color win-col">${bet.win > 0 ? bet.win + '₹' : '-'}</div>
          <i class="my-bets-arrow fa-solid fa-angle-down"></i>
        </div>
        <div class="bets-table-collapsed-content">
          <div class="bets-table-collapsed-content-inner">
            <div class="bets-table-collapsed-column">
              <span class="bets-table-collapsed-title">Balance before:</span>
              <p class="bets-table-collapsed-balance">${bet.balBefore}₹</p>
            </div>
            <div class="bets-table-collapsed-column">
              <span class="bets-table-collapsed-title">Balance after:</span>
              <p class="bets-table-collapsed-balance green">${bet.balAfter}₹</p>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Add click listeners to arrows after rendering
    myBetsBody.querySelectorAll('.my-bets-arrow').forEach(arrow => {
        arrow.addEventListener('click', () => {
            arrow.closest('.bets-table-row').classList.toggle('open');
        });
    });
}


renderMyBetsTable();


// POPULATE HIGHEST RESULT PANEL
function renderHighestTable() {
    highestTableBody.innerHTML = highestCrash.map(bet => `
      <div class="bets-table-row">
        <div class="bets-table-col body-col">${bet.date}</div>
        <div class="bets-table-col body-col bold count-col">${bet.x.toFixed(2)}</div>
        <div class="bets-table-col body-col hero-color info-col">
          <i class="fa-solid fa-circle-check"></i>
        </div>
      </div>
    `).join('');
}


renderHighestTable();


// LOADING ANIMATION FOR THE NEXT ROUND START
let currentIndex = Array.from(thumbs).findIndex(el => el.classList.contains('inactive'));
setInterval(() => {
    // Remove inactive from current
    thumbs[currentIndex].classList.remove('inactive');
    // Move to next index (wrap around)
    currentIndex = (currentIndex + 1) % thumbs.length;
    // Add inactive to next
    thumbs[currentIndex].classList.add('inactive');
}, 200);


//  POLPULATE SCORE BOARD
function addNewResult(roundId, value) {
    const loader = betsScores.querySelector('.loader-new');
    if (loader) loader.remove();

    const scoreDiv = document.createElement('div');
    scoreDiv.classList.add('bets-scores-item');
    scoreDiv.dataset.round = roundId;
    scoreDiv.textContent = `x${value}`;

    if (value >= 2 && value < 20) {
        scoreDiv.classList.add('orange');
    } else if (value >= 20 && value < 100) {
        scoreDiv.classList.add('blue');
    } else if (value >= 100) {
        scoreDiv.classList.add('red');
    }

    betsScores.insertBefore(scoreDiv, betsScores.firstChild);
}

function addLoaderDiv() {
    const lastItem = betsScores.lastElementChild;
    if (lastItem) lastItem.remove();

    const loaderDiv = document.createElement('div');
    loaderDiv.classList.add('loader-new', 'pointer');
    loaderDiv.innerHTML = `
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  `;
    betsScores.insertBefore(loaderDiv, betsScores.firstChild);
}


// POPULATE PREVIOUS RESULTS POPUP PANEL


function renderList(results) {
    listElement.innerHTML = ""; // Clear first
    results.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("last-statistics-list-item");

        const div = document.createElement("div");
        div.classList.add("last-statistics-round-item");
        div.textContent = `x${item.result}`;

        // Add color class based on result value
        if (item.result >= 2 && item.result < 20) {
            div.classList.add("orange");
        } else if (item.result >= 20 && item.result < 100) {
            div.classList.add("blue");
        } else if (item.result >= 100) {
            div.classList.add("red");
        }

        const p = document.createElement("p");
        p.classList.add("last-statistics-round");
        p.textContent = item.roundId;

        li.appendChild(div);
        li.appendChild(p);
        listElement.appendChild(li);
    });
}




// LEFT BET ACTIONS EVENTLISTENERS STARTS
L_bet_btn.addEventListener("click", () => {
    if (sound) { clickSound.play(); }
    betAmountLeft = inputBetAmountLeft;
    if (betAmountLeft <= balance) {
        PLACE_L_BET();
        HIDE_L_BET_BTN();
        SHOW_L_WAIT_BTN();
    } else {
        addNotification("You have low balance! Please recharge.", "warning");
    }
});

L_next_bet_btn.addEventListener("click", () => {
    if (sound) { clickSound.play(); }
    betAmountLeft = inputBetAmountLeft;
    if (betAmountLeft <= balance) {
        PLACE_L_BET_IN_QUEUE();
        HIDE_L_NEXT_BET_BTN();
        SHOW_L_CANCEL_BTN();
        addNotification("Your bet will be placed in Next Round.", "warning");
    } else {
        addNotification("You have low balance! Please recharge.", "warning");
    }
});

L_cashout_btn.addEventListener("click", () => {
    if (sound) { clickSound.play(); }
    HIDE_L_CASHOUT_BTN();
    SHOW_L_NEXT_BET_BTN();
    CASHOUT_L_BET();
});

L_cancel_bet_btn.addEventListener("click", () => {
    if (sound) { clickSound.play(); }
    CANCEL_L_BET();
    HIDE_L_CANCEL_BTN();
    SHOW_L_NEXT_BET_BTN();
});
// LEFT EVENTLISTENERS ENDS



// RIGHT BET ACTIONS EVENTLISTENERS STARTS
R_bet_btn.addEventListener("click", () => {
    if (sound) { clickSound.play(); }
    betAmountRight = inputBetAmountRight;
    if (betAmountRight <= balance) {
        PLACE_R_BET();
        HIDE_R_BET_BTN();
        SHOW_R_WAIT_BTN();
    } else {
        addNotification("You have low balance! Please recharge.", "warning");
    }
});

R_next_bet_btn.addEventListener("click", () => {
    if (sound) { clickSound.play(); }
    betAmountRight = inputBetAmountRight;
    if (betAmountRight <= balance) {
        PLACE_R_BET_IN_QUEUE();
        HIDE_R_NEXT_BET_BTN();
        SHOW_R_CANCEL_BTN();
        addNotification("Your bet will be placed in Next Round.", "warning");
    } else {
        addNotification("You have low balance! Please recharge.", "warning");
    }
});

R_cashout_btn.addEventListener("click", () => {
    if (sound) { clickSound.play(); }
    HIDE_R_CASHOUT_BTN();
    SHOW_R_NEXT_BET_BTN();
    CASHOUT_R_BET();
});

R_cancel_bet_btn.addEventListener("click", () => {
    if (sound) { clickSound.play(); }
    CANCEL_R_BET();
    HIDE_R_CANCEL_BTN();
    SHOW_R_NEXT_BET_BTN();
});
// RIGHT EVENTLISTENERS ENDS




// ACTION FUNCTIONS FOR LEFT BTNS STARTS
function PLACE_L_BET() {
    betAmountLeft = inputBetAmountLeft;
    betPlacedLeft = true;
    bets.unshift({
        roundId: rId,
        date: serverDataTime,
        bet: betAmountLeft,
        x: 0,
        win: 0,
        balBefore: balance,
        balAfter: balance,
        btnId: 1
    });
    balance -= betAmountLeft;
    UPDATE_BALANCE(balance);
    console.log("bet Placed" + betAmountLeft);
    addNotification("Bet Placed!", "success");
    document.querySelector(".bets-actions-betting-range.left").classList.add("disabled");
    document.querySelector(".bets-cashout-action.left").classList.add("disabled");
    document.querySelector(".bets-actions-betting-form.left").classList.add("active");
    broadcastMessage({ player: userId, bet: betAmountLeft, x: 0, win: 0, btnId: "1" });
}

function PLACE_L_BET_IN_QUEUE() {
    betInQueueLeft.length = 0;
    betInQueueLeft.push({ amt: betAmountLeft });
    console.log("bet in queue  " + JSON.stringify(betInQueueLeft));
}

function CASHOUT_L_BET() {
    betPlacedLeft = false;
    document.querySelector(".bets-actions-betting-form.left").classList.remove("active");
    document.querySelector(".bets-actions-betting-range.left").classList.remove("disabled");
    document.querySelector(".bets-cashout-action.left").classList.remove("disabled");
    balance += betAmountLeft * counter;
    addNotification(`You win ${(betAmountLeft * counter).toFixed(2)}`, "success");
    UPDATE_BALANCE(balance);
    broadcastMessage({ player: userId, x: counter, win: betAmountLeft * counter, btnId: "1" });
    console.log("cashout bet ");
    if (autoBetLeft) {
        HIDE_L_NEXT_BET_BTN();
        HIDE_L_CASHOUT_BTN();
        PLACE_L_BET_IN_QUEUE();
        SHOW_L_CANCEL_BTN();
    }
    const index = bets.findIndex(b => b.roundId === rId && b.btnId === 1);
    if (index !== -1) {
        bets[index] = { ...bets[index], x: counter, win: (betAmountLeft * counter).toFixed(2), balAfter: (bets[index].balBefore - betAmountLeft + (betAmountLeft * counter)).toFixed(2) };
    }
    if (sound) { winSound.play(); }
}

function CANCEL_L_BET() {
    betInQueueLeft.pop();
    if (autoBetLeft) {
        autoBetLeft = false;
        autoBetRoundCountLeft = 0;
        document.getElementById('auto-bet-icon-left').style.display = "flex";
        autoBetCountHolderLeft.style.display = "none";
        autoBetSwitchLeft.classList.toggle('active');
        document.querySelector('.check-indicator.left').classList.toggle('active');
        document.querySelector('.bets-cashout-action-check.left').classList.add('disabled');
    }
    console.log("Bet in queue Cancelled ");
}
// ACTION FUNCTIONS FOR LEFT BTNS ENDS




// ACTION FUNCTIONS FOR RIGHT BTNS STARTS
function PLACE_R_BET() {
    betAmountRight = inputBetAmountRight;
    betPlacedRight = true;
    bets.unshift({
        roundId: rId,
        date: serverDataTime,
        bet: betAmountRight,
        x: 0,
        win: 0,
        balBefore: balance,
        balAfter: balance,
        btnId: 2
    });
    balance -= betAmountRight;
    UPDATE_BALANCE(balance);
    console.log("bet Placed" + betAmountRight);
    addNotification("Bet Placed!", "success");
    document.querySelector(".bets-actions-betting-range.right").classList.add("disabled");
    document.querySelector(".bets-cashout-action.right").classList.add("disabled");
    document.querySelector(".bets-actions-betting-form.right").classList.add("active");
    broadcastMessage({ player: userId, bet: betAmountRight, x: 0, win: 0, btnId: "2" });
}

function PLACE_R_BET_IN_QUEUE() {
    betInQueueRight.length = 0;
    betInQueueRight.push({ amt: betAmountRight });
    console.log("bet in queue  " + JSON.stringify(betInQueueRight));
}

function CASHOUT_R_BET() {
    betPlacedRight = false;
    document.querySelector(".bets-actions-betting-form.right").classList.remove("active");
    document.querySelector(".bets-actions-betting-range.right").classList.remove("disabled");
    document.querySelector(".bets-cashout-action.right").classList.remove("disabled");
    balance += betAmountRight * counter;
    addNotification(`You win ${(betAmountRight * counter).toFixed(2)}`, "success");
    UPDATE_BALANCE(balance);
    broadcastMessage({ player: userId, x: counter, win: betAmountRight * counter, btnId: "2" });
    console.log("cashout bet ");
    if (autoBetRight) {
        HIDE_R_NEXT_BET_BTN();
        HIDE_R_CASHOUT_BTN();
        PLACE_R_BET_IN_QUEUE();
        SHOW_R_CANCEL_BTN();
    }
    const index = bets.findIndex(b => b.roundId === rId && b.btnId === 2);
    if (index !== -1) {
        bets[index] = { ...bets[index], x: counter, win: (betAmountRight * counter).toFixed(2), balAfter: (bets[index].balBefore - betAmountRight + (betAmountRight * counter)).toFixed(2) };
    }
    if (sound) { winSound.play(); }
}

function CANCEL_R_BET() {
    betInQueueRight.pop();
    if (autoBetRight) {
        autoBetRight = false;
        autoBetRoundCountRight = 0;
        document.getElementById('auto-bet-icon-right').style.display = "flex";
        autoBetCountHolderRight.style.display = "none";
        autoBetSwitchRight.classList.toggle('active');
        document.querySelector('.check-indicator.right').classList.toggle('active');
        document.querySelector('.bets-cashout-action-check.right').classList.add('disabled');
    }
    console.log("Bet in queue Cancelled ");
}
// ACTION FUNCTIONS FOR RIGHT BTNS ENDS



// BUTTON FUNCTIONS LEFT STARTS
function SHOW_L_BET_BTN() {
    L_bet_btn.classList.remove("hidden");
}
function HIDE_L_BET_BTN() {
    L_bet_btn.classList.add("hidden");
}
function SHOW_L_WAIT_BTN() {
    L_wait_btn.classList.remove("hidden");
}
function HIDE_L_WAIT_BTN() {
    L_wait_btn.classList.add("hidden");
}
function SHOW_L_NEXT_BET_BTN() {
    L_next_bet_btn.classList.remove("hidden");
}
function HIDE_L_NEXT_BET_BTN() {
    L_next_bet_btn.classList.add("hidden");
}
function SHOW_L_CASHOUT_BTN() {
    L_cashout_btn.classList.remove("hidden");
}
function HIDE_L_CASHOUT_BTN() {
    L_cashout_btn.classList.add("hidden");
}
function SHOW_L_CANCEL_BTN() {
    L_cancel_bet_btn.classList.remove("hidden");
}
function HIDE_L_CANCEL_BTN() {
    L_cancel_bet_btn.classList.add("hidden");
}
// BUTTON FUNCTIONS LEFT ENDS



// BUTTON FUNCTIONS RIGHT STARTS
function SHOW_R_BET_BTN() {
    R_bet_btn.classList.remove("hidden");
}
function HIDE_R_BET_BTN() {
    R_bet_btn.classList.add("hidden");
}
function SHOW_R_WAIT_BTN() {
    R_wait_btn.classList.remove("hidden");
}
function HIDE_R_WAIT_BTN() {
    R_wait_btn.classList.add("hidden");
}
function SHOW_R_NEXT_BET_BTN() {
    R_next_bet_btn.classList.remove("hidden");
}
function HIDE_R_NEXT_BET_BTN() {
    R_next_bet_btn.classList.add("hidden");
}
function SHOW_R_CASHOUT_BTN() {
    R_cashout_btn.classList.remove("hidden");
}
function HIDE_R_CASHOUT_BTN() {
    R_cashout_btn.classList.add("hidden");
}
function SHOW_R_CANCEL_BTN() {
    R_cancel_bet_btn.classList.remove("hidden");
}
function HIDE_R_CANCEL_BTN() {
    R_cancel_bet_btn.classList.add("hidden");
}
// BUTTON FUNCTIONS RIGHT ENDS


// COMMON FUNCTIONS STARTS
function UPDATE_BALANCE(bal) {
    document.querySelector(".balance-text.amount").textContent = `₹${bal.toFixed(2)}`;
}
UPDATE_BALANCE(balance); //Initial Balance update

function addNotification(message, type = "success") {
    const wrapper = document.querySelector(".game-notification-wrapper");

    const animatedDiv = document.createElement("div");
    animatedDiv.className = "game-notification-animated sm";

    const notificationDiv = document.createElement("div");
    notificationDiv.className = `game-notification ${type} sm`;

    const p = document.createElement("p");
    p.className = "game-notification-text";
    p.textContent = message;

    wrapper.innerHTML = "";
    notificationDiv.appendChild(p);
    animatedDiv.appendChild(notificationDiv);
    wrapper.appendChild(animatedDiv);

    setTimeout(() => {
        animatedDiv.remove();
    }, 1500);
}
// COMMON FUNCTIONS ENDS




document.getElementById('game-rules').addEventListener('click', () => {
    document.querySelector('.fairness-popup-holder').classList.remove("hidden");
})
document.querySelector('.fairness-popup-head-column.close').addEventListener('click', () => {
    document.querySelector('.fairness-popup-holder').classList.add("hidden");
})

document.getElementById('prev-history').addEventListener('click', () => {
    document.getElementById('historyPopup').classList.remove('hidden');
    if (sound) { clickSound.play(); }
})

document.getElementById('close-history-icon').addEventListener('click', () => {
    document.getElementById('historyPopup').classList.add('hidden');
    if (sound) { clickSound.play(); }
})

// LEFT BUTTONS EVENTLISTENERS START
document.getElementById("decrement-bet-amt-left").addEventListener("click", () => {
    if (inputBetAmountLeft - 1 > MIN_BET) { inputBetAmountLeft = inputBetAmountLeft - 1 }
    else {
        inputBetAmountLeft = MIN_BET
        addNotification("Minimum bet Amount is " + MIN_BET, "warning");
    }
    betInputLeft.value = inputBetAmountLeft;
    document.getElementById('autobet-amt-left').textContent = `${inputBetAmountLeft.toFixed(2)}₹`
    if (sound) { clickSound.play(); }
});

document.getElementById("increment-bet-amt-left").addEventListener("click", () => {
    if (inputBetAmountLeft + 1 < MAX_BET) { inputBetAmountLeft = inputBetAmountLeft + 1 }
    else {
        inputBetAmountLeft = MAX_BET
        addNotification("Maximum bet Amount is " + MAX_BET, "warning");

    }
    betInputLeft.value = inputBetAmountLeft;
    document.getElementById('autobet-amt-left').textContent = `${inputBetAmountLeft.toFixed(2)}₹`
    if (sound) { clickSound.play(); }
});

document.getElementById("reset-bet-amt-left").addEventListener("click", () => {
    inputBetAmountLeft = 10;
    betInputLeft.value = inputBetAmountLeft;
    document.getElementById('autobet-amt-left').textContent = `${inputBetAmountLeft.toFixed(2)}₹`
    if (sound) { clickSound.play(); }
});

document.getElementById("ten-left").addEventListener("click", () => {
    if (inputBetAmountLeft + 10 < MAX_BET) { inputBetAmountLeft = inputBetAmountLeft + 10 }
    else {
        inputBetAmountLeft = MAX_BET
        addNotification("Maximum bet Amount is " + MAX_BET, "warning");
    }
    betInputLeft.value = inputBetAmountLeft;
    document.getElementById('autobet-amt-left').textContent = `${inputBetAmountLeft.toFixed(2)}₹`
    if (sound) { clickSound.play(); }
});

document.getElementById("fifty-left").addEventListener("click", () => {
    if (inputBetAmountLeft + 50 < MAX_BET) { inputBetAmountLeft = inputBetAmountLeft + 50 }
    else {
        inputBetAmountLeft = MAX_BET
        addNotification("Maximum bet Amount is " + MAX_BET, "warning");
    }
    betInputLeft.value = inputBetAmountLeft;
    document.getElementById('autobet-amt-left').textContent = `${inputBetAmountLeft.toFixed(2)}₹`
    if (sound) { clickSound.play(); }
});

document.getElementById("hundred-left").addEventListener("click", () => {
    if (inputBetAmountLeft + 100 < MAX_BET) { inputBetAmountLeft = inputBetAmountLeft + 100 }
    else {
        inputBetAmountLeft = MAX_BET
        addNotification("Maximum bet Amount is " + MAX_BET, "warning");
    }
    betInputLeft.value = inputBetAmountLeft;
    document.getElementById('autobet-amt-left').textContent = `${inputBetAmountLeft.toFixed(2)}₹`
    if (sound) { clickSound.play(); }
});

document.getElementById("five-hundred-left").addEventListener("click", () => {
    if (inputBetAmountLeft + 500 < MAX_BET) { inputBetAmountLeft = inputBetAmountLeft + 500 }
    else {
        inputBetAmountLeft = MAX_BET
        addNotification("Maximum bet Amount is " + MAX_BET, "warning");
    }
    betInputLeft.value = inputBetAmountLeft;
    document.getElementById('autobet-amt-left').textContent = `${inputBetAmountLeft.toFixed(2)}₹`
    if (sound) { clickSound.play(); }
});


betItemsLeft.forEach(item => {
    item.addEventListener("click", () => {
        if (item.classList.contains("buttonItem")) return;
        betItemsLeft.forEach(i => i.classList.remove("add-bet"));
        item.classList.add("add-bet");
        autoBetRoundCountLeft = parseInt(item.dataset.value, 10);
        const total = autoBetRoundCountLeft * inputBetAmountLeft;
        document.getElementById("total-amt-bet-left").textContent = `${total.toFixed(2)}₹`;
        if (sound) { clickSound.play(); }
    });
});

document.getElementById("auto-bet-icon-left").addEventListener('click', () => {
    document.getElementById('auto-bet-popup-left').classList.remove('hidden');
    if (sound) { clickSound.play(); }
});

document.getElementById("close-autobet-popup-left").addEventListener('click', () => {
    document.getElementById('auto-bet-popup-left').classList.add('hidden');
    betItemsLeft.forEach(i => i.classList.remove("add-bet"));
    autoBetRoundCountLeft = 0;
    document.getElementById("total-amt-bet-left").textContent = `0.00₹`;
    if (sound) { clickSound.play(); }
});

autoBetCountHolderLeft.addEventListener('click', () => {
    document.getElementById('auto-bet-popup-left').classList.remove('hidden');
    if (sound) { clickSound.play(); }
});
document.getElementById('autobet-ok-left').addEventListener('click', () => {
    if (autoBetRoundCountLeft === 0) {
        document.getElementById('auto-bet-popup-left').classList.add('hidden');
        document.getElementById("total-amt-bet-left").textContent = `0.00₹`;
    } else {
        betItemsLeft.forEach(i => i.classList.remove("add-bet"));
        document.getElementById('auto-bet-icon-left').style.display = "none";
        autoBetCountHolderLeft.style.display = "flex";
        autoBetCountHolderLeft.textContent = autoBetRoundCountLeft;
        document.querySelector('.bets-cashout-action-check.left').classList.remove('disabled');
        document.getElementById('auto-bet-popup-left').classList.add('hidden');
    }
    if (sound) { clickSound.play(); }
});

autoBetSwitchLeft.addEventListener('click', () => {
    if (sound) { clickSound.play(); }
    autoBetSwitchLeft.classList.toggle('active');
    document.querySelector('.check-indicator.left').classList.toggle('active');
    if (autoBetLeft) {
        autoBetLeft = false;
        autoBetRoundCountLeft = 0;
        document.getElementById('auto-bet-icon-left').style.display = "flex";
        autoBetCountHolderLeft.style.display = "none";
        document.querySelector('.bets-cashout-action-check.left').classList.add('disabled');
        autoBetCountHolderLeft.classList.add("disabled");
    } else {
        autoBetLeft = true;
        console.log(autoBetLeft);
        autoBetCountHolderLeft.classList.add("disabled");
        if (!betPlacedLeft) {
            if (type === "updateBetTime") {
                PLACE_L_BET();
                HIDE_L_BET_BTN();
                SHOW_L_WAIT_BTN()
                autoBetRoundCountLeft -= 1;
                autoBetCountHolderLeft.textContent = autoBetRoundCountLeft;
            }
            else {
                PLACE_L_BET_IN_QUEUE();
                HIDE_L_NEXT_BET_BTN();
                SHOW_L_CANCEL_BTN();
            }
        }
    }
});

autoCashoutInputLeft.addEventListener("change", () => {
    const value = parseFloat(autoCashoutInputLeft.value, 10);
    if (isNaN(value)) {
        autoCashoutLeft = false;
        autoCashoutValueLeft = 0;
        autoCashoutInputLeft.value = 0;
        addNotification("Input value is Not a Number", "warning");
        return;
    }

    if (value <= 1) {
        autoCashoutLeft = false;
        autoCashoutValueLeft = 0;
        autoCashoutInputLeft.value = 0;
        console.log(autoCashoutLeft);
    } else {
        autoCashoutLeft = true;
        autoCashoutValueLeft = value;
        autoCashoutInputLeft.value = value;
        console.log(autoCashoutLeft);
    }
});

// LEFT BUTTONS EVENTLISTENERS END





// RIGHT BUTTONS EVENTLISTENERS START

document.getElementById("decrement-bet-amt-right").addEventListener("click", () => {
    if (inputBetAmountRight - 1 > MIN_BET) { inputBetAmountRight = inputBetAmountRight - 1 }
    else {
        inputBetAmountRight = MIN_BET
        addNotification("Minimum bet Amount is " + MIN_BET, "warning");
    }
    betInputRight.value = inputBetAmountRight;
    document.getElementById('autobet-amt-right').textContent = `${inputBetAmountRight.toFixed(2)}₹`
    if (sound) { clickSound.play(); }
});

document.getElementById("increment-bet-amt-right").addEventListener("click", () => {
    if (inputBetAmountRight + 1 < MAX_BET) { inputBetAmountRight = inputBetAmountRight + 1 }
    else {
        inputBetAmountRight = MAX_BET
        addNotification("Maximum bet Amount is " + MAX_BET, "warning");
    }
    betInputRight.value = inputBetAmountRight;
    document.getElementById('autobet-amt-right').textContent = `${inputBetAmountRight.toFixed(2)}₹`
    if (sound) { clickSound.play(); }
});

document.getElementById("reset-bet-amt-right").addEventListener("click", () => {
    inputBetAmountRight = 10;
    betInputRight.value = inputBetAmountRight;
    document.getElementById('autobet-amt-right').textContent = `${inputBetAmountRight.toFixed(2)}₹`
    if (sound) { clickSound.play(); }
});

document.getElementById("ten-right").addEventListener("click", () => {
    if (inputBetAmountRight + 10 < MAX_BET) { inputBetAmountRight = inputBetAmountRight + 10 }
    else {
        inputBetAmountRight = MAX_BET
        addNotification("Maximum bet Amount is " + MAX_BET, "warning");
    }
    betInputRight.value = inputBetAmountRight;
    document.getElementById('autobet-amt-right').textContent = `${inputBetAmountRight.toFixed(2)}₹`
    if (sound) { clickSound.play(); }
});

document.getElementById("fifty-right").addEventListener("click", () => {
    if (inputBetAmountRight + 50 < MAX_BET) { inputBetAmountRight = inputBetAmountRight + 50 }
    else {
        inputBetAmountRight = MAX_BET
        addNotification("Maximum bet Amount is " + MAX_BET, "warning");
    }
    betInputRight.value = inputBetAmountRight;
    document.getElementById('autobet-amt-right').textContent = `${inputBetAmountRight.toFixed(2)}₹`
    if (sound) { clickSound.play(); }
});

document.getElementById("hundred-right").addEventListener("click", () => {
    if (inputBetAmountRight + 100 < MAX_BET) { inputBetAmountRight = inputBetAmountRight + 100 }
    else {
        inputBetAmountRight = MAX_BET
        addNotification("Maximum bet Amount is " + MAX_BET, "warning");
    }
    betInputRight.value = inputBetAmountRight;
    document.getElementById('autobet-amt-right').textContent = `${inputBetAmountRight.toFixed(2)}₹`
    if (sound) { clickSound.play(); }
});

document.getElementById("five-hundred-right").addEventListener("click", () => {
    if (inputBetAmountRight + 500 < MAX_BET) { inputBetAmountRight = inputBetAmountRight + 500 }
    else {
        inputBetAmountRight = MAX_BET
        addNotification("Maximum bet Amount is " + MAX_BET, "warning");
    }
    betInputRight.value = inputBetAmountRight;
    document.getElementById('autobet-amt-right').textContent = `${inputBetAmountRight.toFixed(2)}₹`
    if (sound) { clickSound.play(); }
});

betItemsRight.forEach(item => {
    item.addEventListener("click", () => {
        if (item.classList.contains("buttonItem")) return;
        betItemsRight.forEach(i => i.classList.remove("add-bet"));
        item.classList.add("add-bet");
        autoBetRoundCountRight = parseInt(item.dataset.value, 10);
        const total = autoBetRoundCountRight * inputBetAmountRight;
        document.getElementById("total-amt-bet-right").textContent = `${total.toFixed(2)}₹`;
        if (sound) { clickSound.play(); }
    });
});

document.getElementById("auto-bet-icon-right").addEventListener('click', () => {
    document.getElementById('auto-bet-popup-right').classList.remove('hidden');
    if (sound) { clickSound.play(); }
});

document.getElementById("close-autobet-popup-right").addEventListener('click', () => {
    document.getElementById('auto-bet-popup-right').classList.add('hidden');
    betItemsRight.forEach(i => i.classList.remove("add-bet"));
    autoBetRoundCountLeft = 0;
    document.getElementById("total-amt-bet-right").textContent = `0.00₹`;
    if (sound) { clickSound.play(); }
});

autoBetCountHolderRight.addEventListener('click', () => {
    document.getElementById('auto-bet-popup-right').classList.remove('hidden');
    if (sound) { clickSound.play(); }
});
document.getElementById('autobet-ok-right').addEventListener('click', () => {
    if (autoBetRoundCountRight === 0) {
        document.getElementById('auto-bet-popup-right').classList.add('hidden');
        document.getElementById("total-amt-bet-right").textContent = `0.00₹`;
    } else {
        betItemsRight.forEach(i => i.classList.remove("add-bet"));
        document.getElementById('auto-bet-icon-right').style.display = "none";
        autoBetCountHolderRight.style.display = "flex";
        autoBetCountHolderRight.textContent = autoBetRoundCountRight;
        document.querySelector('.bets-cashout-action-check.right').classList.remove('disabled');
        document.getElementById('auto-bet-popup-right').classList.add('hidden');
    }
    if (sound) { clickSound.play(); }
});

autoBetSwitchRight.addEventListener('click', () => {
    if (sound) { clickSound.play(); }
    autoBetSwitchRight.classList.toggle('active');
    document.querySelector('.check-indicator.right').classList.toggle('active');
    if (autoBetRight) {
        autoBetRight = false;
        autoBetRoundCountRight = 0;
        document.getElementById('auto-bet-icon-right').style.display = "flex";
        autoBetCountHolderRight.style.display = "none";
        document.querySelector('.bets-cashout-action-check.right').classList.add('disabled');
        autoBetCountHolderRight.classList.add("disabled");
    } else {
        autoBetRight = true;
        console.log(autoBetRight);
        autoBetCountHolderRight.classList.add("disabled");
        if (!betPlacedRight) {
            if (type === "updateBetTime") {
                PLACE_R_BET();
                HIDE_R_BET_BTN();
                SHOW_R_WAIT_BTN()
                autoBetRoundCountRight -= 1;
                autoBetCountHolderRight.textContent = autoBetRoundCountRight;
            }
            else {
                PLACE_R_BET_IN_QUEUE();
                HIDE_R_NEXT_BET_BTN();
                SHOW_R_CANCEL_BTN();
            }
        }
    }
});

autoCashoutInputRight.addEventListener("change", () => {
    const value = parseFloat(autoCashoutInputRight.value, 10);

    if (isNaN(value)) {
        autoCashoutRight = false;
        autoCashoutValueRight = 0;
        autoCashoutInputRight.value = 0;
        addNotification("Input value is Not a Number", "warning");
        return;
    }

    if (value <= 1) {
        autoCashoutRight = false;
        autoCashoutValueRight = 0;
        autoCashoutInputRight.value = 0;
        console.log(autoCashoutRight);
    } else {
        autoCashoutRight = true;
        autoCashoutValueRight = value;
        autoCashoutInputRight.value = value;
        console.log(autoCashoutRight);
    }
});
// RIGHT BUTTONS EVENTLISTENERS EBDS
