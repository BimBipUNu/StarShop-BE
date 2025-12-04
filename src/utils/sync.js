const db = require('../models');

db.sequelize.sync({ force: true })
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch((err) => {
    console.error('Error synchronizing database:', err);
  });
