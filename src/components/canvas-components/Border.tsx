import React, {FC, Fragment, useLayoutEffect, useState} from 'react';
import {Circle} from 'react-konva';
import Anchor from './Anchor';
import Konva from 'konva';
import {observer} from 'mobx-react-lite';
import graphStore from '../../stores/GraphStore';
import KonvaEventObject = Konva.KonvaEventObject;
import canvasStore from "../../stores/CanvasStore";

interface BorderProps {
    onAnchorDragStart: (event: KonvaEventObject<DragEvent>) => void
    onAnchorDragMove: (event: KonvaEventObject<DragEvent>) => void
    onAnchorDragEnd: (event: KonvaEventObject<DragEvent>) => void
}

const Border: FC<BorderProps> = observer(({
                                              onAnchorDragStart,
                                              onAnchorDragMove,
                                              onAnchorDragEnd,
                                          }) => {

    const {selectedPoint} = canvasStore

    const [anchorPoints, setAnchorPoints] = useState<Konva.Vector2d[]>([])

    useLayoutEffect(() => {
        if (selectedPoint) {
            const {x, y, radius} = selectedPoint
            const coords = [
                {
                    x: x - radius - 10,
                    y: y,
                }, {
                    x: x + radius + 10,
                    y: y,
                }, {
                    x: x,
                    y: y - radius - 10,
                }, {
                    x: x,
                    y: y + radius + 10,
                },
            ]
            setAnchorPoints(coords)
        } else setAnchorPoints([])
    }, [selectedPoint])

    return <Fragment>
        {selectedPoint && <Circle
            x={selectedPoint.x}
            y={selectedPoint.y}
            stroke="#76bdff"
            strokeWidth={5}
            radius={selectedPoint.radius + 1}
            perfectDrawEnabled={false}
        />}
        {selectedPoint && anchorPoints.map((position, index) => {
            return <Anchor
                key={index}
                x={position.x}
                y={position.y}
                dragStartHandler={onAnchorDragStart}
                dragMoveHandler={onAnchorDragMove}
                dragEndHandler={onAnchorDragEnd}
            />
        })}
    </Fragment>
})

export default Border;