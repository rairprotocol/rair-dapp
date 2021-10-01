const lockLifetime = 1000 * 60 * 120; // 120 minutes
const NAME = 'system remove processed tasks';

module.exports = (context) => {
  context.agenda.define('system remove processed tasks', { lockLifetime }, async (task, done) => {
    try {
      await context.agenda.cancel({ nextRunAt: null });
      return done();
    } catch (e) {
      console.error(e);
      return done(e);
    }
  });
};
