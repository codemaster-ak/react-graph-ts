import React, {FC, Fragment} from 'react';
import graphStore from '../stores/GraphStore';
import Konva from 'konva';
import Connection from '../classes/Connection';
import {Line} from 'react-konva';
import {observer} from 'mobx-react-lite';
import KonvaEventObject = Konva.KonvaEventObject;

interface ConnectionsProps {
    onClickHandler: (event: KonvaEventObject<PointerEvent>, connection: Connection) => void
}

const Connections: FC<ConnectionsProps> = observer(({onClickHandler}) => {

    const createConnectionPoints = (source: Konva.Vector2d, destination: Konva.Vector2d) => {
        return [source.x, source.y, destination.x, destination.y]
    }

    return <Fragment>
        {graphStore.connections.map(connection => {
            const lineEnd = {
                x: connection.to.x - connection.from.x,
                y: connection.to.y - connection.from.y,
            }
            const connectionPoints = createConnectionPoints({x: 0, y: 0}, lineEnd)
            return <Line
                key={connection.from.key + connection.to.key + Math.random()}
                x={connection.from.x}
                y={connection.from.y}
                points={connectionPoints}
                stroke={connection.colour}
                strokeWidth={3}
                hitStrokeWidth={5}
                onClick={(event: KonvaEventObject<PointerEvent>) => onClickHandler(event, connection)}
            />
        })}
    </Fragment>
})

export default Connections;