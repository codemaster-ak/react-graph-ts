import React, {FC, Fragment} from 'react';
import {observer} from 'mobx-react-lite';
import graphStore from '../../stores/GraphStore';
import {Text} from 'react-konva';
import CanvasHandler from "../../classes/CanvasHandler";

const ConnectionWeightValues: FC = observer(() => {

    return <Fragment>
        {graphStore.connections.map(connection => {
            const {from, to, weight, key} = connection
            const {x, y} = CanvasHandler.getConnectionWeightCoords(from, to)
            if (x && y) {
                return <Text
                    key={key}
                    text={String(weight)}
                    fontSize={20}
                    x={x - 15}
                    y={y - 8}
                    fill="black"
                    perfectDrawEnabled={false}
                />
            }
            return null
        })}
    </Fragment>
})

export default ConnectionWeightValues;