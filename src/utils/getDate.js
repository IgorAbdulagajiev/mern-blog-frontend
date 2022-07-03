export const getDate = (dateData) => {
  const date = new Date(dateData);
  return `${date.getFullYear()}-${date?.getMonth()}-${date?.getDay()} ${date?.getHours()}:${date?.getMinutes()}`;
}