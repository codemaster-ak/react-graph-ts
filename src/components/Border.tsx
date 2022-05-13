import React, {FC, Fragment, useEffect, useState} from 'react';
import {Circle} from 'react-konva';
import Anchor from './Anchor';
import {POINT_SIZE} from '../consts';
import Point from '../classes/Point';
import Konva from 'konva';
import KonvaEventObject = Konva.KonvaEventObject;
import {observer} from 'mobx-react-lite';
import graphStore from '../stores/GraphStore';

interface BorderProps {
    onAnchorDragStart: (event: KonvaEventObject<DragEvent>, id: string) => void
    onAnchorDragMove: (event: KonvaEventObject<DragEvent>, id: string) => void
    onAnchorDragEnd: (event: KonvaEventObject<DragEvent>, point: Point) => void
}

const Border: FC<BorderProps> = observer(({
                                              onAnchorDragStart,
                                              onAnchorDragMove,
                                              onAnchorDragEnd,
                                          }) => {

    const {selectedPoint} = graphStore

    const [anchorPoints, setAnchorPoints] = useState<Konva.Vector2d[]>([])

    useEffect(() => {
        if (selectedPoint) {
            const {x, y} = selectedPoint
            const coords = [
                {
                    x: x - POINT_SIZE - 10,
                    y: y,
                }, {
                    x: x + POINT_SIZE + 10,
                    y: y,
                }, {
                    x: x,
                    y: y - POINT_SIZE - 10,
                }, {
                    x: x,
                    y: y + POINT_SIZE + 10,
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
            radius={POINT_SIZE + 1}
            perfectDrawEnabled={false}
        />}
        {selectedPoint && anchorPoints.map((position, index) => {
            return <Anchor
                key={index}
                point={selectedPoint}
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