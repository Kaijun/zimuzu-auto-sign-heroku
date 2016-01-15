# Zimuzu-部署到Heroku自动签到 :)

- 在根目录的`secret.js`文件中输入您的用户名和密码(请确保正确, 可以输入多组账户密码)
- 在**[Kaffeine](http://kaffeine.herokuapp.com/)**登记你的Heroku App, 不然Heroku有[Idle机制](https://blog.heroku.com/archives/2013/6/20/app_sleeping_on_heroku) (虽然用了Kaffeine 可能还会Idle 但是每次从Idle中恢复都会重新尝试签到一次!)
- 默认每3小时尝试签到一次(要是不Idle的话)
- [Deploy](https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app) 到 Heroku
- Have Fun!
