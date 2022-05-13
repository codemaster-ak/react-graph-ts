import React, {Dispatch, FC, LegacyRef, SetStateAction, useEffect, useRef, useState} from 'react';
import {Circle, Layer, Line, Stage, Text} from 'react-konva';
import Border from './Border';
import {BASE_CONNECTION_COLOR, POINT_SIZE, STAGE_SIZE} from '../consts';
import Connection from '../classes/Connection';
import {createConnectionPoints, getConnectionCoords, getMousePos, hasIntersection} from '../functions/canvasFunctions';
import Point from '../classes/Point';
import {KonvaEventObject} from 'konva/lib/Node';
import Konva from 'konva';
import Points from './Points';
import {message} from 'antd';
import {observer} from 'mobx-react-lite';
import graphStore from '../stores/GraphStore';
import Connections from './Connections';
import ConnectionWeights from './ConnectionWeights';
import ConnectionPreview from './ConnectionPreview';
import ConnectionWeightValues from './ConnectionWeightValues';
import PointTitles from './PointTitles';

interface CanvasProps {
    // addConnection?: (event: Konva.KonvaEventObject<DragEvent>, selectedPoint: Point | undefined, setConnectionPreview: (value: any) => void, detectConnection: (position: {x: number}, point: Point) => Point) => void
    // menuVisible?: boolean
    // setMenuVisible?: (b: boolean) => void
    // setInputVisible?: (b: boolean) => void
    // setMenuStyle?: (p: {top: number; left: number; position: string}) => void
    // selectedEntity?: Connection | undefined
    // setSelectedEntity?: (entity: Connection | undefined) => void
}

