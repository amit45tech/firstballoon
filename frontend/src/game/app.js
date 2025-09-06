import * as PIXI from "pixi.js";

export async function createApp(containerId) {
    const app = new PIXI.Application();
    const container = document.getElementById(containerId);

    await app.init({
        width: container.clientWidth,
        height: container.clientHeight,
        backgroundColor: 0x30abda
    });

    app.canvas.style.position = "absolute";
    container.appendChild(app.canvas);

    return app;
}
