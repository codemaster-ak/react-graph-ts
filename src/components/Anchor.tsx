import React, {FC, useRef} from 'react';
import {Circle} from 'react-konva';
import Konva from 'konva';
import KonvaEventObject = Konva.KonvaEventObject;

interface AnchorProps {
    x: number
    y: number
    id: string
    onDragMove: (event: KonvaEventObject<DragEvent>, id: string) => void
    onDragEnd: (event: KonvaEventObject<DragEvent>, id: string) => void
    onDragStart: (event: KonvaEventObject<DragEvent>, id: string) => void
}

const Anchor: FC<AnchorProps> = ({x, y, id, onDragMove, onDragEnd, onDragStart}) => {

    const anchor = useRef<Konva.Circle>(null)

    const dragBounds = (ref: React.RefObject<any>) => {
        if (ref.current !== null) {
            return ref.current.getAbsolutePosition()
        }
        return {x: 0, y: 0}
    }

    return <Circle
        x={x}
        y={y}
        radius={5}
        fill="#656565"
        draggable
        onDragStart={event => onDragStart(event, id)}
        onDragMove={event => onDragMove(event, id)}
        onDragEnd={event => onDragEnd(event, id)}
        dragBoundFunc={() => dragBounds(anchor)}
        perfectDrawEnabled={false}
        ref={anchor}
    />
}

export default Anchor;