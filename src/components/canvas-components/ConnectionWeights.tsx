import React, {FC, Fragment} from 'react';
import Connection from '../../classes/Connection';
import {Circle} from 'react-konva';
import graphStore from '../../stores/GraphStore';
import Konva from 'konva';
import {observer} from 'mobx-react-lite';

const ConnectionWeights: FC = observer(() => {

    const getConnectionCoords = (connection: Connection): Konva.Vector2d => {
        let x, y
        const {from, to} = connection
        if (to.x > from.x) {
            x = from.x + (to.x - from.x) / 2
        } else {
            x = to.x + (from.x - to.x) / 2
        }
        if (to.y > from.y) {
            y = from.y + (to.y - from.y) / 2
        } else {
            y = to.y + (from.y - to.y) / 2
        }
        return {x, y}
    }

    return <Fragment>
        {graphStore.connections.map((connection: Connection) => {
            const {x, y} = getConnectionCoords(connection)
            if (x && y) {
                return <Circle
                    key={connection.from.key + connection.to.key}
                    x={x}
                    y={y}
                    radius={15}
                    fill="white"
                    perfectDrawEnabled={false}
                />
            }
        })}
    </Fragment>
})

export default ConnectionWeights;

