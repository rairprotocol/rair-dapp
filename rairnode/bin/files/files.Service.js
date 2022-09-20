const { File } = require('../models');
const eFactory = require('../utils/entityFactory');
const { verifyAccessRightsToFile } = require('../utils/helpers');

exports.getFiles = eFactory.getAll(File, { dataTransform: { func: verifyAccessRightsToFile, parameters: ['user'] } });
