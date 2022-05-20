import React, {FC, Fragment, useState} from 'react';
import {Text} from 'react-konva';
import graphStore from '../../stores/GraphStore';
import {observer} from 'mobx-react-lite';
import CanvasHandler from "../../classes/CanvasHandler";
import ConnectionWeight from "./ConnectionWeight";
import Connection from "../../classes/Connection";

const ConnectionWeights: FC = observer(() => {

    const [hovered, setHovered] = useState<boolean>(false)
    const [hoveredConnection, setHoveredConnection] = useState<Connection | null>(null)

    const onMouseEnter = (connection: Connection): void => {
        setHovered(true)
        setHoveredConnection(connection)
    }

    const onMouseMove = (connection: Connection): void => {
        setHovered(true)
        setHoveredConnection(connection)
    }

    const onMouseLeave = (): void => {
        setHovered(false)
        setHoveredConnection(null)
    }

    return <Fragment>
        {graphStore.connections.map(connection => {
            const {from, to, weight, key} = connection
            const {x, y} = CanvasHandler.getConnectionCoords(from, to)
            if (x && y) {
                return <Fragment key={key}>
                    <ConnectionWeight
                        x={x}
                        y={y}
                        connection={connection}
                        hovered={hovered}
                        hoveredConnection={hoveredConnection}
                        onMouseEnter={onMouseEnter}
                        onMouseMove={onMouseMove}
                        onMouseLeave={onMouseLeave}
                    />
                    <Text
                        onMouseEnter={() => onMouseEnter(connection)}
                        onMouseMove={() => onMouseMove(connection)}
                        onMouseLeave={onMouseLeave}
                        text={String(weight)}
                        fontSize={20}
                        x={x - 15}
                        y={y - 8}
                        fill="black"
                        perfectDrawEnabled={false}
                    />
                </Fragment>
            }
            return null
        })}
    </Fragment>
})

export default ConnectionWeights;

