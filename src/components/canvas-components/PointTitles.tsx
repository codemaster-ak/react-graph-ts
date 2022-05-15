import React, {FC, Fragment} from 'react';
import graphStore from '../../stores/GraphStore';
import {observer} from 'mobx-react-lite';
import {Text} from 'react-konva';
import Konva from 'konva';
import KonvaEventObject = Konva.KonvaEventObject;

const PointTitles: FC = observer(() => {

    const pointDragHandler = (event: KonvaEventObject<DragEvent>, key: string): void => {
        const position = event.target.position()
        graphStore.updatePointCoords(key, position.x + 9, position.y + 6)
    }

    return <Fragment>
        {graphStore.points.map(point => {
            const {x, y, key} = point
            return <Text
                key={key}
                x={x - 9}
                y={y - 6}
                fontSize={16}
                text={point.getName()}
                fill="white"
                onClick={() => graphStore.selectPoint(key)}
                onDblClick={() => graphStore.deletePoint(key)}
                onDragMove={(event) => pointDragHandler(event, key)}
                draggable
                perfectDrawEnabled={false}
            />
        })}
    </Fragment>
})

export default PointTitles;