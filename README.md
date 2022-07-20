[🔗 노션 정리 페이지](https://purple-humor-520.notion.site/HetaMVC-8c62681b9e754871be225ad9653c899b)

# HetaMvc
  
HetaMvc is MVC back-end framework that consist of expressJs in NodeJs based

Install it with the command below
  
```bash
    $ npm i -save hetamvc
```
  
아래 문구를 app.js등의 시작 js에 추가해서 실행해 줍니다.
```JavaScript
   require('hetamvc').init({
        scanPath:app_route,	        //scan path  (required)
        route:express,		            //express route (required)
        //socket:socketIo,	                            //socket object
        //sequelize:require('./sequelize.config.js'),    //DB
        //mongodb:require('./mongodb.config.js'),       //Mongo
        //email:require('./email.config.js'),       //Email
        //locale:require('./locale.config.js'),       //Locale
    	//constants:require('./app.config.js'),   //Global Value 
    	//logger:require('./logger.config.js'),   //logging
	    //uploadPath:appConfig._upload.path             //File Upload path
        //forceAwait: true                          //force await mode 
    },{
    babel_plugin: ["module-resolver",{"alias": {"@": "./"}}]
});
```

> scanPath : route path `파일의 최상위 경로` (필수)  
> route : express object  `const express = express();` (필수)  
> socket : websocket object `const socketIo = require('socket.io')(serv,{});`  
> forceAwait : true일때 모든 file상단에 @AutoAsyncAwait 붙은 효과  
> sequelize : sequelize object `require('./sequelize.config.js')`  
```JavaScript
    //sequelize.config.js (mysql)
    module.exports = {
        dialect: "mysql",
        username: "root",
        password: "xxxxxxx",
        passKey: "Encrypt_Key",    //Password encryption key
        database: "dbname",
        host: "localhost",
        port: 3306,
        logging: true,
        force: false,
        operatorsAliases: false,
        timezone: "-08:00",
        dialectOptions: {
            charset: 'utf8mb4',
            dateStrings: true,
            typeCast: true
        },
        define: {
            timestamps: false
        },
        pool:{
            max:20,
            min:5,
            idle:10000
        }
    };
    
    //sequelize.config.js (sqlite)
    module.exports = {
        dialect: "sqlite",
        force: false,       //강제 테이블변경
        operatorsAliases: false,    
        dialectOptions: {
            charset: 'utf8mb4',
            dateStrings: true,
            typeCast: true
        },
        define: {
            freezeTableName: true,  //테이블에s 제거
            timestamps: false    //false : 자동으로 CreatedAt, UpdatedAt 방지 
        },
        pool:{
            max:20,
            min:5,
            idle:10000
        },
        storage: __dirname+"/database.sqlite" // default Sequelize('sqlite::memory:');
    };


```
> mongodb : mongodb 연결시 설정해줌 `require('./mongodb.config.js')`  
```JavaScript
    //mongodb.config.js
    module.exports = {
        username: "",
        password: "",
        passKey: "Encrypt_Key",    //Password encryption key
        database: "test",
        host: "localhost",
        port: 27017,
        dialect: "mongodb",
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,	//pool
            serverSelectionTimeoutMS: 10000,
        }
        /* mongodb transaction을 사용할때 활성화
        ,replicaSet: {
            name : "bgarage_replica",
            hosts: [ // Primary를 제외한 나머지 기술
            {
                host: "bgaragemongo_slave",
                port: 27118
            },
            {
                host: "bgaragemongo_arbiter",
                port: 27119
            }
            ]
        }
        */
    };
```
> constants : constants object 초기 상수값 `require('./app.config.js')`
```JavaScript
    //app.config.js 
    const path = require('path');
    module.exports = {
        _email:{
            serverUrl: "http://{IP}"
        },
        _ip:'',
        _root: __dirname,
        _upload:{
            path: path.resolve(__dirname, './upload')
        }
    };
```
> email : email사용하기 위해 smtp설정 `require('./email.config.js')`
```JavaScript
    //email.config.js 
    module.exports = {
        smtp: "smtp.naver.com",
        port: 587,
        secure: false,
        user: "xxxxx",
        pass: "04ec1b40be3a75a12ae522cc38affab8", //Passwords created using @Encrypt can be created in the documentation referenced.
        passKey: "Encrypt_Key",    //Password encryption key
        from: "xxxxx@naver.com"         //Pin the sending user
    };

```
> logger : winston logger사용하기 위해 설정 `require('./logger.config.js')`
```JavaScript
    //logger.config.js 
    module.exports = {
        level: "debug", //error:0, warn:1, info:2, verbose:3, debug:4, silly:5
        output:['console','file'], 	//default 'console'
        dir: 'logs'	//file directory
    };


```
> locale : 다국어 사용을 위해 i18n설정 `require('./locale.config.js')`
```JavaScript
    //locale.config.js 
    module.exports = {
        locales:['en', 'ko'],   //사용언어 설정 / 'de' 나 'ja' , 'fr' 등등 추가 가능 
        directory: '/locales', // 사용언어에 대한 템플릿폴더 생성위치,  
        defaultLocale: 'en',    //기본 사용언어 설정 
        cookie: 'lang',         //쿠키의 이름 설정, 개발자가 자유롭게 이름 설정가능
        autoReload: true,
        //updateFiles: false,   //없는 param을 있으면 json파일을 변경한다
        //syncFiles: false,		//로케일 정보 동기화 
        objectNotation:true 
    };

    //en.json
    {
        "home": {
		    "title": "test {{aa}}"
	    }
    }

```

## File 구성
---  
파일은 Component, Controller, Service, Model 이렇게 4가지 형태의 @Annotation으로 구분해주며   
모든 파일은 `Common` @Annotation을 호출 할 수 있습니다.  

1. `Common` @Annotation  
    변수로만 할당하며 모두 contructor안에서 정의한다.  
    호출하는 객체는 모두 async await 처리를 자동으로 해준다. 
    ```JavaScript

    /** @AutoAsyncAwait () */ 
    class Test{
        constructor(){
		    /** @Inject ('SettingMasterService') */
		    this.SettingMasterService;

            /** @Websocket ('/ns') */ 
            this.websocket;

            /** @Sequelize () */ 
            this.sequelize;

            /** @Request () */ 
            this.request;

            /** @Render () */ 
            this.render;

            /** @Route () */ 
            this.route;

            /** @Constants () */ 
            this.constants;

            /** @Encrypt ('Encrypt_Key')    */ 
            this.encrypt;

            /** @Email () */ 
            this.email;

            /** @Locale () */ 
            this.i18n;

            /** @Logger () */ 
            this.log;
        }
        /** @Starter () */
        start(){
            console.log('Component/Service/Controller Started.');
        }

        Websocket(){
            this.websocket.emit('send data to all');

            for(let item of this.websocket.sockets){
                let socketId = item[0];
			    let socket = item[1];
                socket.emit('User Id :',socket.userId || 'Anonymous');
            }
        }
        Sequelize(){
            var param = {sDate: sDate, eDate: eDate};
            let s = `SELECT * FROM TEST`;
            let resultList = this.sequelize.query(s,{
                type:this.sequelize.QueryTypes.SELECT,raw:true,
                replacements: param
            });
        }
        Request(){
            try{
                var OPTIONS = {
                    uri: 'http://test.com/rest/testinsert',
                    method: 'PUT',	//POST
                    json: true,     //response type
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': "mytoken"
                    },
                    body: {
                        "id": "test_id",
                        "name": "test_name"
                    }
                };
                const response = this.request(OPTIONS);
                console.log(response);
                
            }catch(e){
                console.log('ERROR :',e);
                //return e;     // throw exception
            }
        }
        Render(){
            const str = this.render(this.constants._root+"/templates/email.html", {
                param1: "title", param2: "contents", param3: "copyright"
            });
        }
        Route(){
            this.route.get('/some/url',function(req,res,next){
                res.send('this is dynamic router');
            });
        }
        Constants(){
            console.log(this.constants._root);  // the data in app.config.js
        }
        Encrypt(){
            let enc = this.encrypt.encode('testEncrypt');  
            console.log(enc);  //14ec1b40be3a75a12ae522cc38affab8
            console.log(this.encrypt.decode(enc)); //testEncrypt
        }
        Email(){
            try{
                let mailOptions = {
                    //from: 'sender@gmail.com',             //single
                    to: 'test1@gmail.com,test2@gmail.com',  //multiple
                    subject: 'some title',	                //title
                    html: '<p> some contents </p>'			//contents
                };
                let result = this.email.send(mailOptions);
                console.log("Finish sending email : " + result.response);
            }catch(e){
                console.log(e.response);
                //return e;     // throw exception
            }
        }
        Locale(){
            console.log(this.i18n.getLocale());		//read default 'en'
            this.i18n.setLocale('en');	//set lang
            res.cookie('lang', 'en'); 	//set lang - same as above
            // http://host/lang/en      //set lang - same as above
            console.log(this.i18n.__('home.title',{aa:'test'});  //translate back-end
            
            //<%= __('sample_title')/*Title*/%>     //translate front-end
            //Using the en.json file when call in the VUE
        }
        Logger(){
            this.log.debug('debug test');
            this.log.info('info test');
            this.log.error('error test');
        }
    }
        
    ```
    > `@Inject('Service or Model')` @Service 또는 @Model객체를 변수에 할당  
    > `@Websocket('/ns')` socketIO객체를 가져옴 namespace(option)로 구분  
    > `@Sequelize('')` this.sequelize.query()로 query를 바로 호출한다.  
    > `@Request` 외부의 http url을 호출한다.  
    > `@Render` 메일 발송같은 임의로 ExpressJs Render(ejs parsing)를 한다.  
    > `@Route` ExpressJs 객체를 사용한다. (get,post,delete등을 동적 설정)  
    > `@Constants` 초기에 입력받은 상수 값을 사용 할 수 있다.(config)  
    > `@Encrypt` 문서의 암/복호화를 사용할 수 있다.  
    > `@Email` 초기에 입력받은 Smtp설정으로 간편하게 이메일을 사용 한다.(config)  
    > `@Locale` 다국어 객체를 받음. en.json,ko.json 등의 파일을 사용한다.(config)  
    > `@Logger` winston logger를 사용 (config)  
    > `@Starter` 시스템이 시작될때 Method를 onload해준다.    
    > `@AutoAsyncAwait` Method에 자동 async와 await설정함. (전역 import를 사용 할때 사용불가.)  

1. `@Component` File
    - 공통소스 , 배치 , Filter 등의 용도로 사용합니다.
    - class상단에 `@Component`를 추가해야합니다.
    - 모든 @Annotation은 `Comment`로 추가해야 합니다.
    
    ```JavaScript
        /** @Component */
        export class FilterComponent{
	        constructor(){}

            /** @Starter () */
            start(){
                console.log('component started.');
            }
            // @FilterMapping ('/*')
            SessionInterceptor(req,res,next){
                res.header('X-XSS-Protection' , 0 );
                console.log('페이지 호출전에 이 function을 선행 호출');
                return next();
            }

            // @Scheduler ('0 */10 * * * *')
            every10min(){
                console.log('10분마다 호출됨.');
            }

            /** @Socket ('message','/ns') */
            socketMessage(data,socket){
		        socket.userId = data.userId;

                console.log('Client에서 socket.emit("message",{}); 로 호출함');
                socket.emit('log','Client said : '+data);
                socket.broadcast.emit('message',data);      //나빼고 전체발송
            }

            /** @SocketConnect ('/ns') */
            connect(socket){
                console.log("socket connection : "+socket.id);
                const roomId = socket.request.session.roomId;   //session읽기
                return {roomId:roomId};
            }
            
            /** @SocketDisconnect ('/ns') */
            disconnect(socket, connectReturn){
                console.log(connectReturn);     //위connect에서 return한 값
                console.log("socket disconnected : "+socket.id);
            }
            
        }
    ```
    - Component에서만 사용 할수 있는 Method용 Annotation목록 입니다.  
        > `// @FilterMapping ('/*')` :  request 호출의 선행자로 동작  
        > `// @Starter()` : node실행할때 선행 실행된다.  
        > `// @Scheduler ('0 */10 * * * *')` : cron을 이용한 Scheduler  
        > `// @Socket ('emit name',ns)` : server에서 socket request처리, ns는 옵션  
        > `// @SocketConnect (ns)` : socket 사용자 접속시, ns는 옵션  
        > `// @SocketDisconnect (ns)` : socket 사용자 분리시, ns는 옵션  
  
  
1. `@Controller` File
    - Express router 설정을 annotation으로 진행 합니다.
    - class상단에 `@Controller`를 추가해야합니다.
    - 모든 @Annotation은 `Comment`로 추가해야 합니다.
    
    ```JavaScript
        /** @Controller */
        /** @RequestMapping ('/v1') */
        export class LoginController{
	        constructor(){}
            
            /** @Starter () */
            start(){
                console.log('controller started.');
            }

            /** @RequestMapping ('/login/:id',get) */
            login_get(req,res,next){
                let userid = req.params.id;
                res.render('account/login',{userid}); 
            }
            /** @RequestMapping ('/login',post) */
            login_post(req,res,next){
                try{
                    let userid = req.body.param1;

                    console.log("express 문법을 따릅니다.");

                    res.status(200).json({result:"SUCCESS"});   //put:201
                }catch(e){
                    res.status(500).json({result:e});
                }
            }
            
            /** 여러개 파일 업로드 (uploadPath필수)
             * @anno1 : 경로
             * @anno2 : method type (files 고정값) -> (req.files :  파일정보)  
             * @anno3 : input의 name attribute 
               예) <input type="file" name="image"/>
            */
            /** @RequestMapping ('/imagesubmit',files,'image') */
            imageuploadSubmit(req,res,next){
                try{
                    for(var i in req.files){
                        const fileInfo = req.files[i];
                        console.log('이미 uploadPath에 파일은 저장됨.');
                        console.log('파일정보.(filepath:/202101/20/xx)',fileInfo);
                        this.service.insertFileManager(fileInfo);
                    }
                    
                    res.json({result:'SUCCESS'});
                }catch(e){
                    console.log(e);
                    res.json({errorMsg:e});
                }
            }
            
            /** 1개파일만 업로드 (uploadPath필수)
             * @anno1 : 경로
             * @anno2 : method type (file 고정값) -> (req.file :  파일정보)  
             * @anno3 : input의 name attribute 
               예) <input type="file" name="layout"/>
            */
            /** @RequestMapping ('/imagesubmit',file,'layout') */
            singleFileUploadSubmit(req,res,next){
                try{
                    const fileInfo = req.file;
                    console.log('이미 uploadPath에 파일은 저장됨.');
                    console.log('파일정보.(filepath:/202101/20/xx)',fileInfo);
                    this.service.insertFileManager(fileInfo);
                    res.json({result:'SUCCESS'});
                }catch(e){
                    console.log(e);
                    res.json({errorMsg:e});
                }
            }
        }
    ```
    - Controller에서만 사용 할수 있는 Method용 Annotation목록 입니다.  
        > `// @Starter()` : node실행할때 선행 실행된다.  
        > `// @RequestMapping ('/v1')` : class 밖의 RequestMapping은 전역 경로  
        > `// @RequestMapping ('/login',post)` : 전역과 더해진 router  
            ( method list: get, post, delete, put, patch, files, file, all, use )
1. `@Service` File
    - Service 상호간의 Inject가 가능 하도록 설계된 모듈  
    - class상단에 `@Service`를 추가해야합니다.  
    - 모든 @Annotation은 `Comment`로 추가해야 합니다.  
    - @Inject annotation으로 Component, Controller, Service에 추가 될수 있습니다.  
    - @Inject 할때 Service또는 Model을 inject한다. Service는 2depth까지 Inject가능  

    ```JavaScript
        /** @Service */
        class CommBoardService{
            constructor(){
                /** @Inject ('CommBoardMapper') */
                this.commonBoardMapper;
            }

            /** @Starter () */
            start(){
                console.log('service started.');
            }

            /**
            * Add List
            * @param vo : req.body
            */
            /** @Transactional () */
            setList(vo){
                const cnt = this.commonBoardMapper.getCount(vo);
                return true;
            }

            /** @Transactional ('REQUIRES_NEW','mongoose') */
            setList(vo){
                //transaction type of mongodb
                this.commonBoardMapper.setList(vo, cnt);
                
                return true;
            }
            /** @Transactional ('','sequelize') */
            setList(vo){
                //transaction type of sequelize
                this.commonBoardMapper.setOptList(vo, cnt);
                return true;
            }
            
        }
    ```
    - Service에서만 사용 할수 있는 Method용 Annotation 입니다.  
        > `// @Starter()` : node실행할때 선행 실행된다.  
        > `// @Transactional (['REQUIRED','REQUIRES_NEW'],['mongoose','sequlize'])` :  DB Transaction처리  
        ( 여러 DB를 동시 사용시 mongoose, sequelize를 수동으로 지정 해야함 )
                         
1. `@Model` File
    - Database(mongodb) 연결설정 Annotation입니다.  
    - class상단에 `@Model`를 추가해야합니다.  
    - 모든 @Annotation은 `Comment`로 추가해야 합니다.  
    - @Inject annotation으로 Component, Controller, Service에 추가 될수 있습니다.  
    - mode항목에 sequelize 또는 mongodb를 입력해서 구분
    - Sequelize
    ```JavaScript
        import {HetaSequelize} from 'hetamvc'
        /** @Model */
        export class FileManager extends HetaSequelize{
            init(Sequelize, options) {
                //options.indexes = [{ unique: false, fields: ['fileGroup']}];
                return this.model('filemanager', {
                    id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true},
                    fileGroup: {type: Sequelize.INTEGER.UNSIGNED,defaultValue: 0},	
                    fileName: {type: Sequelize.STRING(200)},
                    filePath: {type: Sequelize.STRING(100)},
                    mimeType:  {type: Sequelize.STRING(20)},
                    fileSize: {type: Sequelize.INTEGER.UNSIGNED,defaultValue: 0},
                    createUser: {type: Sequelize.STRING(16), allowNull: true},
                    createdAt: {type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), allowNull: false}
                    },
                    options
                );
            }
        }
    ```
    - MongoDB
    ```JavaScript
        import {HetaMongoose} from 'hetamvc'

        /** @Model */
        export class FileManager extends HetaMongoose{
            init(mongoose) {
                let schema = new mongoose.Schema({
                    id: { type: Number, required: true, unique: true },
                    fileGroup: {type: Number, default: 0},	
                    fileName: { type: String, required: true },
                    filePath: { type: String, required: true },
                    mimeType: { type: String, required: false },
                    fileSize: {type: Number,default: 0},
                    createUser: {type: String},
                    createdAt: { type : Date, default: Date.now } //timestamp
                },{
                    _id: true,
                    timestamps: true, 
                    collection: this.name //테이블명을 classname으로
                });
                
                return this.model(this.name, schema);
            }
        }
    ```
## 더 자세한 사용법
---  
구분 | 링크
------ | ------ 
메뉴얼 | [HetaJs](http://hetajs.com "Heta Js")



				
  
  
