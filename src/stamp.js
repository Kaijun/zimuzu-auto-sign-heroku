import fs from 'fs';
import path from 'path';

const SIGNED_STAMP_FILENAME = 'account-singed-stamp';

export async function initStampFile() {
  let filePath = path.join(__dirname, SIGNED_STAMP_FILENAME);
  let file = await readFile(filePath);
  if(file === undefined){
    await writeFile(filePath, JSON.stringify({}))
  }
}

export async function isAlreadySigned(accountName) {
  let filePath = path.join(__dirname, SIGNED_STAMP_FILENAME);
  let file = await readFile(filePath);
  let fileData = parseFileData(file.toString());
  let stampDate = fileData[accountName];
  if(stampDate !== undefined){
    var today = new Date().toISOString().substr(0,10);
    return today == stampDate;
  }
  else{
    return false;
  }

}


export function writeStampDate(accountName) {

  let filePath = path.join(__dirname, SIGNED_STAMP_FILENAME);
  let promise = readFile(filePath).then(data => {
    data = parseFileData(data.toString());
    data[accountName] = new Date().toISOString().slice(0,10);
    return writeFile(filePath, JSON.stringify(data));
  })

  return promise;
}


function parseFileData(fileData) {
  if(fileData === undefined || fileData.length===0){
    return {}
  }
  else{
    return JSON.parse(fileData);
  }
}

function readFile(filePath) {
  let promise = new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      resolve(data)
    })
  });
  return promise;
}

function writeFile(filePath, data) {
  let promise = new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err, data) => {
      resolve(data)
    })
  });
  return promise
}