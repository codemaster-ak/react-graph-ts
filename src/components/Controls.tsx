import React, {FC, useEffect, useState} from 'react';
import {message, Select} from 'antd';
import {BUTTON_WIDTH, STAGE_SIZE} from '../consts';
import {getAllFileNames, getFileById, remove, save} from '../functions/http';
import {observable, runInAction} from 'mobx';
import graphStore from '../stores/GraphStore';
import Point from '../classes/Point';
import Connection from '../classes/Connection';
import {observer} from 'mobx-react-lite';
import fileStore from "../stores/FileStore";

const {Option} = Select

interface ControlsProps {
    computePath: () => void
}

const Controls: FC<ControlsProps> = observer(({computePath}) => {

    const [fromPointKey, setFromPointKey] = useState<string | undefined>(undefined)
    const [toPointKey, setToPointKey] = useState<string | undefined>(undefined)

    const [files, setFiles] = useState<{ name: string }[]>([])
    const [selectedFile, setSelectedFile] = useState<string | null>(null)

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


    const loadFiles = () => {
        getAllFileNames().then(data => {
            if (Array.isArray(data)) {
                setFiles([...data])
            }
        })
    }

    const download = () => {
        getFileById(selectedFile).then(data => {
            if (Array.isArray(data)) {
                // setIncMatrix([...data])
                parsePointsAndConnections(data)
            }
        })
    }

    const createFile = () => {
        save(graphStore.incidenceMatrix).then(res => {
            if (!files.some(file => file.name === res.name)) {
                setFiles([...files, {name: res.name}])
            }
        })
    }

    const updateFile = async () => {
        // await update({matrix: incMatrix, fileName: selectedFile})
    }

    const deleteFile = () => {
        remove(selectedFile).then(() => {
            setFiles([...files.filter((file) => file.name !== selectedFile)])
            setSelectedFile(null)
        })
    }

    const parsePointsAndConnections = (matrix: any[]) => {
        matrix[0].shift()
        let pointsTemp = []
        for (let i = 0; i < matrix.length; i++) {
            if (i > 0) {
                delete matrix[i][0].name
                pointsTemp.push(matrix[i][0])
            }
        }
        runInAction(() => {
            graphStore.points = observable.array<Point>([])
            graphStore.connections = observable.array<Connection>([])
        })
        // setPoints([])
        // setConnections([])
    }

    const clear = () => {
        runInAction(() => {
            graphStore.points = observable.array<Point>([])
            graphStore.connections = observable.array<Connection>([])
        })
        // setConnections([])
        // setPoints([])
    }
    console.log(fileStore.files)
    return <div className="controls">
        {/*<div className="flex-column margin-right-lg">*/}
        {/*    <div className="space-between">*/}
        {/*        <Select*/}
        {/*            placeholder="От"*/}
        {/*            value={fromPointKey}*/}
        {/*            onChange={value => setFromPointKey(value)}*/}
        {/*            style={{width: 150}}*/}
        {/*        >*/}
        {/*            {graphStore.points.map(point => {*/}
        {/*                return <Option value={point.key} key={point.key}>*/}
        {/*                    {point.getPointName()}*/}
        {/*                </Option>*/}
        {/*            })}*/}
        {/*        </Select>*/}
        {/*        <Select*/}
        {/*            placeholder="До"*/}
        {/*            value={toPointKey}*/}
        {/*            onChange={value => setToPointKey(value)}*/}
        {/*            style={{width: 150}}*/}
        {/*        >*/}
        {/*            {graphStore.points.map(point => {*/}
        {/*                return <Option value={point.key} key={point.key}>*/}
        {/*                    {point.getPointName()}*/}
        {/*                </Option>*/}
        {/*            })}*/}
        {/*        </Select>*/}
        {/*    </div>*/}
        {/*    <div className="flex-container">*/}
        {/*        <Button*/}
        {/*            type="primary"*/}
        {/*            onClick={computePath}*/}
        {/*            disabled={!fromPointKey || !toPointKey || fromPointKey === toPointKey}*/}
        {/*            style={{marginTop: 10, marginRight: 10}}*/}
        {/*        >*/}
        {/*            Найти кратчайший путь*/}
        {/*        </Button>*/}
        {/*        <Button*/}
        {/*            type="primary"*/}
        {/*            onClick={clear}*/}
        {/*            style={{marginTop: 10, width: BUTTON_WIDTH / 2 - 5}}*/}
        {/*        >*/}
        {/*            Очистить*/}
        {/*        </Button>*/}
        {/*    </div>*/}
        {/*</div>*/}
        {/*<div className="flex-column margin-right-lg">*/}
        {/*    <Button*/}
        {/*        type="primary"*/}
        {/*        onClick={addPoint}*/}
        {/*        disabled={graphStore.points.length > 9}*/}
        {/*    >*/}
        {/*        Добавить вершину*/}
        {/*    </Button>*/}
        {/*    <Button*/}
        {/*        type="primary"*/}
        {/*        onClick={addConnection}*/}
        {/*        disabled={!fromPointKey || !toPointKey || fromPointKey === toPointKey}*/}
        {/*        style={{marginTop: 10}}*/}
        {/*    >*/}
        {/*        Добавить связь*/}
        {/*    </Button>*/}
        {/*</div>*/}
        {/*<div className="flex-column" style={{width: BUTTON_WIDTH}}>*/}
            <Select
                placeholder="Выберите матрицу"
                style={{width: BUTTON_WIDTH, marginBottom: 10}}
                value={selectedFile}
                allowClear
            >
                {fileStore.files.map(file => {
                    return <Option key={file.name} value={file.name}>
                        {file.name}
                    </Option>
                })}
            </Select>
            {/*<div className="space-between">*/}
            {/*    <Button*/}
            {/*        type="primary"*/}
            {/*        onClick={download}*/}
            {/*        style={{width: 100}}*/}
            {/*    >*/}
            {/*        Загрузить*/}
            {/*    </Button>*/}
            {/*    <Button*/}
            {/*        type="primary"*/}
            {/*        onClick={selectedFile ? updateFile : createFile}*/}
            {/*        style={{width: 100}}*/}
            {/*    >*/}
            {/*        Сохранить*/}
            {/*    </Button>*/}
            {/*    <Button*/}
            {/*        type="primary"*/}
            {/*        onClick={deleteFile}*/}
            {/*        style={{width: 100}}*/}
            {/*        disabled={!selectedFile}*/}
            {/*    >*/}
            {/*        Удалить*/}
            {/*    </Button>*/}
            {/*</div>*/}
        {/*</div>*/}
    </div>
})

export default Controls;