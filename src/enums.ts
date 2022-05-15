import {BASE_URL} from "./consts";

export enum ComputeMethods {
    Dijkstra = 'Дейкстра',
    Floyd = 'Флойд',
}

export enum Urls {
    getAllFiles = 'http://127.0.0.1:4000',
    getFileByName = 'http://127.0.0.1:4000/',
    createFile = 'http://127.0.0.1:4000',
    updateFile = 'http://127.0.0.1:4000/',
    deleteFile = 'http://127.0.0.1:4000/',
}

export enum HTTPMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    OPTIONS = 'OPTIONS'
}