# SUMIT backend

페이지 에디팅 서비스 Sumit의 Page, Slide, Block을 관리하는 백엔드 서버입니다.

## Installation

1. 이 레포지토리를 clone 합니다.
2. 해당 폴더에 ormconfig.json 파일을 생성하고, 노션 > 로그인 정보에 있는 json 텍스트를 입력하고 저장합니다.
3. 아래 커멘드를 실행합니다

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```

## API document

App을 실행한 후, [localhost:8000/api](localhost:8000/api)로 접속하면 swagger docs를 확인할 수 있습니다.

## Test

```bash
# unit tests
$ npm run test

# unit test with watch mode
$ npm run test:watch

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
