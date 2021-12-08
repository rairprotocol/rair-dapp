const log = require('./logger')(module);

exports.logAgendaActionStart = ({
  agendaDefinition
}) => {
  log.info(`Agenda action started: ${agendaDefinition}`);
};