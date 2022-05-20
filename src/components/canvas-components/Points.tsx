import React, {FC, Fragment} from 'react';
import {Circle} from 'react-konva';
import Point from '../../classes/Point';
import {observer} from 'mobx-react-lite';
import graphStore from '../../stores/GraphStore';
import Konva from 'konva';
import KonvaEventObject = Konva.KonvaEventObject;

const Points: FC = observer(() => {

    const pointDragHandler = (event: KonvaEventObject<DragEvent>, key: string): void => {
        const position = event.target.position()
        graphStore.updatePointCoords(key, position.x, position.y)
    }

    return <Fragment>
        {graphStore.points.map((point: Point) => {
            const {x, y, key, colour, radius} = point
            return <Circle
                key={key}
                x={x}
                y={y}
                radius={radius}
                fill={colour}
                onClick={() => graphStore.selectPoint(key)}
                onDblClick={() => graphStore.deletePoint(key)}
                onDragMove={(event) => pointDragHandler(event, key)}
                draggable
                perfectDrawEnabled
            />
        })}
    </Fragment>
})

export default Points;