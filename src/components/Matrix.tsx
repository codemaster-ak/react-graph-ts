import React, {FC} from 'react';
import MatrixCell from './MatrixCell';
import {observer} from 'mobx-react-lite';
import graphStore from '../stores/GraphStore';
import {IncidenceMatrixCell} from "../interfaces";

const Matrix: FC = observer(() => {

    return <div className="matrix">
        {graphStore.incidenceMatrix.map((row: IncidenceMatrixCell[], rowIndex) => {
            return <div key={rowIndex} className="matrix-row no-margin no-padding">
                {row.map((cell: IncidenceMatrixCell, colIndex) => {
                    return <MatrixCell
                        key={'' + rowIndex + colIndex}
                        col={colIndex}
                        row={rowIndex}
                        cell={cell}
                    />
                })}
            </div>
        })}
    </div>
})

export default Matrix;