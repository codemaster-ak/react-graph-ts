import React, {FC, useState} from 'react';
import Controls from './components/Controls';
import Canvas from './components/Canvas';
import Highlighter from './components/Highlighter';
import DropDownMenu from './components/DropDownMenu';
import Matrix from './components/Matrix';
import Point from './classes/Point';
import {getMousePos} from './functions/canvasFunctions';
import {BASE_CONNECTION_COLOR, STAGE_SIZE} from './consts';
import Dijkstra from './functions/Dijkstra';
import {Floyd} from './functions/Floyd';
import {Layout, message} from 'antd';
import Connection from './classes/Connection';
import toConnectionMatrix from './functions/toConnectionMatrix';
import './App.css';

const {Content, Header, Footer} = Layout

const App: FC = () => {

    const [points, setPoints] = useState<Point[]>([])
    const [connections, setConnections] = useState<Connection[]>([])
    const [incMatrix, setIncMatrix] = useState<any[]>([[]])
    const [path, setPath] = useState<number[]>([])
    const [distance, setDistance] = useState<number | undefined>(undefined)
    const [fromPoint, setFromPoint] = useState<string | undefined>(undefined)
    const [toPoint, setToPoint] = useState<string | undefined>(undefined)

    const [menuVisible, setMenuVisible] = useState<boolean>(false)
    const [inputVisible, setInputVisible] = useState<boolean>(false)
    const [menuStyle, setMenuStyle] = useState<object>({})
    const [selectedEntity, setSelectedEntity] = useState<Connection | undefined>(undefined)

    const addPoint = (event: any, stageRef?: { current: any }) => {
        if (event.target === stageRef?.current) {
            event.evt.preventDefault()
            const mousePos = getMousePos(event)
            if (points.length < 10) {
                setPoints([...points, new Point(mousePos.x, mousePos.y, String(new Date().getTime()))])
            } else message.warn('Достигнуто максимальное количество вершин - 10', 1).then()
        } else {
            const x = Math.round(Math.random() * STAGE_SIZE)
            const y = Math.round(Math.random() * STAGE_SIZE)
            setPoints([...points, new Point(x, y, String(new Date().getTime()))])
        }
    }

    const addConnection = (event: any, point: any[] | any, setConnectionPreview?: (p: any) => void, detectConnection?: any) => {
        if (event && point && setConnectionPreview && detectConnection) {
            setConnectionPreview(null)
            const stage = event.target.getStage()
            const mousePos = stage.getPointerPosition()
            const connectionTo = detectConnection(mousePos, point)
            const isExist = connections.some(connection => {
                return (connection.from === point.key && connection.to === connectionTo.key) ||
                    (connection.from === connectionTo.key && connection.to === point.key)
            })
            if (connectionTo && !isExist) {
                setConnections([
                    ...connections,
                    new Connection(point.key, connectionTo.key, 1, BASE_CONNECTION_COLOR, String(new Date().getTime())),
                ])
            }
        } else {
            if (setConnectionPreview instanceof Function) setConnectionPreview(null)
            const from = points.find(p => p.key === point[0])
            const to = points.find(p => p.key === point[1])
            let isExist
            if (from && to) {
                isExist = connections.some((connection: Connection) => {
                    return (connection.from === from.key && connection.to === to.key) ||
                        (connection.from === to.key && connection.to === from.key)
                })
            }
            if (!isExist && from && to) {
                setConnections([
                    ...connections,
                    new Connection(from.key, to.key, 1, BASE_CONNECTION_COLOR, String(new Date().getTime())),
                ])
            } else message.warn('Соединение уже существует', 1).then()
        }
    }

    const computePath = () => {
        let connectionMatrix = toConnectionMatrix(incMatrix)
        connectionMatrix.shift()
        connectionMatrix = connectionMatrix.map(row => {
            row.shift()
            return row
        })
        // console.log(connectionMatrix)
        try {
            let startIndex = 0, finishIndex = 0
            // const nameFrom = fromPoint.substring(fromPoint.length - 2)
            // const nameTo = toPoint.substring(toPoint.length - 2)
            points.forEach((point, index) => {
                if (point.key === fromPoint) startIndex = index
                if (point.key === toPoint) finishIndex = index
            })
            Floyd(connectionMatrix)
            const [distances, paths] = Dijkstra(connectionMatrix, startIndex)
            // message.success(`Расстояние от ${nameFrom} до ${nameTo} = ${distances[finishIndex]}`, 1).then()
            // let path = ''
            if (paths[finishIndex][0] !== undefined) {
                setPath(paths[finishIndex])
                setDistance(distances[finishIndex])
                // for (let i = 0; i < paths[finishIndex].length; i++) {
                //     let key = points[paths[finishIndex][i]].key
                //     path += key.substring(key.length - 2) + ' -> '
                // }
                // path = path.substring(0, path.length - 4)
                // message.success(`Путь от ${nameFrom} до ${nameTo}:  ${path}`, 1).then()
            } else {
                setDistance(Infinity)
                // message.warn('Путь не существует').then()
            }
        } catch (e: any) {
            message.error(e).then()
        }
    }

    const deleteConnection = () => {
        setConnections(connections.filter(connection => {
            if (selectedEntity) return connection.from !== selectedEntity.from || connection.to !== selectedEntity.to
        }))
        setMenuVisible(false)
    }

    const changeWeight = (weight: number | undefined) => {
        setConnections(connections.map(connection => {
            if (selectedEntity && connection.from === selectedEntity.from && connection.to === selectedEntity.to) {
                connection.weight = Number(weight)
            }
            return connection
        }))
        setInputVisible(false)
        setMenuVisible(false)
    }

    return <div className="full-height" style={{display: 'grid', gridTemplateRows: '1fr 750px 1fr'}}>
        <div>1</div>
        <div>
            2
        </div>
        <div>3</div>
        {/*<div className="flex-column-center align-content-space-between">*/}
        {/*    <Highlighter*/}
        {/*        points={points}*/}
        {/*        setPoints={setPoints}*/}
        {/*        connections={connections}*/}
        {/*        setConnections={setConnections}*/}
        {/*        path={path}*/}
        {/*        distance={distance}*/}
        {/*    />*/}
        {/*    <div className="flex-container space-around" style={{marginBottom: '8%'}}>*/}
        {/*        <Matrix*/}
        {/*            points={points}*/}
        {/*            connections={connections}*/}
        {/*            setConnections={setConnections}*/}
        {/*            incMatrix={incMatrix}*/}
        {/*            setIncMatrix={setIncMatrix}*/}
        {/*        />*/}
        {/*        <Canvas*/}
        {/*            points={points}*/}
        {/*            setPoints={setPoints}*/}
        {/*            connections={connections}*/}
        {/*            setConnections={setConnections}*/}
        {/*            addPoint={addPoint}*/}
        {/*            addConnection={addConnection}*/}
        {/*            setMenuStyle={setMenuStyle}*/}
        {/*            setInputVisible={setInputVisible}*/}
        {/*            menuVisible={menuVisible}*/}
        {/*            setMenuVisible={setMenuVisible}*/}
        {/*            selectedEntity={selectedEntity}*/}
        {/*            setSelectedEntity={setSelectedEntity}*/}
        {/*        />*/}
        {/*    </div>*/}
        {/*    <Controls*/}
        {/*        setPoints={setPoints}*/}
        {/*        setConnections={setConnections}*/}
        {/*        incMatrix={incMatrix}*/}
        {/*        setIncMatrix={setIncMatrix}*/}
        {/*        toPoint={toPoint}*/}
        {/*        fromPoint={fromPoint}*/}
        {/*        setFromPoint={setFromPoint}*/}
        {/*        setToPoint={setToPoint}*/}
        {/*        computePath={computePath}*/}
        {/*        addPoint={addPoint}*/}
        {/*        addConnection={addConnection}*/}
        {/*    />*/}
        {/*</div>*/}
        {/*{menuVisible && <DropDownMenu*/}
        {/*    deleteConnection={deleteConnection}*/}
        {/*    changeWeight={changeWeight}*/}
        {/*    menuStyle={menuStyle}*/}
        {/*    inputVisible={inputVisible}*/}
        {/*    setInputVisible={setInputVisible}*/}
        {/*    selectedEntity={selectedEntity}*/}
        {/*/>}*/}
    </div>
}

export default App;