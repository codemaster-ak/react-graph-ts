import React, {Dispatch, FC, ReactElement, ReactNode, SetStateAction, useRef, useState} from 'react';
import {Layer, Line, Stage} from 'react-konva';
import Border from './canvas-components/Border';
import {STAGE_SIZE} from '../consts';
import Connection from '../classes/Connection';
import Point from '../classes/Point';
import Konva from 'konva';
import Points from './canvas-components/Points';
import {message} from 'antd';
import {observer} from 'mobx-react-lite';
import graphStore from '../stores/GraphStore';
import Connections from './canvas-components/Connections';
import ConnectionWeights from './canvas-components/ConnectionWeights';
import ConnectionPreview from './canvas-components/ConnectionPreview';
import ConnectionWeightValues from './canvas-components/ConnectionWeightValues';
import PointTitles from './canvas-components/PointTitles';
import CanvasHandler from '../classes/CanvasHandler';
import {runInAction} from 'mobx';
import KonvaEventObject = Konva.KonvaEventObject;

interface CanvasProps {
    setCanvasMenuVisible: Dispatch<SetStateAction<boolean>>
    setCanvasMenuStyle: Dispatch<SetStateAction<object>>
}

const Canvas: FC<CanvasProps> = observer(({setCanvasMenuVisible, setCanvasMenuStyle}) => {

    const stageRef = useRef<Konva.Stage>(null)
    const [connectionPreview, setConnectionPreview] = useState<ReactElement<ReactNode> | null>(null)

    const onClickStageHandler = (event: KonvaEventObject<PointerEvent>): void => {
        if (event.target === stageRef.current) {
            runInAction(() => {
                graphStore.selectedPoint = null
                graphStore.selectedConnection = null
            })
        }
    }

    const onClickConnectionHandler = (event: KonvaEventObject<PointerEvent>, connection: Connection): void => {
        event.evt.preventDefault()
        if (graphStore.selectedConnection?.key === connection.key) {
            runInAction(() => graphStore.selectedConnection = null)
            setCanvasMenuVisible(false)
        } else {
            runInAction(() => graphStore.selectedConnection = connection)
            setCanvasMenuVisible(true)
            setCanvasMenuStyle({top: event.evt.clientY, left: event.evt.clientX})
        }
    }

    const addPoint = (event: KonvaEventObject<MouseEvent>, stage: Konva.Stage | null): void => {
        if (event.target === stage) {
            event.evt.preventDefault()
            const mousePos = CanvasHandler.getMousePos(event)
            try {
                graphStore.addPoint(mousePos.x, mousePos.y)
            } catch (error: any) {
                message.warn(error.message, 1).then()
            }
        }
    }

    const addConnection = (mousePos: Konva.Vector2d, point: Point): void => {
        const targetPoint = CanvasHandler.detectConnection(mousePos, point)
        if (targetPoint) graphStore.addConnection(point, targetPoint)
    }

    const anchorDragStartHandler = (event: KonvaEventObject<DragEvent>) => {
        const position = event.target.position()
        setConnectionPreview(
            <Line
                x={position.x}
                y={position.y}
                points={CanvasHandler.createConnectionPoints(position, position)}
                stroke="black"
                strokeWidth={2}
            />,
        )
    }

    const anchorDragMoveHandler = (event: KonvaEventObject<DragEvent>) => {
        const position = event.target.position()
        const mousePos = CanvasHandler.getMousePos(event)
        setConnectionPreview(
            <Line
                x={position.x}
                y={position.y}
                points={CanvasHandler.createConnectionPoints({x: 0, y: 0}, mousePos)}
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
        onClick={onClickStageHandler}
        onDblClick={(event) => addPoint(event, stageRef.current)}
    >
        <Layer>
            {/** порядок Border и Points не менять */}
            <Connections onClickHandler={onClickConnectionHandler}/>
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
})

export default Canvas;