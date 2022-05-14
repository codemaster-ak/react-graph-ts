import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import Connection from '../classes/Connection';
import MatrixCell from './MatrixCell';
import Point from '../classes/Point';
import {IncidenceMatrixCell} from '../types';
import {BASE_POINT_COLOR} from '../consts';
import Konva from 'konva';
import {observer} from 'mobx-react-lite';
import graphStore from '../stores/GraphStore';

export interface MatrixProps {
    // addPoint: (event: Konva.KonvaEventObject<MouseEvent>, stageRef?: Konva.Stage|null) => void
}

const Matrix: FC<MatrixProps> = observer(({
                                              // points,connections,setConnections
                                          }) => {

    // const [incidenceMatrix, setIncidenceMatrix] = useState<IncidenceMatrixCell[][]>([
    //     ['', new Connection('123', '321', 22, 'black', '223')], [new Point(10, 12, '123', BASE_POINT_COLOR), 1],
    // ])

    // useEffect(() => {
    //     let rows: any[] = [[{name: ''}], ...points.map((point:Point) => {
    //         let p = {
    //             ...point,
    //             name: point.key.substring(point.key.length - 2),
    //         }
    //         return [p]
    //     })]
    //     for (let i = 0; i < connections.length; i++) {
    //         const from = connections[i].from
    //         const to = connections[i].to
    //         for (let j = 0; j < rows.length; j++) {
    //             if (rows[j][0].key === from || rows[j][0].key === to) {
    //                 rows[j].push(connections[i].weight)
    //             } else {
    //                 if (j === 0) {
    //                     rows[j].push({
    //                         ...connections[i],
    //                         name: from.substring(from.length - 2) + '-' + to.substring(to.length - 2),
    //                     })
    //                 } else rows[j].push(0)
    //             }
    //         }
    //     }
    //     setIncidenceMatrix(rows)
    // }, [points, connections])

    const changeWeight = (value: number, row: any, col: number) :void=> {
        // if (value > 0) {
        //     setConnections(connections.map((connection: Connection, index: number) => {
        //         if (index + 1 === col) {
        //             return new Connection(connection.from, connection.to, value, connection.colour, connection.key)
        //         } else return connection
        //     }))
        // }
    }

    return <div className="matrix">
        {graphStore.incidenceMatrix.map((row: IncidenceMatrixCell[], rowIndex) => {
            return <div key={rowIndex} className="matrix-row no-margin no-padding">
                {row.map((cell: IncidenceMatrixCell, colIndex) => {
                    return <MatrixCell
                        key={'' + rowIndex + colIndex}
                        col={colIndex}
                        row={rowIndex}
                        cell={cell}
                        changeWeight={changeWeight}
                    />
                })}
            </div>
        })}
    </div>
})

export default Matrix;