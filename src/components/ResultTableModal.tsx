import React, {Dispatch, FC, SetStateAction} from 'react';
import {Modal, Table} from 'antd';

interface ResultTableModalProps {
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
    pathList: { key:string }[]
}

const ResultTableModal: FC<ResultTableModalProps> = ({visible, setVisible, pathList}) => {

    const columns = [
        {
            title: 'Старт',
            dataIndex: 'from',
        }, {
            title: 'Финиш',
            dataIndex: 'to',
        }, {
            title: 'Путь',
            dataIndex: 'path',
        }, {
            title: 'Длина пути',
            dataIndex: 'distance',
        },
    ]

    return <Modal
        width='65%'
        title="Таблица результатов"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
    >
        <Table
            columns={columns}
            dataSource={pathList}
            rowKey={path => path.key}
        />
    </Modal>
}

export default ResultTableModal;