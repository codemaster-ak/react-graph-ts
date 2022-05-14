import React, {FC, useRef} from 'react';
import {Circle} from 'react-konva';
import Konva from 'konva';
import Point from '../classes/Point';
import KonvaEventObject = Konva.KonvaEventObject;

interface AnchorProps {
    x: number
    y: number
    point: Point
    dragStartHandler: (event: KonvaEventObject<DragEvent>, id: string) => void
    dragMoveHandler: (event: KonvaEventObject<DragEvent>, id: string) => void
    dragEndHandler: (event: KonvaEventObject<DragEvent>, id: Point) => void
}

const Anchor: FC<AnchorProps> = ({x, y, point, dragStartHandler, dragMoveHandler, dragEndHandler}) => {

    const anchor = useRef<Konva.Circle>(null)

    const dragBounds = (ref: React.RefObject<Konva.Circle>): Konva.Vector2d => {
        if (ref.current !== null) {
            return ref.current.getAbsolutePosition()
        }
        return {x: 0, y: 0}
    }

    return <Circle
        x={x}
        y={y}
        ref={anchor}
        radius={5}
        fill="#656565"
        draggable
        onDragStart={event => dragStartHandler(event, point.key)}
        onDragMove={event => dragMoveHandler(event, point.key)}
        onDragEnd={event => dragEndHandler(event, point)}
        dragBoundFunc={() => dragBounds(anchor)}
        perfectDrawEnabled={false}
    />
}

export default Anchor;