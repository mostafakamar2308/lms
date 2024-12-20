export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
  }).format(price);
};

export function convertHMS(value: number) {
  const sec = parseInt(String(value), 10); // convert value to number if it's string
  let hours = String(Math.floor(sec / 3600)); // get hours
  let minutes = String(Math.floor((sec - +hours * 3600) / 60)); // get minutes
  let seconds = String(sec - +hours * 3600 - +minutes * 60); //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  if (+hours < 10) {
    hours = "0" + hours;
  }
  if (+minutes < 10) {
    minutes = "0" + minutes;
  }
  if (+seconds < 10) {
    seconds = "0" + seconds;
  }

  return hours + ":" + minutes + ":" + seconds; // Return is HH : MM : SS
}
