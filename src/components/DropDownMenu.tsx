import React, {FC, useEffect, useState} from 'react';
import {Button, InputNumber, Menu} from 'antd';
import Connection from '../classes/Connection';

interface DropDownMenuProps {
    menuStyle: object
    deleteConnection: () => void
    changeWeight: (weight: number | undefined) => void
    inputVisible: boolean
    setInputVisible: (b: boolean) => void
    selectedEntity: Connection | undefined
}

const DropDownMenu: FC<DropDownMenuProps> = ({
                                                 menuStyle,
                                                 deleteConnection,
                                                 changeWeight,
                                                 inputVisible,
                                                 setInputVisible,
                                                 selectedEntity,
                                             }) => {

    const [weight, setWeight] = useState(selectedEntity?.weight)

    useEffect(() => {
        if (selectedEntity) {
            setWeight(selectedEntity.weight)
        }
    }, [selectedEntity])

    return <Menu style={menuStyle}>
        <Menu.Item key="remove" onClick={deleteConnection}>Удалить</Menu.Item>
        <Menu.Item key="changeWeight" onClick={() => setInputVisible(true)}>
            <div className="flex-container">
                <p style={{marginRight: 8}}>Изменить вес</p>
                {inputVisible && <>
                    <InputNumber
                        value={weight}
                        onChange={value => setWeight(value)}
                        style={{marginTop: 5, height: 30}}
                    />
                    <Button
                        onClick={() => changeWeight(weight)}
                        style={{margin: '5px 10px', height: 30}}
                    >
                        Применить
                    </Button>
                </>}
            </div>
        </Menu.Item>
    </Menu>
}

export default DropDownMenu;