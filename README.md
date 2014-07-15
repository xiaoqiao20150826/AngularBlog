// 변경 [20140707]

# 목적
 - 개인 블로그를 만든다.
 - 원하는 기능을 추가한다.

# 작업 이력 폴더
 - ./Work-History  

# 실행 방법.
 1) 개발 환경 구축 후.
 2) git clone https://github.com/elfmagic86/NodeBlog
 3) cd NodeBlog
 4) npm install (현재 package.json에 의존성 정확히 추가한지 확인안함[0707])
 5) OAuth 사용 가능하도록 설정.
  - 기본적인 것은 가이드를 참고. 적용시에 문제된 것 일부 정리해둠 ( 위치 : ./Work-History/_Oauth.txt)
    +)  ./common/auth/oauth-config(example).js 변경
       - 이름 변경 oauth-config.js
       - 내용 변경(yourKey, youSecret, callbackUrl)
  ////////// 이 아래는 연관된 것 나열. 참고용이다.
    +) 세션 사용
       - app.js의  설정 app.use(express.session({ secret: 'secret'}));
    +) passport 추가
       - app.js의 설정 app.set('passport', passport);
          ; 기본 passport를 살짝 응용한 파일을 사용. 의존성 파일(./common/auth/oauth-passport.js) 참고.
    +) 인증에 대한 콜백 주소 및 바인딩 된 서비스.
      -  authCallback 함수 참고 (위치 : ./common/auth/oauth-passport.js )
      -  파일 참고 (위치 : ./routes/auth.js)

    +) profile to user 
      - ./domain/User.js  
        ; .createBy(profile) 여기에 방법을 모아둠.
    +) db에 저장 및 가져오기..
      - ./DAO/userDAO

  /////////// OAuth 연관된 것 관련 끝

 6) mongodb 실행. (실행방법은 mongodb 가이드 참고.)
 7) node app

# 테스트 실행
  - mocha run (위치 : ./tests) (불안정 [20147070])
      

# 개발 환경.
 - OS : windows7
 - AppServer : nodejs
 - AppClient : chrome
 - DbServer : mongodb
 - DbClient : mongoose
 - WebFramework : express(view: ejs)
 - UI : BootStrap
 - Test framework : mocha (+shouldjs)

 - IDE : eclipse(코드 편집기로만 사용)

 - DebugingTool : node-inspector + chrome browser
 - Debuging && Run 실행 도구 : mingw32(windows에서 git 사용하기 위해 사용되는 도구[도스콘솔? 무엇이라 칭해야할지 모르겠다 [20140707])

# 기타
 - 진행 상태 : 아직 멀음.


