import React, {Dispatch, FC, MouseEventHandler, SetStateAction, useContext} from 'react';
import Point from '../classes/Point';
import Connection from '../classes/Connection';
import Matrix from './Matrix';
import Canvas from './Canvas';
import {getMousePos} from '../functions/canvasFunctions';
import {message} from 'antd';
import {STAGE_SIZE} from '../consts';
import Konva from 'konva';

interface MainProps {
    // points: Point[]
    // connections: Connection[]
    // setPoints: Dispatch<SetStateAction<Point[]>>
    // setConnections: Dispatch<SetStateAction<Connection[]>>
}

const Main: FC<MainProps> = ({
                                 // points,
                                 // connections,
                                 // setPoints,
                                 // setConnections,
                             }) => {

    // const addPoint = (event: any, stage?: Konva.Stage | null) => {
    //     if (event?.target === stage) {
    //         event.evt.preventDefault()
    //         const mousePos = getMousePos(event)
    //         if (points.length < 10) {
    //             setPoints([...points, new Point(mousePos.x, mousePos.y, String(new Date().getTime()))])
    //         } else message.warn('Достигнуто максимальное количество вершин - 10', 1).then()
    //     } else {
    //         const x = Math.round(Math.random() * STAGE_SIZE)
    //         const y = Math.round(Math.random() * STAGE_SIZE)
    //         setPoints([...points, new Point(x, y, String(new Date().getTime()))])
    //     }
    // }


    // const changeWeight = (value: number, row: any, col: number) => {
    //     if (value > 0) {
    //         setConnections(connections.map((connection, index) => {
    //             if (index + 1 === col) {
    //                 return new Connection(connection.from, connection.to, value, connection.colour, connection.key)
    //             } else return connection
    //         }))
    //     }
    // }

    return <div className="main">
        <Matrix
            // points={points}
            // connections={connections}
            // setPoints={setPoints}
            // setConnections={setConnections}
            // addPoint={addPoint}
        />
        <Canvas/>
    </div>
}

export default Main;