import React, {Dispatch, FC, SetStateAction} from 'react';
import Controls from './Controls';

interface HeaderProps {
    path: number[]
    setPath: Dispatch<SetStateAction<number[]>>
    distance: number | undefined
    setDistance: Dispatch<SetStateAction<number | undefined>>
}

const Header: FC<HeaderProps> = ({
                                     path,
                                     setPath,
                                     distance,
                                     setDistance
                                 }) => {

    return <div>
        <Controls path={path} setPath={setPath} distance={distance} setDistance={setDistance}/>
    </div>
}

export default Header;