const Canvas: FC<CanvasProps> = observer(({
                                              // addConnection,
                                              // menuVisible,
                                              // setMenuVisible,
                                              // setInputVisible,
                                              // setMenuStyle,
                                              // selectedEntity,
                                              // setSelectedEntity,
                                          }) => {

    const stageRef = useRef<Konva.Stage>(null)

    const [selectedPoint, setSelectedPoint] = useState<Point | null>(null)
    const [connectionPreview, setConnectionPreview] = useState<any>([])
//
    const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)
    const [menuVisible, setMenuVisible] = useState<boolean>(false)
    const [inputVisible, setInputVisible] = useState<boolean>(false)
    const [menuStyle, setMenuStyle] = useState<any>(false)

    const handleOnContextMenu = (event: KonvaEventObject<PointerEvent>, entity: Point | Connection | undefined) => {
        event.evt.preventDefault()
        if (entity instanceof Connection) {
            if (selectedConnection === entity) {
                setMenuVisible(false)
                setInputVisible(false)
                setSelectedConnection(null)
            } else {
                // const positionX = stageRef.current.getPointerPosition().x
                // const positionY = stageRef.current.getPointerPosition().y
                setMenuVisible(true)
                setMenuStyle({position: 'absolute', top: event.evt.clientY, left: event.evt.clientX})
                setSelectedConnection(entity)
            }
        }
    }


    const detectConnection = (position: Konva.Vector2d, point: Point): Point | undefined => {
        return graphStore.points.find((p: Point) => {
            // console.log( hasIntersection(position, point))
            return p.key !== point.key && hasIntersection(position, p)
        })
    }

    // const deletePoint = (key: string) => {
    //     setConnections(connections.filter((connection: Connection) => {
    //         return connection.from !== key && connection.to !== key
    //     }))
    //     setPoints(points.filter((point: Point) => {
    //         return point.key !== key
    //     }))
    //     setSelectedPoint(undefined)
    // }
    //
    // const handleOnClick = (point: Point) => {
    //     if (selectedPoint?.key === point.key) {
    //         setSelectedPoint(undefined)
    //     } else {
    //         setSelectedPoint(point)
    //     }
    // }
    //
    // const handleOnContextMenu = (event: KonvaEventObject<PointerEvent>, entity: Point | Connection | undefined) => {
    //     event.evt.preventDefault()
    //     if (entity instanceof Connection) {
    //         if (selectedEntity === entity) {
    //             setMenuVisible(false)
    //             setInputVisible(false)
    //             setSelectedEntity(undefined)
    //         } else {
    //             // const positionX = stageRef.current.getPointerPosition().x
    //             // const positionY = stageRef.current.getPointerPosition().y
    //             setMenuVisible(true)
    //             setMenuStyle({position: 'absolute', top: event.evt.clientY, left: event.evt.clientX})
    //             setSelectedEntity(entity)
    //         }
    //     }
    // }
    //
    // const handlePointDrag = (event: KonvaEventObject<DragEvent>, key: string) => {
    //     const position = event.target.position()
    //     setPoints(points.map(point => {
    //         if (point.key === key) {
    //             point.x = position.x
    //             point.y = position.y
    //         }
    //         return point
    //     }))
    // }
    //

    //
    // const onContextMenu = (event: KonvaEventObject<PointerEvent>) => {
    //     event.evt.preventDefault()
    //     // if (event.target !== stageRef.current) {
    //     //     setMenuVisible(true)
    //     // }
    //     if (menuVisible) {
    //         setInputVisible(false)
    //         setMenuVisible(false)
    //     }
    // }
    //
    // const pointObjs = points.map(point => {
    //     return <Circle
    //         key={point.key}
    //         x={point.x}
    //         y={point.y}
    //         radius={SIZE}
    //         fill={point.colour}
    //         onClick={() => handleOnClick(point)}
    //         onDblClick={() => deletePoint(point.key)}
    //         onContextMenu={event => handleOnContextMenu(event, point)}
    //         draggable
    //         onDragMove={event => handlePointDrag(event, point.key)}
    //         perfectDrawEnabled={true}
    //     />
    // })
    //
    // const connectionObjs = connections?.map((connection) => {
    //     const fromPoint = points.find(point => point.key === connection.from)
    //     const toPoint = points.find(point => point.key === connection.to)
    //     if (fromPoint && toPoint) {
    //         const lineEnd = {
    //             x: toPoint.x - fromPoint.x,
    //             y: toPoint.y - fromPoint.y,
    //         }
    //         const connectionPoints = createConnectionPoints({x: 0, y: 0}, lineEnd)
    //         return <Line
    //             key={connection.from + connection.to + Math.random()}
    //             x={fromPoint.x}
    //             y={fromPoint.y}
    //             points={connectionPoints}
    //             stroke={connection.colour}
    //             strokeWidth={3}
    //             hitStrokeWidth={5}
    //             onContextMenu={event => handleOnContextMenu(event, connection)}
    //         />
    //     } else return null
    // })
    //


    // const pointTitles = points.map(point => {
    //     return <Text
    //         key={point.key}
    //         x={point.x - 9}
    //         y={point.y - 6}
    //         fontSize={16}
    //         text={point.key.substring(point.key.length - 2)}
    //         fill="white"
    //         perfectDrawEnabled={false}
    //     />
    // })
    //
    // const connectionWeights = connections.map((connection) => {
    //     const fromPoint = points.find(point => point.key === connection.from)
    //     const toPoint = points.find(point => point.key === connection.to)
    //     if (fromPoint && toPoint) {
    //         const [x, y] = getConnectionCoords(fromPoint, toPoint)
    //         return <Circle
    //             key={connection.from + connection.to}
    //             x={x}
    //             y={y}
    //             radius={15}
    //             fill="white"
    //             perfectDrawEnabled={false}
    //         />
    //     } else return null
    // })
    //
    // const connectionWeightTexts = connections.map((connection) => {
    //     const fromPoint = points.find(point => point.key === connection.from)
    //     const toPoint = points.find(point => point.key === connection.to)
    //     if (fromPoint && toPoint) {
    //         const [x, y] = getConnectionCoords(fromPoint, toPoint)
    //         return <Text
    //             key={connection.from + connection.to}
    //             x={x - 6}
    //             y={y - 8}
    //             fontSize={20}
    //             text={String(connection.weight)}
    //             fill="black"
    //             perfectDrawEnabled={false}
    //         />
    //     } else return null
    // })

    const addPoint = (event: KonvaEventObject<MouseEvent>, stage: Konva.Stage | null): void => {
        if (event.target === stage) {
            event.evt.preventDefault()
            const mousePos = getMousePos(event)
            try {
                graphStore.addPoint(mousePos.x, mousePos.y)
            } catch (error: any) {
                message.warn(error.message, 1).then()
            }
        }
    }

    const addConnection = (mousePos: Konva.Vector2d, point: Point): void => {
        const targetPoint = detectConnection(mousePos, point)
        if (targetPoint) {
            const exists = graphStore.connections.some(connection => {
                return (connection.from.key === point.key && connection.to.key === targetPoint.key)
                    || (connection.from.key === targetPoint.key && connection.to.key === point.key)
            })
            if (!exists) graphStore.addConnection(point, targetPoint)
        }
    }

    const anchorDragStartHandler = (event: KonvaEventObject<DragEvent>) => {
        const position = event.target.position()
        setConnectionPreview(
            <Line
                x={position.x}
                y={position.y}
                points={createConnectionPoints(position, position)}
                stroke="black"
                strokeWidth={2}
            />,
        )
    }

    const anchorDragMoveHandler = (event: KonvaEventObject<DragEvent>) => {
        const position = event.target.position()
        const mousePos = getMousePos(event)
        setConnectionPreview(
            <Line
                x={position.x}
                y={position.y}
                points={createConnectionPoints({x: 0, y: 0}, mousePos)}
                stroke="#656565"
                strokeWidth={3}
            />,
        )
    }

    const anchorDragEndHandler = (event: KonvaEventObject<MouseEvent>): void => {
        setConnectionPreview(null)
        const stage = event.target.getStage()!
        const mousePos = stage.getPointerPosition()!
        const {selectedPoint} = graphStore
        if (selectedPoint) addConnection(mousePos, selectedPoint)
    }

    return <Stage
        width={STAGE_SIZE}
        height={STAGE_SIZE}
        ref={stageRef}
        onDblClick={(event) => addPoint(event, stageRef.current)}
    >
        <Layer>
            {/** порядок Border и Points не менять */}
            <Connections handleOnContextMenu={handleOnContextMenu}/>
            <ConnectionWeights/>
            <ConnectionWeightValues/>
            <ConnectionPreview line={connectionPreview}/>
            <Border
                onAnchorDragMove={anchorDragMoveHandler}
                onAnchorDragStart={anchorDragStartHandler}
                onAnchorDragEnd={anchorDragEndHandler}
            />
            <Points/>
            <PointTitles/>
        </Layer>
    </Stage>
    // return <Stage
    //     width={STAGE_SIZE}
    //     height={STAGE_SIZE}
    //     onDblClick={event => addPoint(event, stageRef)}
    //     onContextMenu={event => onContextMenu(event)}
    //     ref={stageRef}
    // >
    //     <Layer>
    //         {/** порядок borders и pointObjs не менять */}
    //         {connectionObjs}
    //         {connectionWeights}
    //         {connectionWeightTexts}
    //         {connectionPreview}
    //         {borders}
    //         {pointObjs}
    //         {pointTitles}
    //     </Layer>
    // </Stage>
})

export default Canvas;