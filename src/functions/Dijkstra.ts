export default function Dijkstra(matrix: any[], start = 0) {

    const rowsCount = matrix.length, colsCount = matrix[0].length

    if (rowsCount !== colsCount || start >= rowsCount || start < 0) {
        throw new Error('Ошибка в матрицы смежности или в задании исходной точки')
    }

    const distances = new Array(rowsCount).fill(Infinity)
    distances[start] = 0
    const paths = distances.map(_ => {
        return new Array(1).fill(undefined)
    })

    for (let k = 0; k < matrix.length; k++) {
        matrix.forEach((row: any[], i: number) => {
            if (distances[i] < Infinity) {
                row.forEach((col, j) => {
                    if (col + distances[i] < distances[j]) {
                        distances[j] = col + distances[i]

                        if ([undefined, j].includes(paths[j].at(-1))) {
                            if (paths[j].at(-1) === undefined && i !== start) {
                                paths[j] = [...paths[i], j]
                            } else {
                                if (paths[i][1]) {
                                    paths[j] = [...paths[i], j]
                                } else {
                                    paths[j].pop()
                                    paths[j].push(i)
                                    paths[j].push(j)
                                }
                            }
                        }
                    }
                })
            }
        })
    }

    return [distances, paths]
}