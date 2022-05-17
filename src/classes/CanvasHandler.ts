import Konva from 'konva';
import Point from './Point';
import {POINT_SIZE} from '../consts';
import graphStore from '../stores/GraphStore';

export default class CanvasHandler {
    static createConnectionPoints(source: Konva.Vector2d, destination: Konva.Vector2d): number[] {
        return [source.x, source.y, destination.x, destination.y]
    }

    static hasIntersection(position: Konva.Vector2d, target: Point): boolean {
        const radius = Math.sqrt(Math.pow(position.x - target.x, 2) + Math.pow(position.y - target.y, 2))
        return POINT_SIZE - radius > 0
    }

    static getConnectionCoords(from: Point, to: Point): Konva.Vector2d {
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

    static getMousePos(event: Konva.KonvaEventObject<any>): Konva.Vector2d {
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
}