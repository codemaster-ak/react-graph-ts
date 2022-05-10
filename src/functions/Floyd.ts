export function Floyd(matrix: any) {
    let matrixCopy = JSON.parse(JSON.stringify(matrix))
    for (let i = 1; i <= matrixCopy.length; i++) {
        for (let j = 1; j <= matrixCopy.length; j++) {
            if (!matrixCopy[i][j]) {
                matrixCopy[i][j] = Infinity
            }
        }
    }
    console.log(matrixCopy)
    // for (let k = 1; k <= matrixCopy.length; k++) {
    //     for (let i = 1; i <= matrixCopy.length; i++) {
    //         for (let j = 1; j <= matrixCopy.length; j++) {
    //             if (matrixCopy[i][j] >= matrixCopy[i][k] + matrixCopy[k][j]) {
    //                 matrixCopy[i][j] = matrixCopy[i][k] + matrixCopy[k][j]
    //             }
    //         }
    //     }
    // }

    return matrixCopy
}