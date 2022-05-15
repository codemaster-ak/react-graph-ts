import React, {FC, Fragment} from 'react';
import {Circle} from 'react-konva';
import graphStore from '../../stores/GraphStore';
import {observer} from 'mobx-react-lite';
import CanvasHandler from "../../classes/CanvasHandler";

const ConnectionWeights: FC = observer(() => {

    return <Fragment>
        {graphStore.connections.map(connection => {
            const {from, to, key} = connection
            const {x, y} = CanvasHandler.getConnectionCoords(from, to)
            if (x && y) {
                return <Circle
                    key={key}
                    x={x}
                    y={y}
                    radius={15}
                    fill="white"
                    perfectDrawEnabled={false}
                />
            }
            return null
        })}
    </Fragment>
})

export default ConnectionWeights;

