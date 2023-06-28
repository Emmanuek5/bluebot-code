require("dotenv").config();

//convert the env to json object and save to a josn file in the data folder

const fs = require("fs");
function sleep(params) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, params);
  });
}

const argvs = process.argv[2];
if (argvs == "json") {
  const env = process.env;

  const envJson = JSON.stringify(env);
  console.log("Converting env to json");
  sleep(10000);
  console.log("Saving env.json to data folder");
  sleep(10000);
  console.log("Done");
  fs.writeFileSync("src/data/env.json", envJson);
}
if (argvs == "env") {
  const jsonenv = fs.readFileSync("src/data/env.json", "utf-8");
  const env = JSON.parse(jsonenv);

  const envFile = Object.entries(env)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  fs.writeFileSync(".env", envFile);

  console.log("Coverting to Env File");
  sleep(10000);
  console.log("Creating env file");
  sleep(10000);
  console.log("Done");
  exit();
}
