import {makeObservable, observable} from "mobx";
import Point from "../classes/Point";
import graphStore from "./GraphStore";

export interface PathI extends Array<Point> {
}

class PathfinderStore {
    @observable paths = observable.array<PathI>([])

    constructor() {
        makeObservable(this)
    }

    makePaths(path: number[]) { // todo
        // const res = Graph.computePath(Graph.adjacencyMatrixValues(), 0, 1, ComputeMethods.Floyd)
        const pointsPath: PathI = path.map((_: any, index: number) => graphStore.findPointByIndex(index)) as Point[]
        this.paths = observable.array<PathI>([pointsPath])
    }
}

const pathfinderStore = new PathfinderStore()
export default pathfinderStore;