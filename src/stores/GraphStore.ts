import {action, computed, IObservableArray, makeObservable, observable} from 'mobx';
import Point from '../classes/Point';
import Connection from '../classes/Connection';
import {ConnectionColours, PointColours} from "../enums";
import {AdjacencyMatrixI, IncidenceMatrixI} from "../interfaces";
import canvasStore from "./CanvasStore";

class GraphStore {
    @observable points: IObservableArray<Point>
    @observable connections: IObservableArray<Connection>

    constructor() {
        makeObservable(this)
        this.points = observable.array<Point>([])
        this.connections = observable.array<Connection>([])
    }

    @action
    parseFromIncidenceMatrix(matrix: any[][]): void {
        canvasStore.selectedPoint = null
        const points: Point[] = []
        for (let i = 0; i < matrix.length; i++) {
            if (i === 0) {
                const connections: Connection[] = []
                for (let j = 0; j < matrix[i].length; j++) {
                    if (j > 0) {
                        const newConnection = new Connection(
                            matrix[i][j].from,
                            matrix[i][j].to,
                            matrix[i][j].weight,
                            matrix[i][j].colour,
                            matrix[i][j].key
                        )
                        connections.push(newConnection)
                    }
                }
                graphStore.connections = observable.array<Connection>(connections)
            } else {
                const newPoint = new Point(
                    matrix[i][0].x,
                    matrix[i][0].y,
                    matrix[i][0].colour,
                    [],
                    matrix[i][0].key
                )
                points.push(newPoint)
            }
        }
        graphStore.points = observable.array<Point>(points)
        this.addConnectionsToPoints()
    }

    @action
    addPoint(x: number, y: number): void {
        if (this.points.length < 10) {
            const newPoint = new Point(x, y)
            this.points.push(newPoint)
        }
    }

    @action
    addConnection(from: Point, to: Point): void {
        if (!this.checkConnectionExist(from, to)) {
            const newConnection = new Connection(from, to)
            from.connections.push(newConnection)
            to.connections.push(newConnection)
            this.connections.push(newConnection)
        }
    }

    @action
    addConnectionsToPoints(): void {//todo??
        for (let i = 0; i < this.connections.length; i++) {
            let {from, to} = this.connections[i]
            from = this.findPointByKey(from.key) as Point
            to = this.findPointByKey(to.key) as Point
            from.connections.push(this.connections[i])
            to.connections.push(this.connections[i])
        }
        // console.log(this.points)
    }

    @action
    updatePointCoords(key: string, x: number, y: number): void {
        for (let i = 0; i < this.points.length; i++) {
            if (this.points[i].key === key) {
                this.points[i] = new Point(x, y, this.points[i].colour, this.points[i].connections, key)
                // this.points[i].x = x
                // this.points[i].y = y
                this.updateConnections(this.points[i])
                if (canvasStore.selectedPoint) canvasStore.selectedPoint = this.points[i]//todo ??
            }
        }
    }

    @action
    changeConnectionWeight(key: string, weight: number): void {
        if (weight > 0 && weight < 100) {
            for (let i = 0; i < this.connections.length; i++) {
                if (this.connections[i].key === key) {
                    const {from, to, colour, key} = this.connections[i]
                    this.connections[i] = new Connection(from, to, weight, colour, key)
                }
            }
        }
    }

