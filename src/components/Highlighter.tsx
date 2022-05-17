import React, {FC, useEffect, useState} from 'react';
import {Button} from 'antd';
import {BUTTON_WIDTH} from '../consts';
import graphStore from "../stores/GraphStore";
import {ConnectionColours, PointColours} from "../enums";
import Painter from "../classes/Painter";

interface HighlighterProps {
    path: any
    distance: any
    compareResult: any
}

const Highlighter: FC<HighlighterProps> = ({path, distance, compareResult}) => {

    useEffect(() => {
        if (distance !== Infinity && distance !== undefined) {
            setInformation(`Путь - ${getPathValue(path)} ; Длина - ${distance}`)
        } else {
            if (distance === Infinity) setInformation('Путь не существует')
        }
    }, [distance, path])

    useEffect(() => {
        setInformation(compareResult)
    }, [compareResult])

    const [information, setInformation] = useState('')
    const [highlighting, setHighlighting] = useState<boolean>(false)

    const toggleHighlight = () => {
        if (highlighting) {
            graphStore.changePointsColour(Painter.getPointsToStopHighlight(), PointColours.BASE)
            graphStore.changeConnectionsColour(Painter.getConnectionsToStopHighlight(), ConnectionColours.BASE)
        } else {
            if (path.length > 0) {
                graphStore.changePointsColour(Painter.getPointsToHighlight(path), PointColours.HIGHLIGHTED)
                graphStore.changeConnectionsColour(
                    Painter.getConnectionsToHighlight(path), ConnectionColours.HIGHLIGHTED
                )
            }
        }
        setHighlighting(!highlighting)
    }

    const getPathValue = (path: any[]) => {
        let value = ''
        for (let i = 0; i < path.length; i++) {
            let point = graphStore.points[path[i]]
            value += point.getName() + ' -> '
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
                {highlighting ? 'Отключить показ' : 'Показать маршрут'}
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