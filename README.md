// ���� [20140707]

# ����
 - ���� ��α׸� �����.
 - ���ϴ� ����� �߰��Ѵ�.

# �۾� �̷� ����
 - ./Work-History  

# ���� ���.
 1) ���� ȯ�� ���� ��.
 2) git clone https://github.com/elfmagic86/NodeBlog
 3) cd NodeBlog
 4) npm install (���� package.json�� ������ ��Ȯ�� �߰����� Ȯ�ξ���[0707])
 5) OAuth ��� �����ϵ��� ����.
  - �⺻���� ���� ���̵带 ����. ����ÿ� ������ �� �Ϻ� �����ص� ( ��ġ : ./Work-History/_Oauth.txt)
    +)  ./common/auth/oauth-config(example).js ����
       - �̸� ���� oauth-config.js
       - ���� ����(yourKey, youSecret, callbackUrl)
  ////////// �� �Ʒ��� ������ �� ����. ������̴�.
    +) ���� ���
       - app.js��  ���� app.use(express.session({ secret: 'secret'}));
    +) passport �߰�
       - app.js�� ���� app.set('passport', passport);
          ; �⺻ passport�� ��¦ ������ ������ ���. ������ ����(./common/auth/oauth-passport.js) ����.
    +) ������ ���� �ݹ� �ּ� �� ���ε� �� ����.
      -  authCallback �Լ� ���� (��ġ : ./common/auth/oauth-passport.js )
      -  ���� ���� (��ġ : ./routes/auth.js)

    +) profile to user 
      - ./domain/User.js  
        ; .createBy(profile) ���⿡ ����� ��Ƶ�.
    +) db�� ���� �� ��������..
      - ./DAO/userDAO

  /////////// OAuth ������ �� ���� ��

 6) mongodb ����. (�������� mongodb ���̵� ����.)
 7) node app

# �׽�Ʈ ����
  - mocha run (��ġ : ./tests) (�Ҿ��� [20147070])
      

# ���� ȯ��.
 - OS : windows7
 - AppServer : nodejs
 - AppClient : chrome
 - DbServer : mongodb
 - DbClient : mongoose
 - WebFramework : express(view: ejs)
 - UI : BootStrap
 - Test framework : mocha (+shouldjs)

 - IDE : eclipse(�ڵ� ������θ� ���)

 - DebugingTool : node-inspector + chrome browser
 - Debuging && Run ���� ���� : mingw32(windows���� git ����ϱ� ���� ���Ǵ� ����[�����ܼ�? �����̶� Ī�ؾ����� �𸣰ڴ� [20140707])

# ��Ÿ
 - ���� ���� : ���� ����.


