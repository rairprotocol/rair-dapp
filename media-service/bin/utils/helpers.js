const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const _ = require('lodash');
const { promises: fs } = require('fs');
const log = require('./logger')(module);

// XSS sanitizer
const textPurify = () => {
  const { window } = new JSDOM('');
  return createDOMPurify(window);
};

// Remove files from temporary server storage
const cleanStorage = async (files) => {
  if (files) {
    const preparedFiles = [].concat(files);
    await Promise.all(
      _.map(preparedFiles, async (file) => {
        await fs.rm(`${file.destination}/${file.filename}`);
        log.info(`File ${file.filename} has removed.`);
      }),
    );
  }
};

module.exports = {
  textPurify: textPurify(),
  cleanStorage,
};
