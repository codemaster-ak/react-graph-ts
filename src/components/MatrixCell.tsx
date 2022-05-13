import React, {FC} from 'react';
import {InputNumber} from 'antd';
import Point from '../classes/Point';
import Connection from '../classes/Connection';
import {IncidenceMatrixCell} from '../types';
import graphStore from '../stores/GraphStore';

interface MatrixCellProps {
    row: number
    col: number
    cell: IncidenceMatrixCell
    incidenceMatrix: IncidenceMatrixCell[][]
    changeWeight: (value: number, row: number, col: number) => void
}

const MatrixCell: FC<MatrixCellProps> = ({
                                             row,
                                             col,
                                             cell,
                                             incidenceMatrix,
                                             changeWeight,
                                         }) => {

    const getCellText = (cell: IncidenceMatrixCell): string => {
        // console.log(col,row,cell)
        if (cell instanceof Connection) return cell.getConnectionName()
        else if (cell instanceof Point) return cell.getPointName()
        else return ''
    }

    const getWeight = (cell: IncidenceMatrixCell) => {
        if (col !== 0 && row !== 0) return Number(cell)
    }

    return <div className="matrix-cell">
        {col === 0 || row === 0
            ? <div className="matrix-cell">
                {getCellText(cell)}
            </div>
            : <InputNumber
                size="large"
                min={0}
                max={99}
                value={getWeight(cell)}
                readOnly={incidenceMatrix[row][col] === 0}
                onChange={(value: number) => changeWeight(value, row, col)}
                style={{width: 60, border: '1px solid #000'}}
            />
        }
    </div>
}

export default MatrixCell;