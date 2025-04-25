//@ts-nocheck
export const mapDataString = (str) => {
    const lineBreak = "\n";
    const data: string[][] = [];
    let line = -1;
    let string = str;
    // strip any break at the end
    if (string[string.length - 1] === lineBreak) {
      string = string.slice(0, -1);
    }
    for (const char of string) {
      if (char === " ") continue;
      if (char === lineBreak) {
        data[++line] = [];
      } else {
        data[line].push(char);
      }
    }
    return data;
  };