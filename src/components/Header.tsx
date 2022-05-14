import React, {FC} from 'react';
import Controls from './Controls';


const Header: FC = ({}) => {

    const computePath = () => {

    }

    return <div>
        <Controls computePath={computePath}/>
    </div>
}

export default Header;