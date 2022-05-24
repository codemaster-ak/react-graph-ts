import React, {FC, Fragment} from 'react';
import {Circle, Line, Shape} from "react-konva";
import graphStore from "../../stores/GraphStore";
import Connection from "../../classes/Connection";
import {PointColours} from "../../enums";
import CanvasHandler from "../../classes/CanvasHandler";

interface ConnectionWeightProps {
    x: number
    y: number
    connection: Connection
    hovered: boolean
    hoveredConnection: Connection | null
    // onMouseEnter: (connection: Connection) => void
    // onMouseMove: (connection: Connection) => void
    // onMouseLeave: (e:any) => void
}

const ConnectionWeight: FC<ConnectionWeightProps> = ({
                                                         x,
                                                         y,
                                                         connection,
                                                         hovered,
                                                         hoveredConnection,
                                                         // onMouseEnter,
                                                         // onMouseMove,
                                                         // onMouseLeave
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
            // onMouseEnter={() => onMouseEnter(connection)}
            // onMouseMove={(e) => {

            // console.log(CanvasHandler.getMousePos(e))

            // onMouseMove(connection)
            /*}}*/
            // onMouseLeave={(e) => {
            // console.log(e)
            // console.log(CanvasHandler.getMousePos(e))
            // onMouseLeave(e)
            /*}}*/
            // ref={ref}
            x={x}
            y={y}
            radius={20}
            fill="white"
            perfectDrawEnabled={false}
        />
        {hovered && hoveredConnection?.key === key && <Fragment>
            <Line
                onClick={incrementWeight}
                x={x}
                y={y}
                points={[-4, -11, 4, -11, 0, -17]}
                tension={0.1}
                closed
                stroke={weight === 99 ? "#aaa" : PointColours.BASE}
            />
            <Line
                onClick={decrementWeight}
                x={x}
                y={y}
                points={[-4, 11, 4, 11, 0, 17]}
                tension={0.1}
                closed
                stroke={weight === 1 ? "#aaa" : PointColours.BASE}
            />
        </Fragment>}
    </Fragment>
}
export default ConnectionWeight;