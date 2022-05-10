import React, {FC} from 'react';
import {Circle} from 'react-konva';
import Anchor from './Anchor';
import {SIZE} from '../consts';
import Point from '../classes/Point';
import Konva from 'konva';
import KonvaEventObject = Konva.KonvaEventObject;

interface BorderProps {
    point: Point
    id: string
    onAnchorDragStart: (event: KonvaEventObject<DragEvent>, id: string) => void
    onAnchorDragMove: (event: KonvaEventObject<DragEvent>, id: string) => void
    onAnchorDragEnd: (event: KonvaEventObject<DragEvent>, id: string) => void
}

const Border: FC<BorderProps> = ({
                                     point,
                                     id,
                                     onAnchorDragStart,
                                     onAnchorDragMove,
                                     onAnchorDragEnd,
                                 }) => {

    const getAnchorPoints = (x: number, y: number) => {
        if (!x || !y) return []
        return [
            {
                x: x - SIZE - 10,
                y: y,
            }, {
                x: x + SIZE + 10,
                y: y,
            }, {
                x: x,
                y: y - SIZE - 10,
            }, {
                x: x,
                y: y + SIZE + 10,
            },
        ]
    }

    const createAnchors = (point: Point) => {
        const anchorPoints = getAnchorPoints(point?.x, point?.y)

        return anchorPoints.map((position, index) => {
            return <Anchor
                key={`anchor-${index}`}
                id={id}
                x={position.x}
                y={position.y}
                onDragStart={onAnchorDragStart}
                onDragMove={onAnchorDragMove}
                onDragEnd={onAnchorDragEnd}
            />
        })
    }

    return <>
        {point && <Circle
            x={point.x}
            y={point.y}
            stroke="#76bdff"
            strokeWidth={5}
            radius={SIZE + 1}
            perfectDrawEnabled={false}
        />}
        {createAnchors(point)}
    </>
}

export default Border;