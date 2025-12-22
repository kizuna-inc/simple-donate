export const bankParser = (no: string | undefined | null) => {
  if (no !== undefined && no !== null) {
    let slugList = [2, 3, 8]

    let rtn = ''

    for (let i = 0; i < no.length; i++) {
      rtn += no[i]

      if (slugList.indexOf(i) !== -1) {
        rtn += '-'
      }
    }

    return rtn
  } else {
    return undefined
  }
}
