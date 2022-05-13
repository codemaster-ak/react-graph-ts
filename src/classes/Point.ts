export default class Point {
    static readonly BASE_COLOR: string = '#1890ff'
    static readonly HIGHLIGHTED_COLOR: string = '#f00'
    x: number;
    y: number;
    key: string;
    colour: string;

    constructor(x: number, y: number, key: string, colour = Point.BASE_COLOR) {
        this.key = key
        this.x = x
        this.y = y
        this.colour = colour
    }

    getPointName() {
        return this.key.substring(this.key.length - 2)
    }
}