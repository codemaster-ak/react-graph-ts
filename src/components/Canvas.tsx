import React, {FC, useRef, useState} from 'react';
import {Circle, Layer, Line, Stage, Text} from 'react-konva';
import Border from './Border';
import {SIZE, STAGE_SIZE} from '../consts';
import Connection from '../classes/Connection';
import {createConnectionPoints, getConnectionCoords, getMousePos, hasIntersection} from '../functions/canvasFunctions';
import Point from '../classes/Point';
import {KonvaEventObject} from 'konva/lib/Node';
import Konva from 'konva';

interface CanvasProps {
    points: Point[]
    setPoints: (c: Point[]) => void
    connections: Connection[]
    setConnections: (c: Connection[]) => void
    addPoint: (event: Konva.KonvaEventObject<MouseEvent>, stageRef: React.RefObject<any>) => void
    addConnection: (event: Konva.KonvaEventObject<DragEvent>, selectedPoint: Point | undefined, setConnectionPreview: (value: any) => void, detectConnection: (position: {x: number}, point: Point) => Point) => void
    menuVisible: boolean
    setMenuVisible: (b: boolean) => void
    setInputVisible: (b: boolean) => void
    setMenuStyle: (p: {top: number; left: number; position: string}) => void
    selectedEntity: Connection | undefined
    setSelectedEntity: (entity: Connection | undefined) => void
}

const Canvas: FC<CanvasProps> = ({
                                     points,
                                     setPoints,
                                     connections,
                                     setConnections,
                                     addPoint,
                                     addConnection,
                                     menuVisible,
                                     setMenuVisible,
                                     setInputVisible,
                                     setMenuStyle,
                                     selectedEntity,
                                     setSelectedEntity,
                                 }) => {

    const stageRef = useRef<any>(undefined)

    const [selectedPoint, setSelectedPoint] = useState<Point | undefined>(undefined)
    const [connectionPreview, setConnectionPreview] = useState<any | null>(null)

    const detectConnection = (position: {x: number;}, point: Point): Point => {
        return points.find((p: Point) => {
            return p.key !== point.key && hasIntersection(position, p)
        }) as Point
    }

    const deletePoint = (key: string) => {
        setConnections(connections.filter((connection: Connection) => {
            return connection.from !== key && connection.to !== key
        }))
        setPoints(points.filter((point: Point) => {
            return point.key !== key
        }))
        setSelectedPoint(undefined)
    }

    const handleOnClick = (point: Point) => {
        if (selectedPoint?.key === point.key) {
            setSelectedPoint(undefined)
        } else {
            setSelectedPoint(point)
        }
    }

    const handleOnContextMenu = (event: KonvaEventObject<PointerEvent>, entity: Point | Connection | undefined) => {
        event.evt.preventDefault()
        if (entity instanceof Connection) {
            if (selectedEntity === entity) {
                setMenuVisible(false)
                setInputVisible(false)
                setSelectedEntity(undefined)
            } else {
                // const positionX = stageRef.current.getPointerPosition().x
                // const positionY = stageRef.current.getPointerPosition().y
                setMenuVisible(true)
                setMenuStyle({position: 'absolute', top: event.evt.clientY, left: event.evt.clientX})
                setSelectedEntity(entity)
            }
        }
    }

    const handlePointDrag = (event: KonvaEventObject<DragEvent>, key: string) => {
        const position = event.target.position()
        setPoints(points.map(point => {
            if (point.key === key) {
                point.x = position.x
                point.y = position.y
            }
            return point
        }))
    }

    const handleAnchorDragStart = (event: KonvaEventObject<DragEvent>) => {
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

    const handleAnchorDragMove = (event: KonvaEventObject<DragEvent>) => {
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

    const onContextMenu = (event: KonvaEventObject<PointerEvent>) => {
        event.evt.preventDefault()
        // if (event.target !== stageRef.current) {
        //     setMenuVisible(true)
        // }
        if (menuVisible) {
            setInputVisible(false)
            setMenuVisible(false)
        }
    }

    const pointObjs = points.map(point => {
        return <Circle
            key={point.key}
            x={point.x}
            y={point.y}
            radius={SIZE}
            fill={point.colour}
            onClick={() => handleOnClick(point)}
            onDblClick={() => deletePoint(point.key)}
            onContextMenu={event => handleOnContextMenu(event, point)}
            draggable
            onDragMove={event => handlePointDrag(event, point.key)}
            perfectDrawEnabled={true}
        />
    })

    const connectionObjs = connections?.map((connection) => {
        const fromPoint = points.find(point => point.key === connection.from)
        const toPoint = points.find(point => point.key === connection.to)
        if (fromPoint && toPoint) {
            const lineEnd = {
                x: toPoint.x - fromPoint.x,
                y: toPoint.y - fromPoint.y,
            }
            const connectionPoints = createConnectionPoints({x: 0, y: 0}, lineEnd)
            return <Line
                key={connection.from + connection.to + Math.random()}
                x={fromPoint.x}
                y={fromPoint.y}
                points={connectionPoints}
                stroke={connection.colour}
                strokeWidth={3}
                hitStrokeWidth={5}
                onContextMenu={event => handleOnContextMenu(event, connection)}
            />
        } else return null
    })

    const borders = selectedPoint
        ? <Border
            id={selectedPoint.key}
            point={selectedPoint}
            onAnchorDragEnd={event => addConnection(event, selectedPoint, setConnectionPreview, detectConnection)}
            onAnchorDragMove={handleAnchorDragMove}
            onAnchorDragStart={handleAnchorDragStart}
        />
        : null

    const pointTitles = points.map(point => {
        return <Text
            key={point.key}
            x={point.x - 9}
            y={point.y - 6}
            fontSize={16}
            text={point.key.substring(point.key.length - 2)}
            fill="white"
            perfectDrawEnabled={false}
        />
    })

    const connectionWeights = connections.map((connection) => {
        const fromPoint = points.find(point => point.key === connection.from)
        const toPoint = points.find(point => point.key === connection.to)
        if (fromPoint && toPoint) {
            const [x, y] = getConnectionCoords(fromPoint, toPoint)
            return <Circle
                key={connection.from + connection.to}
                x={x}
                y={y}
                radius={15}
                fill="white"
                perfectDrawEnabled={false}
            />
        } else return null
    })

    const connectionWeightTexts = connections.map((connection) => {
        const fromPoint = points.find(point => point.key === connection.from)
        const toPoint = points.find(point => point.key === connection.to)
        if (fromPoint && toPoint) {
            const [x, y] = getConnectionCoords(fromPoint, toPoint)
            return <Text
                key={connection.from + connection.to}
                x={x - 6}
                y={y - 8}
                fontSize={20}
                text={String(connection.weight)}
                fill="black"
                perfectDrawEnabled={false}
            />
        } else return null
    })

    return <Stage
        width={STAGE_SIZE}
        height={STAGE_SIZE}
        onDblClick={event => addPoint(event, stageRef)}
        onContextMenu={event => onContextMenu(event)}
        ref={stageRef}
        className="flex-grow-1 flex-center"
    >
        <Layer>
            {/** порядок borders и pointObjs не менять */}
            {connectionObjs}
            {connectionWeights}
            {connectionWeightTexts}
            {connectionPreview}
            {borders}
            {pointObjs}
            {pointTitles}
        </Layer>
    </Stage>
}

export default Canvas;