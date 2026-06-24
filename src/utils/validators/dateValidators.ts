export const formatDate = (value: string) => {
  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length <= 2) {
    return cleaned;
  }

  if (cleaned.length <= 4) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  }

  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
};

export const isValidDate = (date: string) => {
  if (!date) return false;

  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;

  if (!regex.test(date)) {
    return false;
  }

  const [day, month, year] = date.split("/").map(Number);

  const parsedDate = new Date(year, month - 1, day);

  const isRealDate =
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day;

  if (!isRealDate) {
    return false;
  }

  /* NO FUTURE DATE */

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (parsedDate > today) {
    return false;
  }

  /* MINIMUM YEAR */

  if (year < 1900) {
    return false;
  }

  return true;
};

export const formatTime = (value: string) => {
  const cleaned = value.replace(/[^0-9APMapm]/g, "").toUpperCase();

  const numbers = cleaned.replace(/[^0-9]/g, "");

  let hour = "";
  let minute = "";

  if (numbers.length >= 1) {
    hour = numbers.slice(0, Math.min(2, numbers.length));
  }

  if (numbers.length >= 3) {
    minute = numbers.slice(2, 4);
  }

  let formatted = hour;

  if (minute) {
    formatted += `:${minute}`;
  }

  const meridian = cleaned.includes("PM")
    ? " PM"
    : cleaned.includes("AM")
      ? " AM"
      : "";

  return formatted + meridian;
};

export const isValidTime = (time: string) => {
  if (!time) return true;

  /* SUPPORTS:
     8:58 AM
     08:58 AM
  */

  const regex = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i;

  return regex.test(time);
};

export const isValidFutureDate = (date: string) => {
  if (!date) return false;

  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;

  if (!regex.test(date)) {
    return false;
  }

  const [day, month, year] = date.split("/").map(Number);

  const parsedDate = new Date(year, month - 1, day);

  const isRealDate =
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day;

  if (!isRealDate) {
    return false;
  }

  /* REMOVE TIME */

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  parsedDate.setHours(0, 0, 0, 0);

  /* ONLY FUTURE DATES */

  if (parsedDate <= today) {
    return false;
  }

  return true;
};
