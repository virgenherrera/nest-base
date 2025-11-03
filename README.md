# NestJs Base

(mejora esto)

## Description

(mejora esto)

## Table of Contents

- [Project setup](#project-setup)
  - [Install Dependencies](#install-dependencies)
  - [Environment Variables](#environment-variables)
- [Compile and run the project](#compile-and-run-the-project)
- [Run tests](#run-tests)
- [Develop tests](#develop-tests)
- [Auto-Format](#auto-format)
- [Local CI (test script)](#local-ci-test-script)
- [Mitigate Tech Debt (bumpDependencies script)](#mitigate-tech-debt-bumpdependencies-script)
- [NestJS Auto-Namespaced Configuration](#nestjs-auto-namespaced-configuration)
  - [Creating a New Configuration](#creating-a-new-configuration)
  - [Injecting the Configuration](#injecting-the-configuration)
- [Beyond Configuration](#beyond-configuration)
- [Coverage Reports](#coverage-reports)
- [Generating API Docs](#generating-api-docs)

## Project setup

This project requires `Node.js` and `PNPM` as specified in the package.json `engines`.
Visit [Node.js](https://nodejs.org/en/) to install the recommended version of Node,
and [pnpm.io](https://pnpm.io/) for PNPM.
Once both are installed, run the command below to set up the project.

### Install Dependencies

Use the following command to install all required dependencies and set up your development environment.

```bash
pnpm install
```

### Environment Variables

This project requires certain environment variables to run properly.
You can either set them at the system level or copy the **.env.example**
file to a new **.env** file and define your variables there.

## Compile and run the project

Below are the scripts for compiling and running the application.
Use `start:dev` for watch mode during development and `start:prod`
for a production-ready build.

```bash
# development watch mode
pnpm run start:dev

# production mode
pnpm run start:prod
```

## Run tests

Use the following scripts to verify code quality and functionality.
`test:static` performs static analysis through linting,
`test:unit` runs unit tests for individual components,
and `test:e2e` checks end-to-end workflows.

```bash
# static tests
pnpm run test:static

# unit tests
pnpm run test:unit

# e2e tests
pnpm run test:e2e
```

## Develop tests

The scripts `watch:UT` and `watch:E2E` run tests in watch mode, which could help to accelerate test-driven development.

```bash
# Develop Unit Tests
pnpm run watch:UT

# Develop end-to-end Tests
pnpm run watch:E2E
```

## Auto-Format

This project will run code formatting checks. It’s also configured to run automatically via Husky on every commit, ensuring a consistent code style.

## Local CI (test script)

When you run `pnpm run test`, it simulates the checks that would occur in the CI  pipeline, like running:

- Static tests.
- Unit tests.
- E2E tests.
- Build App.
- Build ApiDocs.

```bash
# simulate locally the CI process
pnpm run test
```

## Mitigate Tech Debt (bumpDependencies script)

This script attempts to update dependencies to mitigate technical debt.
However, it will only complete successfully if all tests pass, preventing updates that introduce breaking changes.

```bash
# Attempts to update project's dependencies
pnpm run bumpDependencies
```

## NestJS Auto-Namespaced Configuration

This project automatically loads configuration files placed under `/src/config/*.config.ts`.
Each of these config files follows the structure recommended by
[NestJS Configuration Docs](https://docs.nestjs.com/techniques/configuration#configuration-namespaces),
including class-based validation and the `.KEY` property for namespaced injection.

### Creating a New Configuration

1. **Create** a file named `foo.config.ts` inside `/src/config/`.
2. **Define and export** a class (e.g., `FooConfig`)
   **The `@Expose({ name: 'YOUR_ENV_VAR' })` decorator is crucial**
   because this project uses that name to match against the actual environment variable
   (e.g., `process.env.YOUR_ENV_VAR`) before validation.
   You can also use any `class-validator` decorators (e.g., `@IsOptional`, `@IsBoolean`, etc.)
  to ensure each environment variable meets your constraints:

   ```ts
   export class FooConfig {
     //Property to find inside process.env
     @Expose({ name: 'FOO_VALUE' })
     // in this case will be process.env.FOO_VALUE
     @IsNotEmpty()
     readonly foo: string;
   }
   ```

### Injecting the Configuration

To access any namespaced config within your controllers/services, you must inject the InjectConfig decorator. For example:

   ```ts
   import { Injectable } from '@nestjs/common';
   import { FooConfig } from '../config/foo.config'; // <- Adjust path as needed
   import { InjectConfig } from '../decorators';  // <- Adjust path as needed

   @Injectable()
   export class FooService {
     constructor(@InjectConfig(FooConfig) private readonly fooCfg: FooConfig) {}

     getFooValue() {
       return this.fooCfg.foo;
     }
   }
   ```

## Beyond Configuration

Aside from the namespaced configuration setup, the rest of the development process
is the same as any other NestJS application. You can integrate various techniques and libraries based on your needs, such as:

- [Prisma Integration](https://docs.nestjs.com/recipes/prisma)
- [MongoDB](https://docs.nestjs.com/techniques/mongodb)
- [Cookies & Sessions](https://docs.nestjs.com/recipes/session)
- [HTTP Module](https://docs.nestjs.com/techniques/http-module)
- [Task Scheduling](https://docs.nestjs.com/techniques/task-scheduling)

For a full list of NestJS techniques and recipes, check out the
[official NestJS documentation](https://docs.nestjs.com/).

## Coverage Reports

Coverage results are split into **unit** and **end-to-end** categories. You can find them under:

- Unit Tests
  - [index.html](coverage/unit/index.html) (human-readable report)
  - [coverage-final.json](coverage/unit/coverage-final.json) (CI-compatible report)
- end-to-end Tests
  - [index.html](coverage/e2e/index.html) (human-readable report)
  - [coverage-final.json](coverage/e2e/coverage-final.json) (CI-compatible report)

## Generating API Docs

This project includes a script to build OpenAPI specification files.
By running `pnpm run build:api-docs`, you will generate:

- **[open-api.json](api-docs/open-api.json)**, containing the OpenAPI definition
