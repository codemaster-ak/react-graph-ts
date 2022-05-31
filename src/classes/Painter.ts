import Point from "./Point";
import graphStore from "../stores/GraphStore";
import Connection from "./Connection";
import {ConnectionColours, PointColours} from "../enums";
import {runInAction} from "mobx";
import canvasStore from "../stores/CanvasStore";

export default class Painter {
    static getPointsToHighlight(path: number[]): Point[] {
        return graphStore.points.filter((point: Point, index: number) => {
            return path.includes(index)
        })
    }

    static getConnectionsToHighlight(path: number[]): Connection[] {
        const connectionsToHighlight: Connection[] = []
        for (let i = 0; i < path.length - 1; i++) {
            const from: Point = graphStore.points[path[i]]
            const to: Point = graphStore.points[path[i + 1]]
            const connection = graphStore.findConnectionByPoints(from, to)
            if (connection) connectionsToHighlight.push(connection)
        }
        return connectionsToHighlight
    }

    static getPointsToStopHighlight(): Point[] {
        return graphStore.points.filter(point => point.colour === PointColours.HIGHLIGHTED)
    }

    static getConnectionsToStopHighlight(): Connection[] {
        return graphStore.connections.filter(connection => connection.colour === ConnectionColours.HIGHLIGHTED)
    }

    static getPointsToHighlightFromPath(path: number[]): Point[] {
        return graphStore.points.filter((_, i: number) => path.includes(i))
    }

    static animatePath(points: Point[]): void {
        const time = 1000
        let count = 0
        for (let i = 0; i < points.length - 1; i++) {
            let connection: Connection | undefined, reversedConnection: Connection | undefined
            connection = graphStore.findConnectionByPoints(points[i], points[i + 1])
            if (!connection) {
                reversedConnection = graphStore.findConnectionByPoints(points[i + 1], points[i])
            }
            if (connection || reversedConnection) {
                setTimeout(() => {
                    if (connection) {
                        runInAction(() => canvasStore.transitionLine = connection || null) // todo
                    }
                    if (reversedConnection) {
                        connection = new Connection(points[i], points[i + 1])
                        runInAction(() => canvasStore.transitionLine = connection || null) // todo
                    }
                    graphStore.changePointsColour([points[i]], PointColours.HIGHLIGHTED)
                }, time * count)
                if (connection) count += connection.weight
                if (reversedConnection) count += reversedConnection.weight
                setTimeout(() => {
                    if (connection || reversedConnection) {
                        runInAction(() => canvasStore.transitionLine = null)//todo
                        if (connection) {
                            graphStore.changeConnectionsColour([connection], ConnectionColours.HIGHLIGHTED)
                        }
                        if (reversedConnection) {
                            graphStore.changeConnectionsColour([reversedConnection], ConnectionColours.HIGHLIGHTED)
                        }
                    }
                }, time * count)
            }
        }
        setTimeout(() => {
            const last = points.at(-1)
            if (last) graphStore.changePointsColour([last], PointColours.HIGHLIGHTED)
        }, time * count)
    }
}