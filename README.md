## Description

TikTok Reporter Reporter Backend API

## Installation

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
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Test
Make sure to uncomment the proper the migrations and entities line in the [data-source.ts](/src/database//data-source.ts) file
```bash
# unit tests
$ npm run test:e2e
```

## Generating migrations
Make sure to uncomment the proper the migrations and entities line in the [data-source.ts](/src/database//data-source.ts) file
```bash
$ npm run migration:generate -n src/database/migrations/
```

## License
[Mozilla Public License Version 2.0
](/LICENSE)