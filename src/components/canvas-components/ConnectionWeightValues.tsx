import React, {FC, Fragment} from 'react';
import {observer} from 'mobx-react-lite';
import graphStore from '../../stores/GraphStore';
import {Text} from 'react-konva';
import Connection from '../../classes/Connection';
import Konva from 'konva';

const ConnectionWeightValues: FC = observer(() => {

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
        {graphStore.connections.map(connection => {
            const {x, y} = getConnectionCoords(connection)
            return <Text
                key={connection.from.key + connection.to.key}
                text={String(connection.weight)}
                fontSize={20}
                x={x - 6}
                y={y - 8}
                fill="black"
                perfectDrawEnabled={false}
            />
        })}
    </Fragment>
})

export default ConnectionWeightValues;