    @action
    private updateConnections(point: Point): void { // todo доработать ??
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].from.key === point.key) {
                const {from, to, colour, key, weight} = this.connections[i]
                let newConnection = new Connection(from, to, weight, colour, key)
                newConnection.from = point
                this.connections[i] = newConnection
            }
            if (this.connections[i].to.key === point.key) {
                const {from, to, colour, key, weight} = this.connections[i]
                let newConnection = new Connection(from, to, weight, colour, key)
                newConnection.to = point
                this.connections[i] = newConnection
            }
        }
    }

    @action
    changePointsColour(points: Point[], colour: PointColours) {
        const keys = points.map(point => point.key)
        for (let i = 0; i < this.points.length; i++) {
            if (keys.includes(this.points[i].key)) {
                const {x, y, connections, key} = this.points[i]
                this.points[i] = new Point(x, y, colour, connections, key)
            }
        }
    }

    @action
    changeConnectionsColour(connections: Connection[], colour: ConnectionColours) {
        const keys = connections.map(connection => connection.key)
        for (let i = 0; i < this.connections.length; i++) {
            if (keys.includes(this.connections[i].key)) {
                const {from, to, weight, key} = this.connections[i]
                this.connections[i] = new Connection(from, to, weight, colour, key)
            }
        }
    }

    @action
    deletePoint(point: Point): void {
        this.points.remove(point)
        const connections = this.findConnectionsByPointKey(point.key)
        connections.forEach(connection => this.deleteConnection(connection))
        if (canvasStore.selectedPoint?.key === point.key) canvasStore.selectedPoint = null
    }

    @action
    deleteConnection(connection: Connection): void {
        this.connections.remove(connection)
    }

    @action
    removeConnectionsFromPoints(): void {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].removeConnections()
        }
    }

    @action
    clearAll(): void {
        graphStore.points.clear()
        graphStore.connections.clear()
    }

    /** Матрица инцидентности */
    @computed
    get incidenceMatrix(): IncidenceMatrixI {
        const matrix: any[][] = [[null], ...this.points.map(point => [point])]
        for (let i = 0; i < this.connections.length; i++) {
            const {from, to} = this.connections[i]
            for (let j = 0; j < matrix.length; j++) {
                if (matrix[j][0]?.key === from.key || matrix[j][0]?.key === to.key) {
                    matrix[j].push(this.connections[i].weight)
                } else {
                    if (j === 0) matrix[j].push(this.connections[i])
                    else matrix[j].push(0)
                }
            }
        }
        return matrix as IncidenceMatrixI
    }

    /** Матрица смежности */
    @computed
    get adjacencyMatrix(): AdjacencyMatrixI {
        const matrix: AdjacencyMatrixI = [[null]]
        for (let i = 0; i < this.points.length; i++) {
            matrix[0].push(this.points[i])
            matrix.push([this.points[i], ...new Array(this.points.length).fill(0)])
        }
        for (let i = 1; i < matrix.length; i++) {
            for (let j = 1; j <= matrix.length - 1; j++) {
                let connection = this.findConnectionByPoints(matrix[0][j] as Point, matrix[i][0] as Point)
                if (!connection) connection = this.findConnectionByPoints(matrix[i][0] as Point, matrix[0][j] as Point)
                if (connection) {
                    matrix[i][j] = connection.weight
                    matrix[j][i] = connection.weight
                } else {
                    matrix[i][j] = Infinity
                    matrix[j][i] = Infinity
                }
                if (i === j) matrix[i][j] = 0
            }
        }
        return matrix
    }

    findIndexByPoint(point: Point): number | undefined {
        let index: number | undefined = undefined
        for (let i = 0; i < this.points.length; i++) {
            if (this.points[i].key === point.key) {
                index = i
            }
        }
        return index
    }

    findPointByKey(key: string): Point | undefined {
        return this.points.find(point => point.key === key)
    }

    findConnectionsByPointKey(key: string): Connection[] {
        return this.connections.filter(connection => {
            return connection.from.key === key || connection.to.key === key
        })
    }

    findConnectionByPoints(from: Point, to: Point): Connection | undefined {
        return this.connections.find(connection => {
            return connection.from.key === from.key && connection.to.key === to.key
        })
    }

    private checkConnectionExist(from: Point, to: Point): boolean {
        return graphStore.connections.some(connection => {
            return (connection.from.key === from.key && connection.to.key === to.key)
                || (connection.from.key === to.key && connection.to.key === from.key)
        })
    }
}

const graphStore = new GraphStore()
export default graphStore;