import React, {FC, Fragment} from 'react';
import graphStore from '../../stores/GraphStore';
import {Line} from 'react-konva';
import {observer} from 'mobx-react-lite';
import CanvasHandler from "../../classes/CanvasHandler";

const Connections: FC = observer(() => {

    return <Fragment>
        {graphStore.connections.map(connection => {
            const {from, to, colour, key} = connection
            const lineEnd = {
                x: to.x - from.x,
                y: to.y - from.y,
            }
            const connectionPoints = CanvasHandler.createConnectionPoints({x: 0, y: 0}, lineEnd)
            return <Line
                key={key}
                x={from.x}
                y={from.y}
                points={connectionPoints}
                stroke={colour}
                strokeWidth={3}
                hitStrokeWidth={5}
                onDblClick={() => graphStore.deleteConnection(connection)}
            />
        })}
    </Fragment>
})

export default Connections;