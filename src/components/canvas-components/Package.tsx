import React, {useEffect, useRef} from 'react';
import {Image} from "react-konva";
import Konva from "konva";
import useImage from "../../hooks/useImage";
import graphStore from "../../stores/GraphStore";
import {observer} from "mobx-react-lite";
import canvasStore from "../../stores/CanvasStore";

const Package = observer(() => {

    const {transitionLine} = canvasStore

    const imageRef = useRef<Konva.Image>(null)
    const image = useImage('./file.png')

    useEffect(() => {
        animation()
    }, [transitionLine])

    const animation = () => {
        if (imageRef.current && transitionLine) {
            imageRef.current.to({
                x: transitionLine.to.x,
                y: transitionLine.to.y,
                duration: 1
            })
        }
    }

    return transitionLine
        ? <Image
            ref={imageRef}
            image={image}
            x={transitionLine?.from.x}
            y={transitionLine?.from.y}
        />
        : null
})

export default Package;