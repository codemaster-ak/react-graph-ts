import React, {FC, useState} from 'react';
import {Button, message} from "antd";
import Graph from "../classes/Graph";
import {ComputeMethods, ConnectionColours, PointColours} from "../enums";
import Painter from "../classes/Painter";
import graphStore from "../stores/GraphStore";
import pathfinderStore from "../stores/PathfinderStore";
import {observer} from "mobx-react-lite";

interface HeaderProps {
    fromPointKey: string
    toPointKey: string
    compareResult: string
    throughPoints: string[]
    selectedMethod: ComputeMethods
}

const Header: FC<HeaderProps> = observer(({
                                              fromPointKey,
                                              toPointKey,
                                              compareResult,
                                              throughPoints,
                                              selectedMethod
                                          }) => {

    const [highlighting, setHighlighting] = useState<boolean>(false)
    const [path, setPath] = useState<number[]>([])
    const [distance, setDistance] = useState<number | undefined>(undefined)

    const toggleHighlight = () => {
        if (highlighting) {
            graphStore.changePointsColour(Painter.getPointsToStopHighlight(), PointColours.BASE)
            graphStore.changeConnectionsColour(Painter.getConnectionsToStopHighlight(), ConnectionColours.BASE)
        } else {
            if (path.length > 0) {
                graphStore.changePointsColour(Painter.getPointsToHighlight(path), PointColours.HIGHLIGHTED)
                graphStore.changeConnectionsColour(
                    Painter.getConnectionsToHighlight(path), ConnectionColours.HIGHLIGHTED
                )
            }
        }
        setHighlighting(!highlighting)
    }

    const computePath = () => {
        const matrix = Graph.adjacencyMatrixValues()
        try {
            let startIndex = 0, finishIndex = 0
            const pointFrom = graphStore.findPointByKey(fromPointKey)//todo упростить
            const pointTo = graphStore.findPointByKey(toPointKey)
            if (pointFrom && pointTo) {
                startIndex = graphStore.findIndexByPoint(pointFrom) as number
                finishIndex = graphStore.findIndexByPoint(pointTo) as number
            }
            const [distance, path] = Graph.computePath(matrix, startIndex, finishIndex, selectedMethod)
            setDistance(distance)
            setPath(path)
            pathfinderStore.makePaths(path)
        } catch (error: any) {
            message.error(error).then()
        }
    }

    const computePathThroughPoints = () => {
        console.log(fromPointKey, toPointKey, throughPoints)
        const throughPointsPaths = Graph.throughPoints(fromPointKey, toPointKey, ...throughPoints)
        // console.log(throughPointsPaths)
        for (let i = 0; i < throughPointsPaths.length; i++) {
            if (throughPointsPaths[i][0] === fromPointKey && throughPointsPaths[i].at(-1) === toPointKey) {
                message.success(throughPointsPaths[i].map(point => point.substring(point.length - 2)).join(' -> ')).then()
            }
        }
    }

    const getPathValue = (path: number[]) => {
        let value = ''
        for (let i = 0; i < path.length; i++) {
            const point = graphStore.points[path[i]]
            value += point.getName() + ' -> '
        }
        return value.substring(0, value.length - 4)
    }

    return <div className='flex-center-column padding-md'>
        <div className='flex-container'>
            <Button
                type="primary"
                onClick={() => Painter.animatePath(path)}
                disabled={path?.length === 0}
            >
                Анимировать путь
            </Button>
            <Button
                type="primary"
                onClick={computePath}
                disabled={!fromPointKey || !toPointKey}
            >
                Кратчайший путь
            </Button>
            <Button
                type="primary"
                onClick={toggleHighlight}
                disabled={path.length === 0 || distance === Infinity}
            >
                {highlighting ? 'Отключить показ' : 'Показать маршрут'}
            </Button>
            <Button
                type="primary"
                onClick={computePathThroughPoints}
                disabled={!fromPointKey || !toPointKey}
            >
                Путь через точки
            </Button>
        </div>
        {path.length > 0 && graphStore.points.length > 0 && <p>Путь - {getPathValue(path)}</p>}
        <p>{compareResult}</p>
        {distance && <p>Расстояние - {distance}</p>}
    </div>
})

export default Header;