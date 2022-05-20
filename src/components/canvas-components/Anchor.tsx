import React, {FC, useRef} from 'react';
import {Circle} from 'react-konva';
import Konva from 'konva';
import KonvaEventObject = Konva.KonvaEventObject;
import {ConnectionColours} from "../../enums";

interface AnchorProps {
    x: number
    y: number
    dragStartHandler: (event: KonvaEventObject<DragEvent>) => void
    dragMoveHandler: (event: KonvaEventObject<DragEvent>) => void
    dragEndHandler: (event: KonvaEventObject<DragEvent>) => void
}

const Anchor: FC<AnchorProps> = ({x, y, dragStartHandler, dragMoveHandler, dragEndHandler}) => {

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
        fill={ConnectionColours.BASE}
        draggable
        onDragStart={event => dragStartHandler(event)}
        onDragMove={event => dragMoveHandler(event)}
        onDragEnd={event => dragEndHandler(event)}
        dragBoundFunc={() => dragBounds(anchor)}
        perfectDrawEnabled={false}
    />
}

export default Anchor;