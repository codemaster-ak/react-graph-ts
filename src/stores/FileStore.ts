import {action, makeObservable, observable} from 'mobx';
import axios from "axios";
import {Urls} from "../enums";
import {FileI} from "../interfaces";

class FileStore {
    @observable files = observable.array<FileI>([])

    constructor() {
        makeObservable(this)
    }

    @action
    async getAllFileNames(): Promise<void> {
        const files = await axios.get<FileI[]>(Urls.getAllFiles)
        this.files = observable.array(files.data)
    }

    async getFileByName(name: string): Promise<any[]> {
        const fileContent = await axios.get<any[]>(Urls.getFileByName + name)
        return fileContent.data
    }

    @action
    async save(payload: any[]): Promise<void> {
        const fileName = await axios.post<FileI>(Urls.createFile, payload)
        this.files.push(fileName.data)
    }

    async update(payload: any[], name: string): Promise<void> {
        await axios.put(Urls.updateFile + name, payload)
    }

    @action
    async remove(name: string): Promise<void> {
        axios.delete(Urls.deleteFile + name).then(response => {
            if (response.status === 200) {
                const file = this.files.find(file => file.name === name) as FileI
                const index = this.files.indexOf(file)
                this.files.splice(index, 1)
            }
        })
    }
}

const fileStore = new FileStore()
export default fileStore;