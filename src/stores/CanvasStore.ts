import {action, makeObservable, observable} from "mobx";
import Point from "../classes/Point";
import Connection from "../classes/Connection";
import graphStore from "./GraphStore";

class CanvasStore {
    @observable selectedPoint: Point | null
    @observable transitionLine: Connection | null

    constructor() {
        makeObservable(this)
        this.selectedPoint = null
        this.transitionLine = null
    }

    @action
    selectPoint(key: string): void {
        if (this.selectedPoint?.key === key) this.selectedPoint = null
        else this.selectedPoint = graphStore.findPointByKey(key) as Point
    }
}

const canvasStore = new CanvasStore()
export default canvasStore;