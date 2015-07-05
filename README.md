
# 소 개 #

**무엇**
 - Blog

**동기**
 - 학습, 포트폴리오, 그리고 실제 사용을 목표로 시작한 프로젝트.

**현재**
 - angularjs 적용.

---

# Demo #
 + [Homepage](http://elfmagic2.herokuapp.com/)
 + [Log in testUser](http://elfmagic2.herokuapp.com/test)
 + [Admin page after login testUser](http://elfmagic2.herokuapp.com/#/admin)

---

# Features #
 + Blog board (CRUD, search)
 + Blog board comments
 + Blog board category
 + Blog board history
 + Blog board ordering by tabs
 + Blog board pagination
 + File upload and download(using cloudinary. some slow.)
 + Social login( github, twitter, facebook, linkedin, google)
 + Javascript loader and editor

---

# How to test in local #

 1. git clone https://github.com/elfmagic86/AngularBlog
 2. cd AngularBlog
 3. npm install
 4. run server
  1. start mongodb server (default port)
  2. node server/bootstrap.js
 5. [http://localhost:3000](http://localhost:3000)

- you can only login [testUser](http://localhost:3000/test) because not included configs

---

# Development Environment #
  + ***Common*** 
   - OS : windows7
   - Browser(user-agent) : chrome
   - CodeEditor : eclipse 

  + ***Back-End***
   - AppServer : nodejs + express
   - DBServer  : mongodb + mongoose
   - Test framework : mocha +shouldjs
   - Debugging tool : node-inspector + chrome

  + ***Front-End***
   - AppFramework : angularjs , bootstrap
   - Test Runner : karma , chrome
   - Test framework : jasmine
   - Debugging tool : chrome

---

# etc
 - 현재 작업 상태에 대해서는 Work-History의 최신 날짜의 기록을 확인.