import React, {FC} from 'react';
import Matrix from './Matrix';
import Canvas from './Canvas';
import MatrixContainer from './MatrixContainer';

const Main: FC = () => {

    return <div className="main">
        <MatrixContainer>
            <Matrix/>
        </MatrixContainer>
        <Canvas/>
    </div>
}

export default Main;