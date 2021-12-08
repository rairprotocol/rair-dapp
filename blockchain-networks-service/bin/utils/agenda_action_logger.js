const log = require('./logger')(module);

exports.logAgendaActionStart = ({
  agendaDefinition
}) => {
  log.info(`agenda action started execution: ${agendaDefinition}`);
};