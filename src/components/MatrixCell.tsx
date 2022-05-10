import React, {FC} from 'react';
import {InputNumber} from 'antd';

interface MatrixCellProps {
    row: number
    col: number
    colValue: {name: string}
    incMatrix: any[]
    changeWeight: (value: number, row: number, col: number) => void
}

const MatrixCell: FC<MatrixCellProps> = ({row, col, colValue, incMatrix, changeWeight}) => {

    return <div className="matrix-cell">
        {col === 0
            ? <div className="matrix-cell">
                {row > 0 ? colValue.name : ''}
            </div>
            : row === 0
                ? <div className="matrix-cell">
                    {colValue.name}
                </div>
                : <InputNumber
                    size="large"
                    min={0}
                    max={99}
                    value={incMatrix[row][col]}
                    readOnly={incMatrix[row][col] === 0}
                    onChange={(value: number) => changeWeight(value, row, col)}
                    style={{width: 60, border: '1px solid #000000'}}
                />
        }
    </div>
}

export default MatrixCell;