import React, {FC, useEffect, useState} from 'react';
import {Button, message, Radio} from 'antd';
import {BUTTON_WIDTH, STAGE_SIZE} from '../consts';
import {getAllFileNames, getFileById, remove, save} from '../functions/http';
import {observable, runInAction} from 'mobx';
import graphStore from '../stores/GraphStore';
import Point from '../classes/Point';
import Connection from '../classes/Connection';
import {observer} from 'mobx-react-lite';
import fileStore from "../stores/FileStore";
import {MenuItem, Select} from "@mui/material";
import {ComputeMethods} from "../enums";

const Controls: FC = observer(() => {

    const [fromPointKey, setFromPointKey] = useState<string>('')
    const [toPointKey, setToPointKey] = useState<string>('')

    const [selectedFile, setSelectedFile] = useState<string>('')
    const [selectedMethod, setSelectedMethod] = useState<ComputeMethods>(ComputeMethods.Dijkstra)

    useEffect(() => {
        fileStore.getAllFileNames().then()
    }, [])

    const addPoint = () => {
        const x = Math.round(Math.random() * STAGE_SIZE)
        const y = Math.round(Math.random() * STAGE_SIZE)
        try {
            graphStore.addPoint(x, y)
        } catch (error: any) {
            message.warn(error.message, 1).then()
        }
    }

    const addConnection = () => {
        if (fromPointKey && toPointKey) {
            const from = graphStore.getPointByKey(fromPointKey)
            const to = graphStore.getPointByKey(toPointKey)
            if (from && to) graphStore.addConnection(from, to)
        }
    }

    const download = () => {
        fileStore.getFileByName(selectedFile).then(data => {
            if (Array.isArray(data)) {
                parsePointsAndConnections(data)
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
        remove(selectedFile).then(() => {
            // setFiles([...files.filter((file) => file.name !== selectedFile)])
            setSelectedFile('')
        })
    }

    const parsePointsAndConnections = (matrix: any[][]) => {
        const points: Point[] = []
        for (let i = 0; i < matrix.length; i++) {
            if (i === 0) {
                const connections: Connection[] = []
                for (let j = 0; j < matrix[i].length; j++) {
                    if (j > 0) {
                        const newConnection = new Connection(
                            matrix[i][j].from,
                            matrix[i][j].to,
                            matrix[i][j].weight,
                            matrix[i][j].colour,
                            matrix[i][j].key
                        )
                        connections.push(newConnection)
                    }
                }
                runInAction(() => graphStore.connections = observable.array<Connection>(connections))
            } else {
                const newPoint = new Point(
                    matrix[i][0].x,
                    matrix[i][0].y,
                    matrix[i][0].key,
                    matrix[i][0].colour
                )
                points.push(newPoint)
            }
        }
        runInAction(() => graphStore.points = observable.array<Point>(points))
    }

    const computePath = () => {
        console.log(graphStore.adjacencyMatrix);
        // connectionMatrix = getMatrixValues(connectionMatrix)
        //
        // try {
        //     let startIndex = 0, finishIndex = 0
        //     points.forEach((point, index) => {
        //         if (point.key === fromPoint) startIndex = index
        //         if (point.key === toPoint) finishIndex = index
        //     })
        //
        //     const [distance, path] = Graph.computePath(connectionMatrix, startIndex, finishIndex, selectedMethod)
        //     setDistance(distance)
        //     setPath(path)
        // } catch (e) {
        //     message.error(e).then()
        // }
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
                    onChange={event => setFromPointKey(event.target.value)}
                    style={{width: 150}}
                >
                    {graphStore.points.map(point => {
                        return <MenuItem value={point.key} key={point.key}>
                            {point.getPointName()}
                        </MenuItem>
                    })}
                </Select>
                <Select
                    value={toPointKey}
                    onChange={event => setToPointKey(event.target.value)}
                    style={{width: 150}}
                >
                    {graphStore.points.map(point => {
                        return <MenuItem value={point.key} key={point.key}>
                            {point.getPointName()}
                        </MenuItem>
                    })}
                </Select>
            </div>
            <div className="flex-container">
                <Button
                    type="primary"
                    onClick={computePath}
                    disabled={!fromPointKey || !toPointKey || fromPointKey === toPointKey}
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
                onChange={event => setSelectedFile(event.target.value)}
            >
                {fileStore.files.map(file => {
                    return <MenuItem key={file.name} value={file.name}>
                        {file.name}
                    </MenuItem>
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