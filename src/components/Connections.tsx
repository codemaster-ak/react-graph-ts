import React, {FC, Fragment, useEffect} from 'react';
import graphStore from '../stores/GraphStore';
import Konva from 'konva';
import {KonvaEventObject} from 'konva/lib/Node';
import Connection from '../classes/Connection';
import {Line} from 'react-konva';
import {observer} from 'mobx-react-lite';

interface ConnectionsProps {
    handleOnContextMenu: (event: KonvaEventObject<PointerEvent>, connection: Connection) => any
}

const Connections: FC<ConnectionsProps> = observer(({handleOnContextMenu}) => {

    useEffect(() => {
    }, [graphStore.points])

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
                onContextMenu={(event: KonvaEventObject<PointerEvent>) => handleOnContextMenu(event, connection)}
            />
        })}
    </Fragment>
})

export default Connections;