import Konva from 'konva';
import Point from './Point';
import graphStore from '../stores/GraphStore';
import Connection from "./Connection";
import KonvaEventObject = Konva.KonvaEventObject;

export default class CanvasHandler {
    static STAGE_SIZE = 600

    static createConnectionPoints(source: Konva.Vector2d, destination: Konva.Vector2d): number[] {
        return [source.x, source.y, destination.x, destination.y]
    }

    static hasIntersection(position: Konva.Vector2d, target: Point | Konva.Vector2d): boolean {
        const radius = Math.sqrt(Math.pow(position.x - target.x, 2) + Math.pow(position.y - target.y, 2))
        if (target instanceof Point) return target.radius - radius > 0
        return 20 - radius > 0
    }

    static getConnectionWeightCoords(from: Point, to: Point): Konva.Vector2d {
        let x, y
        if (to.x > from.x) {
            x = from.x + (to.x - from.x) / 2
        } else {
            x = to.x + (from.x - to.x) / 2
        }
        if (to.y > from.y) {
            y = from.y + (to.y - from.y) / 2
        } else {
            y = to.y + (from.y - to.y) / 2
        }
        return {x, y}
    }

    static getMousePos(event: KonvaEventObject<any>): Konva.Vector2d {
        const position = event.target.position()
        const stage = event.target.getStage()!
        const pointerPosition = stage.getPointerPosition()!
        return {
            x: pointerPosition.x - position.x,
            y: pointerPosition.y - position.y,
        }
    }

    static detectConnection(position: Konva.Vector2d, from: Point): Point | undefined {
        return graphStore.points.find(point => {
            return point.key !== from.key && this.hasIntersection(position, point)
        })
    }

    static detectHoverWeightCircle(event: KonvaEventObject<any>): Connection | undefined {
        for (let i = 0; i < graphStore.connections.length; i++) {
            const {from, to} = graphStore.connections[i]
            const x = event.evt.layerX
            const y = event.evt.layerY
            if (this.hasIntersection({x, y}, this.getConnectionWeightCoords(from, to))) {
                return graphStore.connections[i]
            }
        }
    }
}