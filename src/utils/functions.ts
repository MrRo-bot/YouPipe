// getting video duration from given string
export const videoDuration = (duration: string): string => {
  if (duration === "P0D") return "Live";
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
      parseInt(durationParts[1]) < 9
        ? `0${durationParts[1]}`
        : `${!durationParts[1] ? "00" : durationParts[1]}`
    }`;
  }

  if (durationParts.length === 1) {
    return `0:${
      parseInt(durationParts[0]) < 9 ? `0${durationParts[0]}` : durationParts[0]
    }`;
  }

  return "0:00";
};

//getting time passed since the date number given
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

//converting raw views count to readable form
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

//unix timestamp to time string
export const unixToTimeString = (unix_timestamp: number) => {
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds
  const date = new Date(unix_timestamp * 1000);

  date.toLocaleString("en-IN", { timeZone: "Asia/kolkata" });

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

//list of all youtube scopes
export const youtubeScopes = {
  youtube: "https://www.googleapis.com/auth/youtube",
  member: "https://www.googleapis.com/auth/youtube.channel-memberships.creator",
  ssl: "https://www.googleapis.com/auth/youtube.force-ssl",
  readOnly: "https://www.googleapis.com/auth/youtube.readonly",
  upload: "https://www.googleapis.com/auth/youtube.upload",
  parter: "https://www.googleapis.com/auth/youtubepartner",
  partnerAudit: "https://www.googleapis.com/auth/youtubepartner-channel-audit",
};
