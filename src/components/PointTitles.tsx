import React, {FC, Fragment} from 'react';
import graphStore from '../stores/GraphStore';
import {observer} from 'mobx-react-lite';
import {Text} from 'react-konva';

const PointTitles: FC = observer(() => {

    return <Fragment>
        {graphStore.points.map(point => {
            const {x, y, key} = point
            return <Text
                key={key}
                x={x - 9}
                y={y - 6}
                fontSize={16}
                text={key.substring(key.length - 2)}
                fill="white"
                perfectDrawEnabled={false}
            />
        })}
    </Fragment>
})

export default PointTitles;