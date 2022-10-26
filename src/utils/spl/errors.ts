export const tryGetErrorCodeFromMessage = (message: string) => {
  const regexp = /custom program error: (0x[a-zA-Z0-9]+)/;
  const match = message.match(regexp);
  if (match.length === 2) {
    return parseInt(match[1], 16);
  } else {
    return undefined;
  }
};
