import {action, computed, makeObservable, observable} from 'mobx';
import Point from '../classes/Point';
import Connection from '../classes/Connection';
import {BASE_CONNECTION_COLOR} from '../consts';

class GraphStore {
    @observable selectedPoint: Point | null = null
    @observable points = observable.array<Point>([])
    @observable connections = observable.array<Connection>([])

    constructor() {
        makeObservable(this)
    }

    @action
    addPoint(x: number, y: number): void {
        if (this.points.length < 10) {
            const newPoint = new Point(x, y, String(new Date().getTime()))
            this.points.push(newPoint)
        } else throw new Error('Достигнуто максимальное количество вершин - 10')
    }

    @action
    addConnection(from: Point, to: Point): void {
        if (this.connections.length < 10) {
            const newConnection = new Connection(from, to, 1, BASE_CONNECTION_COLOR, String(new Date().getTime()))
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
                this.points[i] = new Point(x, y, key, this.points[i].colour)
                // this.points[i].x = x
                // this.points[i].y = y
                this.updateConnections(this.points[i])
                if (this.selectedPoint) this.selectedPoint = this.points[i]//todo ??
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
    deletePoint(key: string): void {
        const point = this.points.find(point => point.key === key)!
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
    get incidenceMatrix(): any[] {
        let rows: any[] = [[{name: ''}], ...this.points.map(point => [point])]
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
        return rows
    }

    /** Матрица смежности */
    @computed
    get adjacencyMatrix(): any {
        // let matrixConnection = []
        // console.log(matrix)
        // for (let i = 0; i < matrix.length; i++) {
        //     matrixConnection.push([matrix[i][0]])
        // }
        //
        // for (let i = 0; i < matrix.length; i++) {
        //     matrixConnection[0].push(matrix[i][0])
        //     for (let j = 1; j <= matrix.length - 1; j++) {
        //         if (i > 0) matrixConnection[i].push(Infinity)
        //     }
        // }
        // matrixConnection[0].shift()
        //
        // const connections = matrix[0].map(row => {
        //     let conn = {...row}
        //     delete conn.name
        //     return row
        // })
        // connections.shift()
        //
        // for (let i = 0; i < connections.length; i++) {
        //     let j, k
        //     matrixConnection[0].forEach((point, index) => {
        //         if (point.key === connections[i].from) j = index
        //     })
        //     matrixConnection[0].forEach((point, index) => {
        //         if (point.key === connections[i].to) k = index
        //     })
        //     matrixConnection[j][k] = connections[i].weight
        //     matrixConnection[k][j] = connections[i].weight
        // }
        //
        // for (let i = 1; i < matrixConnection.length; i++) {
        //     matrixConnection[i][i] = 0
        // }
        //
        // return matrixConnection
        return null
    }

    findConnectionsByPointKey(key: string): Connection[] {
        return this.connections.filter(connection => {
            return connection.from.key === key || connection.to.key === key
        })
    }
}

const graphStore = new GraphStore()
export default graphStore;