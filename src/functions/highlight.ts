import Point from '../classes/Point';
import Connection from '../classes/Connection';
import {HIGHLIGHT_CONNECTION_COLOR, HIGHLIGHT_POINT_COLOR} from '../consts';

export function highlightPoints(path: number[], points: Point[]) {
    return points.map((point: Point, index: number) => {
        if (path.includes(index)) return new Point(point.x, point.y, point.key, HIGHLIGHT_POINT_COLOR)
        return point
    })
}

export function highlightConnections(path: number[], points: Point[], connections: Connection[]) {
    let connectionsCopy = JSON.parse(JSON.stringify(connections))
    for (let i = 0; i < path.length - 1; i++) {
        const fromPoint = points[path[i]]
        const toPoint = points[path[i + 1]]
        for (let j = 0; j < connectionsCopy.length; j++) {
            if ((connectionsCopy[j].from === fromPoint.key && connectionsCopy[j].to === toPoint.key) ||
                (connectionsCopy[j].from === toPoint.key && connectionsCopy[j].to === fromPoint.key)) {
                connectionsCopy[j].colour = HIGHLIGHT_CONNECTION_COLOR
            }
        }
    }
    return connectionsCopy.map((connection: Connection) => new Connection(
        connection.from,
        connection.to,
        connection.weight,
        connection.colour,
        connection.key,
    ))
}