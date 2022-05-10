import React, {FC, useState} from 'react';
import {Button} from 'antd';
import {highlightConnections, highlightPoints} from '../functions/highlight';
import {BASE_CONNECTION_COLOR, HIGHLIGHT_CONNECTION_COLOR, HIGHLIGHT_POINT_COLOR} from '../consts';
import Point from '../classes/Point';
import Connection from '../classes/Connection';

interface HighlighterProps {
    points: Point[]
    setPoints: (c: Point[]) => void
    connections: Connection[]
    setConnections: (c: Connection[]) => void
    path: number[]
    distance: number | undefined
}

const Highlighter: FC<HighlighterProps> = ({points, setPoints, connections, setConnections, path, distance}) => {

    const [highlightToggle, setHighlightToggle] = useState(false)

    const toggleHighlight = () => {
        if (highlightToggle) {
            setPoints(points.map((point: Point) => {
                if (point.colour === HIGHLIGHT_POINT_COLOR) return new Point(point.x, point.y, point.key)
                else return point
            }))
            setConnections(connections.map((connection: Connection) => {
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
                setPoints(highlightPoints(path, points))
                setConnections(highlightConnections(path, points, connections))
            }
        }
        setHighlightToggle(!highlightToggle)
    }

    const getPathValue = () => {
        let value = ''
        for (let i = 0; i < path.length; i++) {
            let key = points[path[i]].key
            value += key.substring(key.length - 2) + ' -> '
        }
        return value.substring(0, value.length - 4)
    }

    return <div className="highlighter" style={{marginBottom: '5%'}}>
        <div className="flex-column">
            <div className="flex-center">
                <Button
                    type="primary"
                    onClick={toggleHighlight}
                    disabled={path.length === 0 || distance === Infinity}
                    style={{width: 150}}
                >
                    {highlightToggle ? 'Отключить показ' : 'Показать маршрут'}
                </Button>
            </div>
            <p
                className="no-margin"
                style={{
                    marginTop: 10,
                    marginBottom: distance ? 0 : 14,
                    textAlign: 'center',
                }}
            >
                {distance !== Infinity && distance !== undefined
                    ? 'Путь - ' + getPathValue() + ' ' + '; Длина - ' + distance
                    : distance === Infinity && 'Путь не существует'
                }
            </p>
        </div>
    </div>
}

export default Highlighter;