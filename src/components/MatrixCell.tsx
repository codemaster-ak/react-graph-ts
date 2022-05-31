import React, {FC} from 'react';
import {InputNumber} from 'antd';
import Point from '../classes/Point';
import Connection from '../classes/Connection';
import graphStore from '../stores/GraphStore';
import {observer} from 'mobx-react-lite';
import {IncidenceMatrixCell} from "../interfaces";

interface MatrixCellProps {
    row: number
    col: number
    cell: IncidenceMatrixCell
}

const MatrixCell: FC<MatrixCellProps> = observer(({
                                                      row,
                                                      col,
                                                      cell,
                                                  }) => {

    const getCellText = (cell: IncidenceMatrixCell): string => {
        if (cell instanceof Connection || cell instanceof Point) return cell.getName()
        return ''
    }

    const getWeight = (cell: IncidenceMatrixCell): number | undefined => {
        if (col !== 0 && row !== 0) return Number(cell)
    }

    const changeWeight = (value: number): void => {
        for (let i = 0; i < graphStore.connections.length; i++) {
            if (i + 1 === col) graphStore.changeConnectionWeight(graphStore.connections[i].key, value)
        }
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
                readOnly={graphStore.incidenceMatrix[row][col] === 0}
                onChange={changeWeight}
                style={{width: 60, border: '1px solid #000'}}
            />
        }
    </div>
})

export default MatrixCell;