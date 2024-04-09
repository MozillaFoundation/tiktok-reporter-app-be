## Description

TikTok Reporter Backend API

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start
```

Than visit http://localhost:8080/api to access swagger

```bash
# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Installing Maxmind

To test file-based GeoIP lookup, you must install the `geoipupdate` package.

Details [here](https://github.com/maxmind/geoipupdate).

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Test e2e

Make sure to uncomment the proper lines for the migrations and entities line in the [data-source.ts](/src/database//data-source.ts) file

Because of the way the migrations are being used by development/deployment and e2e testing scenarios they need to be accessed from different locations. That is why some lines need to be commented for deployment/development and others for e2e testing.

```bash
# unit tests
$ npm run test:e2e
```

## Generating migrations

Make sure to uncomment the proper line for the migrations and entities line in the [data-source.ts](/src/database//data-source.ts) file.

```bash
$ npm run migration:generate -n src/database/migrations/
```

## License

[Mozilla Public License Version 2.0
](/LICENSE)
