import Point from "./Point";
import {PathI} from "../interfaces";
import BasePathfinder from "./BasePathfinder";

export default class RecursivePathfinder extends BasePathfinder {
    constructor() {
        super()
    }

    private tryAddPointToPaths(paths: PathI[], newPoint: Point): boolean {
        let added = false
        for (let j = 0; j < paths.length; j++) {
            if (!paths[j].some(point => point.key === newPoint.key)) {
                const newPath = [...paths[j], newPoint]
                if (!this.isPathExist(newPath)) {
                    this.paths.push(newPath)
                    added = true
                }
            }
        }
        return added
    }

    private allPathsFromPoint(point: Point) {
        const {key, connections} = point
        for (let i = 0; i < connections.length; i++) {
            const {from, to} = connections[i]
            const pathsToAdd = this.paths.filter(path => path.at(-1)?.key === key)
            if (from.key !== key) {
                const added = this.tryAddPointToPaths(pathsToAdd, from)
                if (added) this.allPathsFromPoint(from)
            }
            if (to.key !== key) {
                const added = this.tryAddPointToPaths(pathsToAdd, to)
                if (added) this.allPathsFromPoint(to)
            }
        }
    }

    private isPathExist(path: PathI): boolean {
        let exist = false
        for (let i = 0; i < this.paths.length; i++) {
            if (this.paths[i].length === path.length) {
                exist = true
                for (let j = 0; j < this.paths[i].length; j++) {
                    if (this.paths[i][j].key !== path[j].key) exist = false
                }
                if (exist) break
            }
        }
        return exist
    }

    allPaths(points: Point[]): PathI[][] {
        const paths: PathI[][] = []
        for (let i = 0; i < points.length; i++) {
            this.paths = [[points[i]]]
            this.allPathsFromPoint(points[i])
            paths.push(this.paths)
        }
        return paths
    }
}