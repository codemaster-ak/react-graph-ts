import {PointColours} from "../enums";
import {EntityI} from "../interfaces";

export default class Point implements EntityI {
    x: number;
    y: number;
    key: string;
    colour: PointColours;

    constructor(x: number, y: number, colour: PointColours = PointColours.BASE, key?: string) {
        this.x = x
        this.y = y
        this.colour = colour
        this.key = key || String(new Date().getTime())
    }

    getName() {
        return this.key.substring(this.key.length - 2)
    }
}