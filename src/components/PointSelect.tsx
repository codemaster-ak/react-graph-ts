import React, {Dispatch, FC, SetStateAction} from 'react';
import graphStore from "../stores/GraphStore";
import {Select} from "antd";

const {Option} = Select

interface PointSelectProps {
    value: string
    onChange: Dispatch<SetStateAction<string>>
}

const PointSelect: FC<PointSelectProps> = ({value, onChange}) => {

    return <Select
        value={value}
        onChange={onChange}
        style={{width: 100}}
    >
        {graphStore.points.map(point => {
            return <Option value={point.key} key={point.key}>
                {point.getName()}
            </Option>
        })}
    </Select>
}

export default PointSelect;