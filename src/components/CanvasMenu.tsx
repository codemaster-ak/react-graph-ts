import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {Button, InputNumber, Menu} from 'antd';
import graphStore from '../stores/GraphStore';
import {observer} from 'mobx-react-lite';

interface DropDownMenuProps {
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
    canvasMenuStyle?: object
}

const CanvasMenu: FC<DropDownMenuProps> = observer(({visible, setVisible, canvasMenuStyle}) => {

    const [weight, setWeight] = useState<number>(1)
    const [inputVisible, setInputVisible] = useState<boolean>(false)

    // const onChangeHandler = (value: number): void => {
    //     if (value > 0) setWeight(value)
    // }

    // const changeWeight = (key: string | undefined, newWeight: number | undefined) => {
    //     if (key && weight) graphStore.changeConnectionWeight(key, Number(newWeight))
    //     setVisible(false)
    // }

    // const deleteConnection = () => {
    //     if (graphStore.selectedConnection) graphStore.deleteConnection(graphStore.selectedConnection.key)
    //     setVisible(false)
    // }

    // useEffect(() => {
    //     if (graphStore.selectedConnection) {
    //         setWeight(graphStore.selectedConnection.weight)
    //     }
    // }, [visible])

    // const menuItems = [
    //     {
    //         key: "Remove",
    //         label: 'Удалить',
    //         onClick: deleteConnection
    //     }, {
    //         key: "ChangeWeight",
    //         label: <div className="flex-container">
    //             <p style={{marginRight: 8}}>Изменить вес</p>
    //             {inputVisible && <div className="flex-container">
    //                 <InputNumber
    //                     value={weight}
    //                     onChange={onChangeHandler}
    //                     style={{marginTop: 5, height: 30}}
    //                 />
    //                 <Button
    //                     onClick={() => changeWeight(graphStore.selectedConnection?.key, weight)}
    //                     style={{margin: '5px 10px', height: 30}}
    //                 >
    //                     Применить
    //                 </Button>
    //             </div>}
    //         </div>,
    //         onClick: () => setInputVisible(true)
    //     },
    // ]
return <></>
    // return visible && graphStore.selectedConnection
    //     ? <Menu items={menuItems} className="canvas-menu" style={canvasMenuStyle}/>
    //     : null
})

export default CanvasMenu;