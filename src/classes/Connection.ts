import Point from './Point';
import {ConnectionColours} from "../enums";
import {ShapeI} from "../interfaces";

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

    static parseConnection(shape: object): Connection | undefined {
        if (shape.hasOwnProperty('from') &&
            shape.hasOwnProperty('to') &&
            shape.hasOwnProperty('weight')) {
            const connection = <Connection>shape
            const {from, to, weight, colour, key} = connection
            from.connections = []
            to.connections = []
            return new Connection(from, to, weight, colour, key)
        }
    }
}