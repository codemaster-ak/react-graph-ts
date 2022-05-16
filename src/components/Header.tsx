import React, {Dispatch, FC, SetStateAction, useState} from 'react';
import Controls from './Controls';
import Highlighter from "./Highlighter";
import {Button} from "antd";
import Graph from "../classes/Graph";
import {BUTTON_WIDTH} from "../consts";
import {ComputeMethods} from "../enums";
import ResultTableModal from "./ResultTableModal";

interface HeaderProps {
    path: number[]
    setPath: Dispatch<SetStateAction<number[]>>
    distance: number | undefined
    setDistance: Dispatch<SetStateAction<number | undefined>>
}

const Header: FC<HeaderProps> = ({
                                     path,
                                     setPath,
                                     distance,
                                     setDistance
                                 }) => {

    const [resultModalVisible, setResultModalVisible] = useState<boolean>(false)
    const [pathList, setPathList] = useState<{ key: string }[]>([])
    const [compareResult, setCompareResult] = useState<string>('')

    const showResult = () => {
        setResultModalVisible(true)
        const matrix = Graph.adjacencyMatrixValues()

        const distances = Graph.dijkstra(matrix)
        const paths = Graph.pathsFromMatrix(matrix)
        const fullPaths = Graph.computeFullPaths(paths)

        let tablePaths = []
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

    const compareMethods = () => {
        const matrix = Graph.adjacencyMatrixValues()
        const comparedTime = Graph.compareMethods(matrix)
        setCompareResult(`${ComputeMethods.Dijkstra}: ${comparedTime.dijkstra}; ${ComputeMethods.Floyd}: ${comparedTime.floyd}`)
    }

    return <div className='flex-container'>
        <Controls path={path} setPath={setPath} distance={distance} setDistance={setDistance}/>
        <div className="flex-column margin-bottom-lg">
            <Button
                type="primary"
                onClick={showResult}
                style={{width: BUTTON_WIDTH}}
                className="margin-bottom-xs"
            >
                Вывести таблицу
            </Button>
            <Button
                type="primary"
                onClick={compareMethods}
                style={{width: BUTTON_WIDTH}}
                className="margin-bottom-xs"
            >
                Сравнить методы
            </Button>
        </div>
        <Highlighter distance={distance} path={path} compareResult={compareResult}/>
        <ResultTableModal
            visible={resultModalVisible}
            setVisible={setResultModalVisible}
            pathList={pathList}
        />
    </div>
}

export default Header;