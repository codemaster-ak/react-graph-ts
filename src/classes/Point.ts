import {BASE_POINT_COLOR} from '../consts';

class Point {
    x: number;
    y: number;
    key: string;
    colour: string;

    constructor(x: number, y: number, key: string, colour = BASE_POINT_COLOR) {
        this.key = key
        this.x = x
        this.y = y
        this.colour = colour
    }
}

export default Point;