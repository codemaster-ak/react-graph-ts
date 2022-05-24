import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {Button, Radio, Select} from "antd";
import graphStore from "../stores/GraphStore";
import {BUTTON_WIDTH, STAGE_SIZE} from "../consts";
import Graph from "../classes/Graph";
import {ComputeMethods} from "../enums";
import ResultTableModal from "./ResultTableModal";
import fileStore from "../stores/FileStore";
import {observer} from "mobx-react-lite";

const {Option} = Select

interface FooterProps {
    fromPointKey: string
    setFromPointKey: Dispatch<SetStateAction<string>>
    toPointKey: string
    setToPointKey: Dispatch<SetStateAction<string>>
    setCompareResult: Dispatch<SetStateAction<string>>
    throughPoints: string[]
    selectedMethod: ComputeMethods
    setThroughPoints: Dispatch<SetStateAction<string[]>>
    setSelectedMethod: Dispatch<SetStateAction<ComputeMethods>>
}

const Footer: FC<FooterProps> = observer(({
                                              fromPointKey,
                                              toPointKey,
                                              setFromPointKey,
                                              setToPointKey,
                                              setCompareResult,
                                              throughPoints,
                                              selectedMethod,
                                              setThroughPoints,
                                              setSelectedMethod,
                                          }) => {

    useEffect(() => {
        fileStore.getAllFileNames().then()
    }, [])

    const [resultModalVisible, setResultModalVisible] = useState<boolean>(false)
    const [pathList, setPathList] = useState<{ key: string }[]>([])
    const [selectedFile, setSelectedFile] = useState<string>('')

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

    const showResult = () => {
        setResultModalVisible(true)
        const matrix = Graph.adjacencyMatrixValues()

        const distances = Graph.dijkstra(matrix)
        const paths = Graph.pathsFromMatrix(matrix)

        const fullPaths = Graph.computeFullPaths(paths)

        const tablePaths = []
        for (let i = 0; i < fullPaths.length; i++) {
            for (let j = 0; j < fullPaths[i].length; j++) {
                if (fullPaths[i][j].length > 1) {
                    let path = ''
                    for (let k = 0; k < fullPaths[i][j].length; k++) {
                        path += fullPaths[i][j][k] + '->'
                    }
                    path = path.substring(0, path.length - 2)
                    tablePaths.push({
                        key: String(Math.random()),
                        from: fullPaths[i][j][0],
                        to: fullPaths[i][j].at(-1),
                        path: path,
                        distance: distances[i][j],
                    })
                }
            }
        }
        setPathList(tablePaths)
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

    const updateFile = () => {
        fileStore.update(graphStore.incidenceMatrix, selectedFile).then()
    }

    const deleteFile = () => {
        fileStore.remove(selectedFile).then(() => {
            setSelectedFile('')
        })
    }

    const compareMethods = () => {
        const matrix = Graph.adjacencyMatrixValues()
        const comparedTime = Graph.compareMethods(matrix)
        setCompareResult(`${ComputeMethods.Dijkstra}: ${comparedTime.dijkstra}; ${ComputeMethods.Floyd}: ${comparedTime.floyd}`)
    }

    const clear = () => {
        graphStore.clearAll()
    }

    return <div className='flex-center padding-md'>
        <div className="flex-column">
            <div>
                <Select
                    value={fromPointKey}
                    onChange={value => setFromPointKey(value)}
                    style={{width: 100}}
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
                    style={{width: 100}}
                >
                    {graphStore.points.map(point => {
                        return <Option value={point.key} key={point.key}>
                            {point.getName()}
                        </Option>
                    })}
                </Select>
            </div>
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
            >
                Добавить связь
            </Button>
        </div>
        <div className="flex-column">
            <Select
                className='full-width'
                value={throughPoints}
                onChange={value => setThroughPoints(value)}
                mode='multiple'
                allowClear
            >
                {graphStore.points.map(point => {
                    return <Option value={point.key} key={point.key}>
                        {point.getName()}
                    </Option>
                })}
            </Select>
            <div className='flex-container'>
                <div className='flex-column'>
                    <Button
                        type="primary"
                        onClick={() => {
                            showResult()
                            // Graph.allPath(fromPointKey, toPointKey)
                        }}
                    >
                        Вывести таблицу
                    </Button>
                    <Button
                        type="primary"
                        onClick={compareMethods}
                    >
                        Сравнить методы
                    </Button>
                </div>
                <Radio.Group
                    className="flex-column item"
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
                <div className='flex-column'>
                    <Button
                        type="primary"
                        onClick={selectedFile ? updateFile : createFile}
                        style={{width: 150}}
                    >
                        Сохранить
                    </Button>
                    <Button
                        type="primary"
                        onClick={clear}
                        style={{width: 150}}
                    >
                        Очистить
                    </Button>
                </div>
            </div>
        </div>
        <div className='flex-column'>
            <Select
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
            <Button
                type="primary"
                onClick={download}
                style={{width: 150}}
            >
                Загрузить
            </Button>
            <Button
                type="primary"
                onClick={deleteFile}
                style={{width: 150}}
                disabled={!selectedFile}
            >
                Удалить
            </Button>
        </div>
        <ResultTableModal
            visible={resultModalVisible}
            setVisible={setResultModalVisible}
            pathList={pathList}
        />
    </div>
})

export default Footer;