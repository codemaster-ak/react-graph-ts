import React, {FC, Fragment, ReactChild, ReactElement, ReactNode, RefObject, useEffect, useRef, useState} from 'react';
import graphStore from '../../stores/GraphStore';
import Konva from 'konva';
import Connection from '../../classes/Connection';
import {Line} from 'react-konva';
import {observer} from 'mobx-react-lite';
import KonvaEventObject = Konva.KonvaEventObject;
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
                // onClick={(event: KonvaEventObject<PointerEvent>) => onClickHandler(event, connection)}
                onDblClick={() => graphStore.deleteConnection(connection.key)}
            />
        })}
    </Fragment>
})

export default Connections;