import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {Button, Radio, Select} from "antd";
import graphStore from "../stores/GraphStore";
import BasePathfinder from "../classes/BasePathfinder";
import {ComputeMethods} from "../enums";
import ResultTableModal from "./ResultTableModal";
import fileStore from "../stores/FileStore";
import {observer} from "mobx-react-lite";
import CanvasHandler from "../classes/CanvasHandler";
import PointSelect from "./PointSelect";
import stackStore from "../stores/StackStore";

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
        const x = Math.round(Math.random() * CanvasHandler.STAGE_SIZE)
        const y = Math.round(Math.random() * CanvasHandler.STAGE_SIZE)
        stackStore.addPoint(x, y)
    }

    const addConnection = () => {
        if (fromPointKey && toPointKey) {
            const from = graphStore.findPointByKey(fromPointKey)
            const to = graphStore.findPointByKey(toPointKey)
            if (from && to) stackStore.addConnection(from, to)
        }
    }

    const showResult = () => {
        const ptf = new BasePathfinder()
        const matrix = ptf.adjacencyMatrixValues

        const distances = ptf.dijkstra(matrix)
        const paths = ptf.pathsFromMatrix(matrix)

        const fullPaths = ptf.computeFullPaths(paths)

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
        setResultModalVisible(true)
        setPathList(tablePaths)
    }

    const download = () => {
        fileStore.getFileByName(selectedFile).then(() => {
            graphStore.parseFromStack(JSON.parse(JSON.stringify(stackStore.stack)))
        })
    }

    const createFile = () => {
        // graphStore.removeConnectionsFromPoints()
        fileStore.save().then()
    }

    const updateFile = () => {
        // graphStore.removeConnectionsFromPoints()
        fileStore.update(graphStore.incidenceMatrix, selectedFile).then()
    }

    const deleteFile = () => {
        fileStore.remove(selectedFile).then(() => {
            setSelectedFile('')
        })
    }

    const compareMethods = () => {
        const ptf = new BasePathfinder()
        const matrix = ptf.adjacencyMatrixValues
        const comparedTime = ptf.compareMethods(matrix)
        setCompareResult(`${ComputeMethods.Dijkstra}: ${comparedTime.dijkstra}; ${ComputeMethods.Floyd}: ${comparedTime.floyd}`)
    }

    const clear = () => {
        graphStore.clearAll()
    }

    return <div className='flex-center padding-md'>
        <div className="flex-column">
            <div>
                <PointSelect value={fromPointKey} onChange={setFromPointKey}/>
                <PointSelect value={toPointKey} onChange={setToPointKey}/>
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
                        onClick={showResult}
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
                        style={{textAlign: "center"}}
                    >
                        Дейкстра
                    </Radio.Button>
                    <Radio.Button
                        value={ComputeMethods.Floyd}
                        style={{textAlign: "center"}}
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