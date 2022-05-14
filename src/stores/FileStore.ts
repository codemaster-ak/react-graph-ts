import {action, makeObservable, observable} from 'mobx';
import {BASE_INIT, BASE_URL, HTTP_METHODS} from '../consts';
import axios from "axios";
import {Urls} from "../enums";

interface FileI {
    name: string
}

class FileStore {
    @observable files = observable.array<FileI>([])

    constructor() {
        makeObservable(this)
    }

    @action
    async getAllFileNames() {
        const files = await axios.get<FileI[]>(Urls.getAllFiles)
        this.files = observable.array(files.data)
    }

    @action
    async save(payload: any) {
        const init = {
            ...BASE_INIT,
            method: HTTP_METHODS.POST,
            body: JSON.stringify(payload),
        }
        return await fetch(BASE_URL, init).then(response => {
            if (response.ok) return response.json()
        }).then((data) => {
            return data
        })
    }
}

const fileStore = new FileStore()
export default fileStore;