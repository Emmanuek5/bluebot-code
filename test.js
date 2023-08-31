require("axios");
require("dotenv").config();

setTimeout(() => {
  fetch("https://discords.com/bots/api/bot/1058300450253832272", {
    method: "post",
    headers: {
      Authorization: `Bearer adb612a7ee7ea9e9b69a25a3d298e96e09faa10525b4833784fe6a1781dd07cb46069018b3e001ce196327bd066043f56ff3e99b67c52cd180042ac75d91829b`,
    },
    data: {
      server_count: 70,
    },
  }).then(e => {
    console.log(e);
  });

}, 2000);