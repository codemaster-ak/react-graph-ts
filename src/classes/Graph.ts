import {ComputeMethods} from '../enums';
import graphStore from "../stores/GraphStore";

export default class Graph {
    static computePath(
        matrix: any[],
        startPointIndex: number,
        finishPointIndex: number,
        method: ComputeMethods = ComputeMethods.Dijkstra,
    ) {
        let distances
        let distance

        if (method === ComputeMethods.Dijkstra) {
            distances = this.dijkstra(matrix, startPointIndex)
            distance = distances[finishPointIndex]
        }
        if (method === ComputeMethods.Floyd) {
            distances = this.floyd(matrix)
            distance = distances[startPointIndex][finishPointIndex]
        }
        const paths = this.pathsFromMatrix(matrix)
        const fullPaths = this.computeFullPaths(paths, startPointIndex)

        if (fullPaths[finishPointIndex][0] !== undefined) {
            const path = fullPaths[finishPointIndex]
            return [distance, path]
        } else {
            return [Infinity, []]
        }
    }

    static dijkstra(matrix: number[][], startPointIndex?: number) {
        if (startPointIndex !== undefined) return this.dijkstraPoint(matrix, startPointIndex)
        else {
            let distances = []
            for (let i = 0; i < matrix.length; i++) {
                const result = this.dijkstraPoint(matrix, i)
                distances.push(result)
            }

            return distances
        }
    }

    static floyd(matrix: number[][]) {
        let matrixCopy = this.copyMatrix(matrix)

        for (let k = 0; k < matrixCopy.length; k++) {
            for (let i = 0; i < matrixCopy.length; i++) {
                for (let j = 0; j < matrixCopy.length; j++) {
                    if ((i !== k && matrixCopy[i][k] !== Infinity) || (j !== k && matrixCopy[k][j] !== Infinity)) {
                        if (matrixCopy[i][j] >= matrixCopy[i][k] + matrixCopy[k][j]) {
                            matrixCopy[i][j] = matrixCopy[i][k] + matrixCopy[k][j]
                        }
                    }
                }
                if (matrixCopy[i][i] < 0) {
                    throw new Error('Нет решения')
                }
            }
        }

        return matrixCopy
    }

    static dijkstraPoint(matrix: number[][], startPointIndex: number) {
        let i: number | undefined = startPointIndex
        let viewed = [startPointIndex]
        let result = new Array(matrix.length).fill(Infinity)
        result[startPointIndex] = 0

        while (i !== undefined) {
            for (let j = 0; j < matrix.length; j++) {
                if (!viewed.includes(j) && result[i] + matrix[i][j] < result[j]) {
                    result[j] = result[i] + matrix[i][j]
                }
            }
            i = this.minDistance(result, viewed)
            if (i !== undefined) viewed.push(i)
        }
        return result
    }

    private static minDistance(distances: any[], viewed: number[]): number | undefined {
        let nextPoint
        let max = Infinity
        for (let i = 0; i < distances.length; i++) {
            if (distances[i] < max && !viewed.includes(i)) {
                max = distances[i]
                nextPoint = i
            }
        }
        return nextPoint
    }

    static adjacencyMatrixValues(): number[][] {
        const matrixValues = this.copyMatrix(graphStore.adjacencyMatrix)
        matrixValues.shift()
        matrixValues.forEach(row => {
            row.shift()
        })
        return matrixValues
    }

    private static copyMatrix(matrix: any[]): any[][] {
        let matrixCopy = JSON.parse(JSON.stringify(matrix))
        for (let i = 0; i < matrixCopy.length; i++) {
            for (let j = 0; j < matrixCopy.length; j++) {
                if (matrixCopy[i][j] === null) {
                    matrixCopy[i][j] = Infinity
                }
            }
        }
        return matrixCopy
    }

    static pathsFromMatrix(matrix: number[][]): any[] {
        let paths = []
        for (let i = 0; i < matrix.length; i++) {
            let j: number | undefined = i
            let viewed = [j]
            let path = new Array(matrix.length).fill(undefined)
            path[j] = j
            let result = new Array(matrix.length).fill(Infinity)
            result[j] = 0

            while (j !== undefined) {
                for (let k = 0; k < matrix.length; k++) {
                    if (!viewed.includes(k) && result[j] + matrix[j][k] < result[k]) {
                        result[k] = result[j] + matrix[j][k]
                        path[k] = j
                    }
                }
                j = this.minDistance(result, viewed)
                if (j !== undefined) viewed.push(j)
            }
            paths.push(path)
        }
        return paths
    }

    static computeFullPaths(paths: any[], startPoint?: number): any[] {
        let allFullPaths = []

        for (let i = 0; i < paths.length; i++) {
            let fullPaths = []
            for (let j = 0; j < paths[i].length; j++) {
                let start = i
                let finish = j
                let fullPath: any = []

                if (paths[i][finish] !== undefined) fullPath = [finish]
                else fullPath = [undefined]

                while (finish !== undefined && start !== finish) {
                    finish = paths[i][finish]
                    fullPath.unshift(finish)
                }

                if (fullPath[0] !== undefined) fullPaths.push(fullPath)
                else fullPaths.push([fullPath[0]])
            }
            allFullPaths.push(fullPaths)
        }

        return startPoint !== undefined ? allFullPaths[startPoint] : allFullPaths
    }

    static compareMethods(matrix: number[][], cyclesCount = 10000): { dijkstra: number, floyd: number } {
        const dijkstraStart = new Date().getTime()
        for (let i = 0; i < cyclesCount; i++) {
            this.dijkstra(matrix)
        }
        const dijkstraFinish = new Date().getTime()
        const floydStart = new Date().getTime()
        for (let i = 0; i < cyclesCount; i++) {
            this.floyd(matrix)
        }
        const floydFinish = new Date().getTime()
        return {dijkstra: dijkstraFinish - dijkstraStart, floyd: floydFinish - floydStart}
    }
}