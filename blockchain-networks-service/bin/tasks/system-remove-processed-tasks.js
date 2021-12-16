const lockLifetime = 1000 * 60 * 120; // 120 minutes

module.exports = (context) => {
  context.agenda.define('system remove processed tasks', { lockLifetime }, async (task, done) => {
    try {
      await context.agenda.cancel({ nextRunAt: null });
      return done();
    } catch (e) {
      return done(e);
    }
  });
};
