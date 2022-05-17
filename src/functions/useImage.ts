import {useLayoutEffect, useRef, useState} from 'react';

enum LoadingStatus {
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

export default function useImage(url: string, resizeCoefficient = 15) {

    const [status, setStatus] = useState<LoadingStatus>(LoadingStatus.LOADING)
    const imageElement = useRef<HTMLImageElement | undefined>(new Image())

    useLayoutEffect(() => {
        if (!url) return
        const img = document.createElement('img')
        img.src = url

        img.width = img.naturalWidth / resizeCoefficient
        img.height = img.naturalHeight / resizeCoefficient

        img.addEventListener('load', onload)
        img.addEventListener('error', onError)

        function onload() {
            imageElement.current = img
            setStatus(LoadingStatus.SUCCESS)
        }

        function onError() {
            imageElement.current = undefined
            setStatus(LoadingStatus.ERROR)
        }

        return () => {
            img.removeEventListener('load', onload)
            img.removeEventListener('error', onError)
        }
    }, [url, resizeCoefficient, status])

    return imageElement.current
}