import {action, IObservableArray, makeObservable, observable} from 'mobx';
import axios from "axios";
import {Urls} from "../enums";
import {FileI, IncidenceMatrixI} from "../interfaces";
import stackStore from "./StackStore";

class FileStore {
    @observable files: IObservableArray<FileI>

    constructor() {
        makeObservable(this)
        this.files = observable.array<FileI>([])
    }

    @action
    async getAllFileNames(): Promise<void> {
        const files = await axios.get<FileI[]>(Urls.getAllFiles)
        this.files = observable.array(files.data)
    }

    async getFileByName(name: string): Promise<void> {
        const fileContent = await axios.get<object[]>(Urls.getFileByName + name)
        stackStore.parseToStack(fileContent.data)
    }

    @action
    async save(): Promise<void> {
        stackStore.updateStack()
        const fileName = await axios.post<FileI>(Urls.createFile, stackStore.stack)
        this.files.push(fileName.data)
    }

    async update(payload: IncidenceMatrixI, name: string): Promise<void> {
        stackStore.updateStack()
        await axios.put(Urls.updateFile + name, stackStore.stack)
    }

    @action
    async remove(name: string): Promise<void> {
        axios.delete(Urls.deleteFile + name).then(response => {
            if (response.status === 200) {
                const file = this.files.find(file => file.name === name) as FileI
                this.files.remove(file)
            }
        })
    }
}

const fileStore = new FileStore()
export default fileStore;