import React, {FC, Fragment, useEffect} from 'react';
import {Line} from 'react-konva';
import {createConnectionPoints} from '../functions/canvasFunctions';
import Konva from 'konva';

interface ConnectionPreviewProps {
    line: any
}

const ConnectionPreview: FC<ConnectionPreviewProps> = ({line}) => {

    return line
}

export default ConnectionPreview;