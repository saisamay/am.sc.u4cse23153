const Log = require("./logging-middleware");

async function testLogger() {

  const response = await Log(
    "backend",
    "info",
    "handler",
    "Logger is working successfully"
  );

  console.log(response);

}

testLogger();