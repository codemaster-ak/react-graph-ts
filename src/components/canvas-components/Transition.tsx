import React, {useRef} from 'react';
import {Line} from "react-konva";
import Konva from "konva";
import graphStore from "../../stores/GraphStore";
import {observer} from "mobx-react-lite";

const Transition = observer(() => {

    const {transitionLine} = graphStore
    const ref = useRef<Konva.Line>(null)

    return transitionLine
        ? <Line
            ref={ref}
            x={transitionLine.from.x}
            y={transitionLine.from.y}
            stroke="#f00"
            strokeWidth={3}
        />
        : null
})

export default Transition;