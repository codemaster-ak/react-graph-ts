import {action, IObservableArray, makeObservable, observable} from "mobx";
import {ShapeI} from "../interfaces";
import Point from "../classes/Point";
import Connection from "../classes/Connection";
import graphStore from "./GraphStore";
import {ConnectionColours, PointColours} from "../enums";

class StackStore {
    @observable stack: IObservableArray<ShapeI>

    constructor() {
        makeObservable(this)
        this.stack = observable.array<ShapeI>([])
    }

    @action
    addPoint(x: number, y: number, colour?: PointColours, connections?: Connection[], key?: string): void {
        const length = graphStore.addPoint(x, y, colour, connections, key)
        if (length) {
            this.stack.push(new Point(x, y, colour, [], key))
        }
    }

    @action
    addConnection(from: Point, to: Point, weight?: number, colour?: ConnectionColours, key?: string): void {
        const length = graphStore.addConnection(from, to, weight, colour, key)
        if (length) {
            this.stack.push(new Connection(
                new Point(from.x, from.y, from.colour, [], from.key),
                new Point(to.x, to.y, to.colour, [], to.key),
                weight,
                colour,
                key
            ))
        }
    }

    @action
    parseToStack(content: object[]): void {
        this.clear()
        for (let i = 0; i < content.length; i++) {
            this.parseShapeToStack(content[i] as ShapeI)
        }
    }

    @action
    updateStack() {
        for (let i = 0; i < this.stack.length; i++) {
            if (this.stack[i] instanceof Point) {
                const point = graphStore.findPointByKey(this.stack[i].key)
                if (point) {
                    const {x, y, colour, key} = this.stack[i] as Point
                    this.stack[i] = new Point(x, y, colour, [], key)
                }
            }
            if (this.stack[i] instanceof Connection) {
                const connection = graphStore.findConnectionByKey(this.stack[i].key)
                console.log(connection)
                if (connection) {
                    const from = graphStore.findPointByKey(connection.from.key)
                    const to = graphStore.findPointByKey(connection.to.key)
                    const {weight, colour, key} = connection
                    if (from && to) {
                        this.stack[i] = new Connection(
                            new Point(from.x, from.y, from.colour, [], from.key),
                            new Point(to.x, to.y, to.colour, [], to.key),
                            weight,
                            colour,
                            key
                        )
                    }
                }
            }
        }
        // console.log(this.stack)
    }

    @action
    parseShapeToStack(shape: ShapeI): void {
        const point = Point.parsePoint(shape)
        if (point instanceof Point) {
            this.stack.push(point)
            return
        }
        const connection = Connection.parseConnection(shape)
        if (connection instanceof Connection) this.stack.push(connection)
    }

    findInStack(key: string) {
        return this.stack.find(shape => shape.key === key)
    }

    findIndexInStack(shape: ShapeI): number | undefined {
        let index: number | undefined = undefined
        for (let i = 0; i < this.stack.length; i++) {
            if (this.stack[i].key === shape.key) {
                index = i
            }
        }
        return index
    }

    @action
    removeFromStack(shape: ShapeI): void {
        const removable = this.findInStack(shape.key)
        if (removable) {
            const index = this.findIndexInStack(removable)
            if (index) this.stack.splice(index)
        }
    }

    @action
    clear() {
        this.stack = observable.array<ShapeI>([])
    }
}

const stackStore = new StackStore()
export default stackStore;