import React, {FC, Fragment, useEffect, useState} from 'react';
import {Text} from 'react-konva';
import graphStore from '../../stores/GraphStore';
import {observer} from 'mobx-react-lite';
import CanvasHandler from "../../classes/CanvasHandler";
import ConnectionWeight from "./ConnectionWeight";
import Connection from "../../classes/Connection";
import Konva from "konva";

interface ConnectionWeightsProps {
    hovered: boolean
    hoveredConnection: Connection | null
}

const ConnectionWeights: FC<ConnectionWeightsProps> = observer(({
                                                                    hovered,
                                                                    hoveredConnection
                                                                }) => {
    //
    // const [hovered, setHovered] = useState<boolean>(false)
    // const [hoveredConnection, setHoveredConnection] = useState<Connection | null>(null)

    // useEffect(()=>{
    // },[])
    // console.log(hovered)
    // const onMouseEnter = (connection: Connection): void => {
    //     setHovered(true)
    //     setHoveredConnection(connection)
    // }

    // const onMouseMove = (connection: Connection): void => {
    //     setHovered(true)
    //     setHoveredConnection(connection)
    // }

    // const onMouseLeave = (e:any): void => {
    //     // if (e.){}
    //     // console.log(e)
    //     // console.log(e )
    //     // console.log(e.currentTarget._id)
    //     // console.log(e.evt )
    //     // console.log(e.currentTarget instanceof Konva.Text)
    //     setHovered(false)
    //     setHoveredConnection(null)
    // }

    return <Fragment>
        {graphStore.connections.map(connection => {
            const {from, to, weight, key} = connection
            const {x, y} = CanvasHandler.getConnectionWeightCoords(from, to)
            return <Fragment key={key}>
                <ConnectionWeight
                    x={x}
                    y={y}
                    connection={connection}
                    hovered={hovered}
                    hoveredConnection={hoveredConnection}
                    // onMouseEnter={onMouseEnter}
                    // onMouseMove={onMouseMove}
                    // onMouseLeave={onMouseLeave}
                />
                <Text
                    // onMouseEnter={() => onMouseEnter(connection)}
                    // onMouseMove={() => onMouseMove(connection)}
                    // onMouseLeave={(e) => onMouseLeave(e)}
                    text={String(weight)}
                    fontSize={16}
                    x={weight < 10 ? x - 4 : x - 9}
                    y={y - 6}
                    fill="black"
                    perfectDrawEnabled={false}
                />
            </Fragment>
        })}
    </Fragment>
})

export default ConnectionWeights;

