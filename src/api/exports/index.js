const ExportHandler = require('./handler');
const routes = require('./routes');

const registerExport = {
  name: 'exports',
  version: '1.0.0',
  register: (server, { exportService, validator }) => {
    const exportHandler = new ExportHandler(exportService, validator);
    server.route(routes(exportHandler));
  },
};

module.exports = registerExport;
