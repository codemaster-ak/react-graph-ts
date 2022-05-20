import Point from './Point';
import {ConnectionColours} from "../enums";
import {ShapeI} from "../interfaces";
import Konva from "konva";

export default class Connection implements ShapeI {
    from: Point
    to: Point
    weight: number
    colour: ConnectionColours
    key: string

    constructor(
        from: Point,
        to: Point,
        weight = 1,
        colour = ConnectionColours.BASE,
        key?: string
    ) {
        this.from = from
        this.to = to
        this.weight = weight
        this.colour = colour
        this.key = key || String(new Date().getTime())
    }

    getName() {
        const {from, to} = this
        return from.key.substring(from.key.length - 2) + '-' + to.key.substring(to.key.length - 2)
    }

    getPointsCoords(): number[] {
        const {from, to} = this
        return [from.x, from.y, to.x, to.y]
    }
}