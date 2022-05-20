import React, {FC, ReactElement, ReactNode, useRef, useState} from 'react';
import {Layer, Line, Stage} from 'react-konva';
import Border from './canvas-components/Border';
import {STAGE_SIZE} from '../consts';
import Point from '../classes/Point';
import Konva from 'konva';
import Points from './canvas-components/Points';
import {message} from 'antd';
import {observer} from 'mobx-react-lite';
import graphStore from '../stores/GraphStore';
import Connections from './canvas-components/Connections';
import ConnectionWeights from './canvas-components/ConnectionWeights';
import ConnectionPreview from './canvas-components/ConnectionPreview';
import PointTitles from './canvas-components/PointTitles';
import CanvasHandler from '../classes/CanvasHandler';
import {runInAction} from 'mobx';
import Transition from "./canvas-components/Transition";
import Package from "./canvas-components/Package";
import KonvaEventObject = Konva.KonvaEventObject;
import {ConnectionColours} from "../enums";

const Canvas: FC = observer(() => {

    const stageRef = useRef<Konva.Stage>(null)

    const [connectionPreview, setConnectionPreview] = useState<ReactElement<ReactNode> | null>(null)

    const onClickStageHandler = (event: KonvaEventObject<PointerEvent>): void => {
        if (event.target === stageRef.current) {
            runInAction(() => graphStore.selectedPoint = null)
        }
    }

    const addPoint = (event: KonvaEventObject<MouseEvent>, stage: Konva.Stage | null): void => {
        if (event.target === stage) {
            event.evt.preventDefault()
            const mousePos = CanvasHandler.getMousePos(event)
            graphStore.addPoint(mousePos.x, mousePos.y)
        }
    }

    const addConnection = (mousePos: Konva.Vector2d, from: Point): void => {
        const target = CanvasHandler.detectConnection(mousePos, from)
        if (target) graphStore.addConnection(from, target)
    }

    const anchorDragStartHandler = (event: KonvaEventObject<DragEvent>) => {
        const position = event.target.position()
        setConnectionPreview(
            <Line
                x={position.x}
                y={position.y}
                points={CanvasHandler.createConnectionPoints(position, position)}
                stroke={ConnectionColours.BASE}
                strokeWidth={3}
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
                stroke={ConnectionColours.BASE}
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
            <Connections/>
            {/**<Transition/> тут должно быть*/}
            <ConnectionWeights/>
            <ConnectionPreview line={connectionPreview}/>
            <Border
                onAnchorDragMove={anchorDragMoveHandler}
                onAnchorDragStart={anchorDragStartHandler}
                onAnchorDragEnd={anchorDragEndHandler}
            />
            <Points/>
            <PointTitles/>
            <Transition/>
            <Package/>
        </Layer>
    </Stage>
})

export default Canvas;