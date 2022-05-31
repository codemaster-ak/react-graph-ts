import React, {FC, Fragment} from 'react';
import {Circle, Text} from 'react-konva';
import Point from '../../classes/Point';
import {observer} from 'mobx-react-lite';
import graphStore from '../../stores/GraphStore';
import Konva from 'konva';
import KonvaEventObject = Konva.KonvaEventObject;
import canvasStore from "../../stores/CanvasStore";

const Points: FC = observer(() => {

    const pointDragHandler = (event: KonvaEventObject<DragEvent>, key: string): void => {
        const position = event.target.position()
        if (event.target instanceof Konva.Circle) {
            graphStore.updatePointCoords(key, position.x, position.y)
        }
        if (event.target instanceof Konva.Text) {
            graphStore.updatePointCoords(key, position.x + 9, position.y + 6)
        }
    }

    return <Fragment>
        {graphStore.points.map((point: Point) => {
            const {x, y, key, colour, radius} = point
            return <Fragment key={key}>
                <Circle
                    x={x}
                    y={y}
                    radius={radius}
                    fill={colour}
                    onClick={() => canvasStore.selectPoint(key)}
                    onDblClick={() => graphStore.deletePoint(point)}
                    onDragMove={(event) => pointDragHandler(event, key)}
                    draggable
                />
                <Text
                    x={x - 9}
                    y={y - 6}
                    fontSize={16}
                    text={point.getName()}
                    fill="white"
                    onClick={() => canvasStore.selectPoint(key)}
                    onDblClick={() => graphStore.deletePoint(point)}
                    onDragMove={(event) => pointDragHandler(event, key)}
                    draggable
                    perfectDrawEnabled={false}
                />
            </Fragment>
        })}
    </Fragment>
})

export default Points;