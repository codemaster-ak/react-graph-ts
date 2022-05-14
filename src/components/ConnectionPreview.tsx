import {FC, ReactElement, ReactNode} from 'react';

interface ConnectionPreviewProps {
    line: ReactElement<ReactNode> | null
}

const ConnectionPreview: FC<ConnectionPreviewProps> = ({line}) => {

    return line
}

export default ConnectionPreview;