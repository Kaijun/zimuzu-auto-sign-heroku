# Zimuzu-部署到Heroku自动签到 :)

## 介绍
字幕组自动签到程序, 部署到Heroku后, 默认每2小时尝试签到一次. 但是每个帐号成功签到后会记录, 今天便不再尝试签到.

## 食用方法
- 重命名`config`文件夹下的`secret.json.example`文件为`secret.json`, 并输入您的用户名和密码(请确保正确, 可以输入多组账户密码)
- [Deploy](https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app) 到 Heroku
- 在**[Kaffeine](http://kaffeine.herokuapp.com/)**登记你的Heroku App
  * 不然Heroku有[Idle机制](https://blog.heroku.com/archives/2013/6/20/app_sleeping_on_heroku) 
- Have Fun!
