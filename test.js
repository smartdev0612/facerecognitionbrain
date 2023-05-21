var kthSmallest = function (matrix, k) {
  let newArray = []

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      newArray.push(matrix[i][j])
    }
  }
  console.log(newArray)
  console.log(k)
  return newArray[k]
}
console.log(
  kthSmallest(
    [
      [1, 5, 9],
      [10, 11, 13],
      [12, 13, 15],
    ],
    8
  )
)
