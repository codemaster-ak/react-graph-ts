import React, {FC} from 'react';

const MatrixContainer: FC = ({children}) => {

    return <div className="matrix-container">
        {children}
    </div>
}

export default MatrixContainer;