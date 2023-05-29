
const path = require('path');
const fs = require('fs');
const request = require('request');


function sleep(params) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, params);
  });
}

function rand(min, max) {
  //create a random number between min and max and convert it to a string
  let random = Math.floor(Math.random() * (max - min + 1) + min).toString();
  //return the random number
  return random;
}

function mute(client, id, guild, channel, username, message) {}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  } else {
    next();
  }
}


async function download(link) {
  //download the file from the link and save it locally to the downloads folder in data folder
  const filename = path.basename(link);
  const file = fs.createWriteStream(path.join(__dirname, '../data/downloads/'+ filename+".png"));
  request(link).pipe(file);
  file.on('finish', () => {
    
    file.close();
    

  })



async function downloadtxt(link) {
  //download the file from the link and save it locally to the downloads folder in data folder
  const filename = path.basename(link);
  const file = fs.createWriteStream(path.join(__dirname, '../data/downloads/'+ filename));
  request(link).pipe(file);
  file.on('finish', () => {
    
    file.close();
    

  }
  )
  await sleep(5000);
    const filepath = path.join(__dirname, '../data/downloads/' + filename + '.png');
   
    return filepath;
}

}

async function downloadtxt(link) {
  //download the file from the link and save it locally to the downloads folder in data folder
  const filename = path.basename(link);
  const file = fs.createWriteStream(path.join(__dirname, "../data/downloads/" + filename));
  request(link).pipe(file);
  file.on("finish", () => {
    file.close();
  });
  await sleep(5000);
  const filepath = path.join(__dirname, "../data/downloads/" + filename + ".png");

  return filepath;
}


 function deletefile(filepath) {
   fs.unlinkSync(filepath);
 }




module.exports = {
  sleep,
  rand,
  checkAuthenticated,
  checkNotAuthenticated,
  download,
  deletefile,
  downloadtxt
}
