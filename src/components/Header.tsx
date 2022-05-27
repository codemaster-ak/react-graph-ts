import React, {FC, useState} from 'react';
import {Button, message, Select} from "antd";
import Graph from "../classes/Graph";
import {ComputeMethods, ConnectionColours, PointColours} from "../enums";
import Painter from "../classes/Painter";
import graphStore from "../stores/GraphStore";
import Pathfinder from "../classes/Pathfinder";
import {observer} from "mobx-react-lite";
import Point from "../classes/Point";

const {Option} = Select

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
    const [pathsThroughPoints, setPathsThroughPoints] = useState<{ path: string[], id: string }[]>([])
    const [selectedPathId, setSelectedPathId] = useState<string>('')

    const selectPath = (pathId: string) => {
        setSelectedPathId(pathId)
        const pathThroughPoints = pathsThroughPoints.find(path => path.id === pathId)
        if (pathThroughPoints) {
            const points = pathThroughPoints.path.map(key => graphStore.findPointByKey(key) as Point)
            const pointsNumbers = points.map(point => graphStore.findIndexByPoint(point) as number)
            setPath(pointsNumbers)
        }
    }

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
        } catch (error: any) {
            message.error(error).then()
        }
    }

    const computePathThroughPoints = () => {
        const fromToPathKeys: string[][] = []
        const pathfinder = new Pathfinder()
        const allPaths = pathfinder.allPaths(graphStore.points)
        for (let i = 0; i < allPaths.length; i++) {
            for (let j = 0; j < allPaths[i].length; j++) {
                if (allPaths[i][j][0].key === fromPointKey && allPaths[i][j].at(-1)?.key === toPointKey) {
                    fromToPathKeys.push(allPaths[i][j].map(point => point.key))
                }
            }
        }
        const pathsThroughPointKeys: { path: string[], id: string }[] = []
        for (let i = 0; i < fromToPathKeys.length; i++) {
            let includes = true
            for (let j = 0; j < throughPoints.length; j++) {
                if (!fromToPathKeys[i].includes(throughPoints[j])) includes = false
            }
            if (includes) pathsThroughPointKeys.push({path: fromToPathKeys[i], id: String(Math.random())})
        }
        // const paths: Point[][] = []
        // for (let i = 0; i < pathsThroughPointKeys.length; i++) {
        //     const path: Point[] = []
        //     for (let j = 0; j < pathsThroughPointKeys[i].length; j++) {
        //         path.push(graphStore.findPointByKey(pathsThroughPointKeys[i][j]) as Point)
        //     }
        //     paths.push(path)
        // }
        setPathsThroughPoints(pathsThroughPointKeys)
    }

    const getPathValue = (path: number[]) => {
        let value = ''
        for (let i = 0; i < path.length; i++) {
            const point = graphStore.points[path[i]]
            if (point) value += point.getName() + ' -> '
        }
        return value.substring(0, value.length - 4)
    }

    return <div className='flex-center-column padding-md'>
        <div className='flex-column'>
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
            <Select value={selectedPathId} onChange={selectPath}>
                {pathsThroughPoints.map(path => {
                    const pathNames: (string | null)[] = path.path
                        .map(pointKey => {
                            const point = graphStore.findPointByKey(pointKey)
                            if (point) return point.getName()
                            else return null
                        })
                    if (pathNames.includes(null)) return null
                    const pathValue = pathNames.join(' -> ')
                    return <Option value={path.id} key={path.id}>
                        {pathValue}
                    </Option>
                })}
            </Select></div>
        {path.length > 0 && graphStore.points.length > 0 && <p>Путь - {getPathValue(path)}</p>}
        <p>{compareResult}</p>
        {distance && <p>Расстояние - {distance}</p>}
    </div>
})

export default Header;