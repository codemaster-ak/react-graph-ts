import React, {FC} from 'react';

interface MatrixContainerProps {
}

const MatrixContainer: FC<MatrixContainerProps> = ({children}) => {

    return <div className="matrix-container">
        {children}
    </div>
}

export default MatrixContainer;