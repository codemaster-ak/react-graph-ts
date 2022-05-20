import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {Button, message, Radio, Select} from 'antd';
import {BUTTON_WIDTH, STAGE_SIZE} from '../consts';
import {observable, runInAction} from 'mobx';
import graphStore from '../stores/GraphStore';
import Point from '../classes/Point';
import Connection from '../classes/Connection';
import {observer} from 'mobx-react-lite';
import fileStore from "../stores/FileStore";
import {ComputeMethods} from "../enums";
import Graph from "../classes/Graph";
import Painter from "../classes/Painter";

interface ControlsProps {
    path: number[]
    setPath: Dispatch<SetStateAction<number[]>>
    distance: number | undefined
    setDistance: Dispatch<SetStateAction<number | undefined>>
}

const {Option} = Select

const Controls: FC<ControlsProps> = observer(({
                                                  path,
                                                  setPath,
                                                  distance,
                                                  setDistance
                                              }) => {

    const [fromPointKey, setFromPointKey] = useState<string>('')
    const [toPointKey, setToPointKey] = useState<string>('')

    const [selectedFile, setSelectedFile] = useState<string>('')
    const [selectedMethod, setSelectedMethod] = useState<ComputeMethods>(ComputeMethods.Dijkstra)

    const [throughPoints, setThroughPoints] = useState<string[]>([])

    useEffect(() => {
        fileStore.getAllFileNames().then()
    }, [])

    const addPoint = () => {
        const x = Math.round(Math.random() * STAGE_SIZE)
        const y = Math.round(Math.random() * STAGE_SIZE)
        graphStore.addPoint(x, y)
    }

    const addConnection = () => {
        if (fromPointKey && toPointKey) {
            const from = graphStore.findPointByKey(fromPointKey)
            const to = graphStore.findPointByKey(toPointKey)
            if (from && to) graphStore.addConnection(from, to)
        }
    }

    const download = () => {
        fileStore.getFileByName(selectedFile).then(data => {
            if (Array.isArray(data)) {
                graphStore.parseFromIncidenceMatrix(data)
            }
        })
    }

    const createFile = () => {
        fileStore.save(graphStore.incidenceMatrix).then()
    }

    const updateFile = async () => {
        fileStore.update(graphStore.incidenceMatrix, selectedFile).then()
    }

    const deleteFile = () => {
        fileStore.remove(selectedFile).then(() => {
            setSelectedFile('')
        })
    }

    const computePath = () => {
        const matrix = Graph.adjacencyMatrixValues()
        try {
            let startIndex = 0, finishIndex = 0
            for (let i = 0; i < graphStore.points.length; i++) {
                if (graphStore.findPointByKey(fromPointKey)) startIndex = i
                if (graphStore.findPointByKey(toPointKey)) finishIndex = i
            }

            const [distance, path] = Graph.computePath(matrix, startIndex, finishIndex, selectedMethod)
            setDistance(distance)
            setPath(path)
        } catch (error: any) {
            message.error(error).then()
        }
    }
    const computePathThroughPoints = () => {
        let throughPointsPaths = Graph.throughPoints(fromPointKey, toPointKey, ...throughPoints)
        for (let i = 0; i < throughPointsPaths.length; i++) {
            if (throughPointsPaths[i][0] === fromPointKey && throughPointsPaths[i].at(-1) === toPointKey) {
                message.success(throughPointsPaths[i].join('->')).then()
            }
        }
    }

    const clear = () => {
        runInAction(() => {
            graphStore.points = observable.array<Point>([])
            graphStore.connections = observable.array<Connection>([])
        })
    }

    return <div className="controls">
        <div className="flex-column margin-right-lg">
            <div className="space-between">
                <Select
                    value={fromPointKey}
                    onChange={value => setFromPointKey(value)}
                    style={{width: 150}}
                >
                    {graphStore.points.map(point => {
                        return <Option value={point.key} key={point.key}>
                            {point.getName()}
                        </Option>
                    })}
                </Select>
                <Select
                    value={toPointKey}
                    onChange={value => setToPointKey(value)}
                    style={{width: 150}}
                >
                    {graphStore.points.map(point => {
                        return <Option value={point.key} key={point.key}>
                            {point.getName()}
                        </Option>
                    })}
                </Select>
            </div>
            <div className="flex-container">
                <Button
                    type="primary"
                    onClick={computePath}
                    disabled={!!fromPointKey || !!toPointKey}
                    style={{marginTop: 10, marginRight: 10}}
                >
                    Найти кратчайший путь
                </Button>
                <Button
                    type="primary"
                    onClick={clear}
                    style={{marginTop: 10, width: BUTTON_WIDTH / 2 - 5}}
                >
                    Очистить
                </Button>
            </div>
        </div>
        <div className="flex-column margin-right-lg">
            <Button
                type="primary"
                onClick={addPoint}
                disabled={graphStore.points.length > 9}
            >
                Добавить вершину
            </Button>
            <Button
                type="primary"
                onClick={addConnection}
                disabled={!fromPointKey || !toPointKey || fromPointKey === toPointKey}
                style={{marginTop: 10}}
            >
                Добавить связь
            </Button>
        </div>
        <div className="flex-column" style={{width: BUTTON_WIDTH}}>
            <Select
                style={{width: BUTTON_WIDTH, marginBottom: 10}}
                value={selectedFile}
                onChange={value => setSelectedFile(value)}
                allowClear
            >
                {fileStore.files.map(file => {
                    return <Option key={file.name} value={file.name}>
                        {file.name}
                    </Option>
                })}
            </Select>
            <div className="space-between">
                <Button
                    type="primary"
                    onClick={download}
                    style={{width: 100}}
                >
                    Загрузить
                </Button>
                <Button
                    type="primary"
                    onClick={selectedFile ? updateFile : createFile}
                    style={{width: 100}}
                >
                    Сохранить
                </Button>
                <Button
                    type="primary"
                    onClick={deleteFile}
                    style={{width: 100}}
                    disabled={!selectedFile}
                >
                    Удалить
                </Button>
                <Button
                    type="primary"
                    onClick={() => Painter.animatePath(path)}
                >
                    Animate path
                </Button>
                <Button
                    type="primary"
                    onClick={computePathThroughPoints}
                >
                    path through points
                </Button>
                <Select
                    value={throughPoints}
                    onChange={value => setThroughPoints(value)}
                    style={{width: 150}}
                    mode='multiple'
                    allowClear
                >
                    {graphStore.points.map(point => {
                        return <Option value={point.key} key={point.key}>
                            {point.getName()}
                        </Option>
                    })}
                </Select>
            </div>
        </div>
        <Radio.Group
            className="item space-between"
            buttonStyle="solid"
            value={selectedMethod}
            onChange={event => setSelectedMethod(event.target.value)}
        >
            <Radio.Button
                value={ComputeMethods.Dijkstra}
                style={{width: BUTTON_WIDTH / 2 - 2, textAlign: "center"}}
            >
                Дейкстра
            </Radio.Button>
            <Radio.Button
                value={ComputeMethods.Floyd}
                style={{width: BUTTON_WIDTH / 2 - 2, textAlign: "center"}}
            >
                Флойд
            </Radio.Button>
        </Radio.Group>
    </div>
})

export default Controls;