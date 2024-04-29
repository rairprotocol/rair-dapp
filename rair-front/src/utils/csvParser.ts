const csvParser = (
  data: File,
  resultReceiver: Function,
  searchColumns?: Array<string>,
  delimiter = ','
) => {
  const reader = new FileReader();
  reader.onload = function (e) {
    const text = (e?.target?.result as string).split(/\r\n|\n/);
    const headers = text.splice(0, 1)[0].split(delimiter);
    let getIndexes = Object.keys(headers).map((item) => Number(item));
    if (searchColumns) {
      getIndexes = searchColumns.map((item) => headers.indexOf(item));
    }
    const aux: Array<Record<string, unknown>> = [];
    text.forEach((textItem, textIndex) => {
      let split = textItem.split(delimiter);
      split = split.map((item) => {
        return item.replace(/[\n\t\r]/g, '');
      });
      if ([',', '.'].includes(delimiter)) {
        let offset = 0;
        const aux2 = [...split];
        aux2.forEach((item, index) => {
          if (item[0] === ' ') {
            split[index - 1 - offset] += delimiter + item;
            offset++;
            split[index] = '';
          }
        });
        split = split.filter((item) => item !== '');
      }
      if (split.length !== headers.length) {
        console.error('Error parsing line', textIndex, ', resulted in', split);
      }
      const result: { [key: string]: string } = {};

      getIndexes.forEach((item) => {
        result[headers[item]] = split[item];
      });
      aux.push(result);
    });
    resultReceiver(aux);
  };
  reader.readAsText(data);
};

export default csvParser;
