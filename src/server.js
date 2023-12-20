const Hapi = require('@hapi/hapi');

const dotenv = require('dotenv');
dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
