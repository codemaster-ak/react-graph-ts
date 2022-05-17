import React, {useEffect, useRef} from 'react';
import {Image} from "react-konva";
import Konva from "konva";
import useImage from "../../functions/useImage";
import graphStore from "../../stores/GraphStore";
import {observer} from "mobx-react-lite";

const Package = observer(() => {

    const {transitionLine} = graphStore

    const imageRef = useRef<Konva.Image>(null)
    const image = useImage('./file.png')

    useEffect(() => {
        anim()
    }, [transitionLine])

    const anim = () => {
        if (imageRef.current && transitionLine) {
            imageRef.current.to({
                x: transitionLine.to.x,
                y: transitionLine.to.y,
                duration: transitionLine.weight
            })
        }
    }
    // console.log(transitionLine)
    return transitionLine
        ? <Image
            ref={imageRef}
            image={image}
            x={transitionLine?.from.x}
            y={transitionLine?.from.y}
            draggable
        />
        : null
})

export default Package;