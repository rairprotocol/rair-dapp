const log = require('./logger')(module);

export const logAgendaActionStart = ({
  agendaDefinition
}) => {
  log.info(`agenda action started execution: {agendaDefinition}`);
}