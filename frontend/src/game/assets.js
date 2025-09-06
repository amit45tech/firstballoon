import { Assets, Spritesheet } from "pixi.js";

export async function loadSpritesheet(atlasData) {
    const texture = await Assets.load(atlasData.meta.image);
    const spritesheet = new Spritesheet(texture, atlasData);
    await spritesheet.parse();
    return spritesheet;
}

export async function loadImage(path) {
    return await Assets.load(path);
}

export async function loadSound(path) {
    return new Audio(path);
}