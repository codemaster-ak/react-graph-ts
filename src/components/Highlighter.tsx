import React, {FC, useEffect, useState} from 'react';
import {Button} from 'antd';
import {highlightConnections, highlightPoints} from '../functions/highlight';
import {BASE_CONNECTION_COLOR, BUTTON_WIDTH, HIGHLIGHT_CONNECTION_COLOR, HIGHLIGHT_POINT_COLOR} from '../consts';
import Point from '../classes/Point';
import Connection from '../classes/Connection';
import graphStore from "../stores/GraphStore";

interface HighlighterProps {
    setPoints: any
    setConnections: any
    path: any
    distance: any
    compareResult: any
}

const Highlighter: FC<HighlighterProps> = ({setPoints, setConnections, path, distance, compareResult}) => {

    useEffect(() => {
        // setInformation(distance !== Infinity && distance !== undefined
        //     ? 'Путь - ' + getPathValue() + ' ' + '; Длина - ' + distance
        //     : distance === Infinity && 'Путь не существует',
        // )
    }, [distance])

    useEffect(() => {
        setInformation(compareResult)
    }, [compareResult])


    const [information, setInformation] = useState('')
    const [pathInput, setPathInput] = useState('')
    const [highlightToggle, setHighlightToggle] = useState(false)

    const toggleHighlight = () => {
        if (highlightToggle) {
            setPoints(graphStore.points.map(point => {
                if (point.colour === HIGHLIGHT_POINT_COLOR) return new Point(point.x, point.y, point.key)
                else return point
            }))
            setConnections(graphStore.connections.map(connection => {
                if (connection.colour === HIGHLIGHT_CONNECTION_COLOR) return new Connection(
                    connection.from,
                    connection.to,
                    connection.weight,
                    BASE_CONNECTION_COLOR,
                    connection.key,
                )
                else return connection
            }))
        } else {
            if (path.length > 0) {
                // setSavedGraph({points, connections})
                setPoints(highlightPoints(path, graphStore.points))
                setConnections(highlightConnections(path, graphStore.points, graphStore.connections))
            }
        }
        setHighlightToggle(!highlightToggle)
    }

    const getPathValue = () => {
        let value = ''
        for (let i = 0; i < path.length; i++) {
            let key = graphStore.points[path[i]].key
            value += key.substring(key.length - 2) + ' -> '
        }
        return value.substring(0, value.length - 4)
    }

    return <div className="flex-column ">
        <div className="flex-center margin-bottom-xs">
            <Button
                type="primary"
                onClick={toggleHighlight}
                disabled={path.length === 0 || distance === Infinity}
                style={{width: BUTTON_WIDTH}}
            >
                {highlightToggle ? 'Отключить показ' : 'Показать маршрут'}
            </Button>
        </div>
        <p
            className="no-margin"
            style={{
                marginBottom: distance ? 0 : 14,
                textAlign: 'center',
                width: BUTTON_WIDTH
            }}
        >
            {information}
        </p>
    </div>
}

export default Highlighter;