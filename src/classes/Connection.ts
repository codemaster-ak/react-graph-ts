import Point from './Point';

export default class Connection {
    static readonly BASE_COLOR: string = '#656565'
    static readonly HIGHLIGHTED_COLOR: string = '#f00'
    from: Point
    to: Point
    weight: number
    colour: string
    key: string

    constructor(from: Point, to: Point, weight: number, colour: string = 'black', key: string) {
        this.from = from
        this.to = to
        this.weight = weight
        this.colour = colour
        this.key = key
    }

    getConnectionName() {
        const {from, to} = this
        return from.key.substring(from.key.length - 2) + '-' + to.key.substring(to.key.length - 2)
    }
}