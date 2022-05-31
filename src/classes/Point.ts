import {PointColours} from "../enums";
import {ShapeI} from "../interfaces";
import Connection from "./Connection";

export default class Point implements ShapeI {
    readonly radius: number = 20;
    x: number;
    y: number;
    key: string;
    colour: PointColours;
    connections: Connection[];

    constructor(
        x: number,
        y: number,
        colour: PointColours = PointColours.BASE,
        connections: Connection[] = [],
        key?: string
    ) {
        this.x = x
        this.y = y
        this.colour = colour
        this.connections = connections
        this.key = key || String(new Date().getTime())
    }

    getName() {
        return this.key.substring(this.key.length - 2)
    }

    removeConnections(): Point {
        this.connections = []
        return this
    }
}