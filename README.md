## Description

basic [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

1. install dependencies.

```bash
$ npm install
```

2. Create `.env` file using `.env.example`  a template, e.g.

```bash
$ cp ./env.example ./env
```

## Running the app

```bash
# development with watch mode.
$ npm run start:dev

# production mode.
$ npm run start:prod
```

## Testing the app

```bash
# run unit/integration tests.
$ npm run test

# detect current changes and execute just the involved Test Suites.
$ npm run test:ut:develop

# run unit/integration tests with code coverage.
$ npm run test:cov
```

## Local Full build 
```bash
# Analog CI pipeline local execution.
$ npm run local:ci
```