import Konva from 'konva';
import Point from './Point';
import {POINT_SIZE} from '../consts';
import graphStore from '../stores/GraphStore';

export default class CanvasHandler {
    static createConnectionPoints(source: Konva.Vector2d, destination: Konva.Vector2d) {
        return [source.x, source.y, destination.x, destination.y]
    }

    static hasIntersection(position: Konva.Vector2d, point: Point) {
        const radius = Math.sqrt(Math.pow(position.x - point.x, 2) + Math.pow(position.x - point.x, 2))
        return POINT_SIZE - radius > 0
    }

    static getConnectionCoords(fromPoint: Point, toPoint: Point) {
        let x, y
        if (toPoint.x > fromPoint.x) {
            x = fromPoint.x + (toPoint.x - fromPoint.x) / 2
        } else {
            x = toPoint.x + (fromPoint.x - toPoint.x) / 2
        }
        if (toPoint.y > fromPoint.y) {
            y = fromPoint.y + (toPoint.y - fromPoint.y) / 2
        } else {
            y = toPoint.y + (fromPoint.y - toPoint.y) / 2
        }
        return [x, y]
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

    static detectConnection(position: Konva.Vector2d, point: Point): Point | undefined {
        return graphStore.points.find((p: Point) => {
            return p.key !== point.key && this.hasIntersection(position, p)
        })
    }
}