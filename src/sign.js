import phantom from 'phantom'
import fs from 'fs';
import path from 'path';
import {isAlreadySigned, writeStampDate, initStampFile} from './stamp.js'

const TRY_TIMEOUT = 2*3600*1000;

export async function init() {
  initStampFile();
  let accounts = await loadAccounts();

  batchSign(accounts);
  setInterval(function () {
    batchSign(accounts);
  }, TRY_TIMEOUT);
}

async function batchSign(accounts) {
  for(let account of accounts){
    let isSigned = await isAlreadySigned(account.account);
    if(isSigned === false){
      await sign(account);
    }
  }
}
async function sign(account) {

  try{

    let phInstance = await phantom.create();
    let sitepage = await phInstance.createPage();

    await sitepage.setting('userAgent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36');

    await sitepage.open('http://www.zimuzu.tv/user/login');

    await sitepage.evaluate(function(account) {
      var loginForm = document.querySelector('.user-login form');
      loginForm.elements['email'].value = account.account;
      loginForm.elements['password'].value = account.password;
      var loginBtn = document.querySelector('#login');
      loginBtn.click();
    }, account)

    await sleep(30000);
    await sitepage.open('http://www.zimuzu.tv/user/sign');
    await sleep(10000);
    await sitepage.open('http://www.zimuzu.tv/user/logout');
    await sleep(10000);
    await sitepage.close();
    await phInstance.exit();
    await writeStampDate(account.account)
    console.log(account.account, new Date().toISOString().substr(0,10), 'Signed');
  }
  catch(e){

    await sitepage.close();
    await phInstance.exit();
  }

}

function sleep (timeout) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), timeout)
  })
}

function loadAccounts() {

  let filePath = path.join(__dirname, '../config/secret.json');

  let promise = new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      data = JSON.parse(data.toString())
      resolve(data)
    })
  });

  return promise

}