import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {Button, message, Radio} from 'antd';
import {BUTTON_WIDTH, STAGE_SIZE} from '../consts';
import {observable, runInAction} from 'mobx';
import graphStore from '../stores/GraphStore';
import Point from '../classes/Point';
import Connection from '../classes/Connection';
import {observer} from 'mobx-react-lite';
import fileStore from "../stores/FileStore";
import {MenuItem, Select} from "@mui/material";
import {ComputeMethods} from "../enums";
import Graph from "../classes/Graph";
import Highlighter from "./Highlighter";

interface ControlsProps {
    path: number[]
    setPath: Dispatch<SetStateAction<number[]>>
    distance: number | undefined
    setDistance: Dispatch<SetStateAction<number | undefined>>
}

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
            graphStore.points.forEach((point, index) => {
                if (point.key === fromPointKey) startIndex = index
                if (point.key === toPointKey) finishIndex = index
            })

            const [distance, path] = Graph.computePath(matrix, startIndex, finishIndex, selectedMethod)
            setDistance(distance)
            setPath(path)
        } catch (error: any) {
            message.error(error).then()
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
        <Highlighter distance={distance} path={path} compareResult={''} setConnections={''} setPoints={''}/>
    </div>
})

export default Controls;