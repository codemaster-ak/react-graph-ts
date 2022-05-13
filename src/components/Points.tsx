import React, {Dispatch, FC, Fragment, SetStateAction} from 'react';
import {Circle} from 'react-konva';
import {POINT_SIZE} from '../consts';
import Point from '../classes/Point';
import {observer} from 'mobx-react-lite';
import graphStore from '../stores/GraphStore';
import {KonvaEventObject} from 'konva/lib/Node';

const Points: FC = observer(() => {

    // const onClickHandler = (point: Point) => {
    //     if (selectedPoint?.key === point.key) {
    //         setSelectedPoint(null)
    //     } else {
    //         setSelectedPoint(point)
    //     }
    // }

    const pointDragHandler = (event: KonvaEventObject<DragEvent>, key: string): void => {
        const position = event.target.position()
        graphStore.updatePointCoords(key, position.x, position.y)
    }

    return <Fragment>
        {graphStore.points.map((point: Point) => {
            const {x, y, key, colour} = point
            return <Circle
                key={key}
                x={x}
                y={y}
                radius={POINT_SIZE}
                fill={colour}
                onClick={() => graphStore.selectPoint(key)}
                onDblClick={() => graphStore.deletePoint(key)}
                onContextMenu={() => {
                }}
                onDragMove={(event) => pointDragHandler(event, key)}
                draggable
                perfectDrawEnabled
            />
        })}
    </Fragment>
})

export default Points;