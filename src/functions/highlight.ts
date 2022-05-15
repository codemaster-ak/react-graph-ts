import Point from '../classes/Point';
import Connection from '../classes/Connection';
import graphStore from "../stores/GraphStore";
import {ConnectionColours, PointColours} from "../enums";

export function getPointsToHighlight(path: number[]): Point[] {
    return graphStore.points.filter((point: Point, index: number) => {
        return path.includes(index)
    })
}

export function getConnectionsToHighlight(path: number[]): Connection[] {
    const connectionsToHighlight: Connection[] = []
    for (let i = 0; i < path.length - 1; i++) {
        const from: Point = graphStore.points[path[i]]
        const to: Point = graphStore.points[path[i + 1]]
        const connection = graphStore.findConnectionByPoints(from, to)
        if (connection) connectionsToHighlight.push(connection)
    }
    return connectionsToHighlight
}

export function getPointsToStopHighlight(): Point[] {
    return graphStore.points.filter(point => point.colour === PointColours.HIGHLIGHTED)
}

export function getConnectionsToStopHighlight(): Connection[] {
    return graphStore.connections.filter(connection => connection.colour === ConnectionColours.HIGHLIGHTED)
}