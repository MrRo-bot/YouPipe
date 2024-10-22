export const videoDuration = (duration: string): string => {
  const durationParts: string[] = duration
    .replace("PT", "")
    .replace("H", ":")
    .replace("M", ":")
    .replace("S", "")
    .split(":");

  if (durationParts.length === 3) {
    return `${durationParts[0]}:${
      parseInt(durationParts[1]) < 9 ? `0${durationParts[1]}` : durationParts[1]
    }:${
      parseInt(durationParts[2]) < 9 ? `0${durationParts[2]}` : durationParts[2]
    }`;
  }

  if (durationParts.length === 2) {
    return `${durationParts[0]}:${
      parseInt(durationParts[1]) < 9 ? `0${durationParts[1]}` : durationParts[1]
    }`;
  }

  if (durationParts.length === 1) {
    return `0:${
      parseInt(durationParts[0]) < 9 ? `0${durationParts[0]}` : durationParts[0]
    }`;
  }

  return "";
};

export const elapsedTime = (date: number) => {
  const seconds = Math.floor((new Date().valueOf() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
};

export const rawViewsToString = (labelValue: string, isSub = false): string => {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(0) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(0) + "M"
    : // Three Zeroes for Thousands
    Math.abs(Number(labelValue)) >= 1.0e3
    ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(isSub ? 2 : 0) + "K"
    : Math.abs(Number(labelValue)).toString();
};

export const unixToTimeString = (unix_timestamp: number) => {
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds
  const date = new Date(unix_timestamp * 1000);

  // Hours part from the timestamp
  const hours = date.getHours();

  // Minutes part from the timestamp
  const minutes = "0" + date.getMinutes();

  // Seconds part from the timestamp
  const seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  const formattedTime =
    hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

  return formattedTime;
};
