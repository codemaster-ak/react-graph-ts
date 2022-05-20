import {action, computed, makeObservable, observable} from 'mobx';
import Point from '../classes/Point';
import Connection from '../classes/Connection';
import {ConnectionColours, PointColours} from "../enums";
import {AdjacencyMatrixI, IncidenceMatrixI} from "../interfaces";

class GraphStore {
    @observable selectedPoint: Point | null = null
    @observable points = observable.array<Point>([])
    @observable connections = observable.array<Connection>([])

    @observable transitionLine: Connection | null = null//todo ??

    constructor() {
        makeObservable(this)
    }

    @action
    parseFromIncidenceMatrix(matrix: any[][]): void {
        graphStore.selectedPoint = null
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
                    matrix[i][0].key
                )
                points.push(newPoint)
            }
        }
        graphStore.points = observable.array<Point>(points)
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
            this.connections.push(newConnection)
        }
    }

    @action
    selectPoint(key: string): void {
        if (this.selectedPoint?.key === key) this.selectedPoint = null
        else this.selectedPoint = this.points.find(point => point.key === key)!
    }

    @action
    updatePointCoords(key: string, x: number, y: number): void {
        for (let i = 0; i < this.points.length; i++) {
            if (this.points[i].key === key) {
                this.points[i] = new Point(x, y, this.points[i].colour, key)
                // this.points[i].x = x
                // this.points[i].y = y
                this.updateConnections(this.points[i])
                if (this.selectedPoint) this.selectedPoint = this.points[i]//todo ??
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
    updateConnections(point: Point): void { // todo доработать ??
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
                const {x, y, key} = this.points[i]
                this.points[i] = new Point(x, y, colour, key)
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
    deletePoint(key: string): void {
        const point = this.findPointByKey(key)!
        const index = this.points.indexOf(point)
        this.points.splice(index, 1)
        const connections = this.findConnectionsByPointKey(key)
        connections.forEach(connection => this.deleteConnection(connection.key))
        if (this.selectedPoint?.key === key) this.selectedPoint = null
    }

    @action
    deleteConnection(key: string): void {
        const connection = this.connections.find(connection => connection.key === key)!
        const index = this.connections.indexOf(connection)
        this.connections.splice(index, 1)
    }

    /** Матрица инцидентности */
    @computed
    get incidenceMatrix(): IncidenceMatrixI {
        const rows: any[][] = [[{name: ''}], ...this.points.map(point => [point])]
        for (let i = 0; i < this.connections.length; i++) {
            const {from, to} = this.connections[i]
            for (let j = 0; j < rows.length; j++) {
                if (rows[j][0].key === from.key || rows[j][0].key === to.key) {
                    rows[j].push(this.connections[i].weight)
                } else {
                    if (j === 0) {
                        rows[j].push(this.connections[i])
                    } else rows[j].push(0)
                }
            }
        }
        return rows as IncidenceMatrixI
    }

    /** Матрица смежности */
    @computed
    get adjacencyMatrix(): AdjacencyMatrixI {
        const matrix: any[][] = [[null]]
        for (let i = 0; i < this.points.length; i++) {
            matrix[0].push(this.points[i])
            matrix.push([this.points[i], ...new Array(this.points.length).fill(0)])
        }
        for (let i = 1; i < matrix.length; i++) {
            for (let j = 1; j <= matrix.length - 1; j++) {
                let connection = this.findConnectionByPoints(matrix[0][j], matrix[i][0])
                if (!connection) connection = this.findConnectionByPoints(matrix[i][0], matrix[0][j])
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
        return matrix as AdjacencyMatrixI
    }

    findPointByIndex(index: number): Point | undefined {
        return this.points.find((_, i) => i === index)
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