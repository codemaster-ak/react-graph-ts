import React, {Dispatch, FC, Fragment, SetStateAction} from 'react';
import {Circle, Line} from "react-konva";
import graphStore from "../../stores/GraphStore";
import Connection from "../../classes/Connection";

interface ConnectionWeightProps {
    x: number
    y: number
    connection: Connection
    hovered: boolean
    hoveredConnection: Connection | null
    onMouseEnter: (connection: Connection) => void
    onMouseMove: (connection: Connection) => void
    onMouseLeave: () => void
}

const ConnectionWeight: FC<ConnectionWeightProps> = ({
                                                         x,
                                                         y,
                                                         connection,
                                                         hovered,
                                                         hoveredConnection,
                                                         onMouseEnter,
                                                         onMouseMove,
                                                         onMouseLeave
                                                     }) => {

    const {key, weight} = connection

    const incrementWeight = (): void => {
        graphStore.changeConnectionWeight(key, weight + 1)
    }

    const decrementWeight = (): void => {
        graphStore.changeConnectionWeight(key, weight - 1)
    }

    return <Fragment>
        <Circle
            onMouseEnter={() => onMouseEnter(connection)}
            onMouseMove={() => onMouseMove(connection)}
            onMouseLeave={onMouseLeave}
            // ref={ref}
            x={x}
            y={y}
            radius={20}
            fill="white"
            perfectDrawEnabled={false}
        />
        {hovered && hoveredConnection?.key === key && <>
            <Line
                onMouseEnter={() => onMouseEnter(connection)}
                onMouseMove={() => onMouseMove(connection)}
                onClick={incrementWeight}
                x={x}
                y={y}
                points={[10, -4, 18, -4, 14, -11]}
                tension={0.1}
                closed
                stroke={weight === 99 ? "#f00" : "#888"}
            />
            <Line
                onMouseEnter={() => onMouseEnter(connection)}
                onMouseMove={() => onMouseMove(connection)}
                onClick={decrementWeight}
                x={x}
                y={y}
                points={[10, 4, 18, 4, 14, 11]}
                tension={0.1}
                closed
                stroke={weight === 1 ? "#f00" : "#888"}
            />
        </>}
    </Fragment>
}
export default ConnectionWeight;