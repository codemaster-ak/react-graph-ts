import {HTTPMethods} from "../enums";

export default class HTTP {
    readonly BASE_URL: string = 'http://127.0.0.1:4000'
    readonly BASE_INIT: object = {
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            protocol: 'http',
            'Content-Type': 'application/json',
        },
    }

    async getFileById(file: string | null) {
        const init = {
            ...this.BASE_INIT,
            method: HTTPMethods.GET,
        }
        return await fetch(this.BASE_URL + '/' + file, init).then((response) => {
            if (response.ok) return response.json()
        }).then((data) => {
            return data
        })
    }

    async getAllFileNames() {
        const init = {
            ...this.BASE_INIT,
            method: HTTPMethods.GET,
        }
        return await fetch(this.BASE_URL, init).then((response) => {
            if (response.ok) return response.json()
        }).then((data) => {
            return data
        })
    }

    async save(payload: any) {
        const init = {
            ...this.BASE_INIT,
            method: HTTPMethods.POST,
            body: JSON.stringify(payload),
        }
        return await fetch(this.BASE_URL, init).then((response) => {
            if (response.ok) return response.json()
        }).then((data) => {
            return data
        })
    }

    async update(payload: any) {
        const init = {
            ...this.BASE_INIT,
            method: HTTPMethods.PUT,
            body: JSON.stringify(payload),
        }
        return await fetch(this.BASE_URL, init).then((response) => {
            if (response.ok) return response.json()
        }).then((data) => {
            return data
        })
    }

    async remove(file: string | null) {
        const init = {
            ...this.BASE_INIT,
            method: HTTPMethods.DELETE,
        }
        return await fetch(this.BASE_URL + '/' + file, init)
    }

    async options() {
        const init = {
            ...this.BASE_INIT,
            method: HTTPMethods.OPTIONS,
        }
        return await fetch(this.BASE_URL + '/', init)
    }
}