import {BASE_INIT, BASE_URL} from '../consts';
import {HTTPMethods} from "../enums";

export async function getFileById(file: string | null) {
    const init = {
        ...BASE_INIT,
        method: HTTPMethods.GET,
    }
    return await fetch(BASE_URL + '/' + file, init).then((response) => {
        if (response.ok) return response.json()
    }).then((data) => {
        return data
    })
}

export async function getAllFileNames() {
    const init = {
        ...BASE_INIT,
        method: HTTPMethods.GET,
    }
    return await fetch(BASE_URL, init).then((response) => {
        if (response.ok) return response.json()
    }).then((data) => {
        return data
    })
}

export async function save(payload: any) {
    const init = {
        ...BASE_INIT,
        method: HTTPMethods.POST,
        body: JSON.stringify(payload),
    }
    return await fetch(BASE_URL, init).then((response) => {
        if (response.ok) return response.json()
    }).then((data) => {
        return data
    })
}

export async function update(payload: any) {
    const init = {
        ...BASE_INIT,
        method: HTTPMethods.PUT,
        body: JSON.stringify(payload),
    }
    return await fetch(BASE_URL, init).then((response) => {
        if (response.ok) return response.json()
    }).then((data) => {
        return data
    })
}

export async function remove(file: string | null) {
    const init = {
        ...BASE_INIT,
        method: HTTPMethods.DELETE,
    }
    return await fetch(BASE_URL + '/' + file, init)
}

export async function options() {
    const init = {
        ...BASE_INIT,
        method: HTTPMethods.OPTIONS,
    }
    return await fetch(BASE_URL + '/', init)
}