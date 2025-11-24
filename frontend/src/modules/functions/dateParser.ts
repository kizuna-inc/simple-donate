const months: string[] = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
]

export const dateParser = (dateString: Date) => {
  const date = new Date(dateString)

  const dateTime = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  const time = `${date.getHours()} : ${date.getMinutes()}`

  const payload = `${dateTime} // ${time}`

  return payload
}
