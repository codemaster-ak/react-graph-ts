import React, {FC, useState} from 'react';
import Matrix from './Matrix';
import Canvas from './Canvas';
import CanvasMenu from './CanvasMenu';
import MatrixContainer from './MatrixContainer';

const Main: FC = () => {

    const [canvasMenuVisible, setCanvasMenuVisible] = useState<boolean>(false)
    const [canvasMenuStyle, setCanvasMenuStyle] = useState<object | undefined>(undefined)

    return <div className="main">
        <MatrixContainer>
            <Matrix/>
        </MatrixContainer>
        <Canvas setCanvasMenuVisible={setCanvasMenuVisible} setCanvasMenuStyle={setCanvasMenuStyle}/>
        <CanvasMenu visible={canvasMenuVisible} setVisible={setCanvasMenuVisible} canvasMenuStyle={canvasMenuStyle}/>
    </div>
}

export default Main;