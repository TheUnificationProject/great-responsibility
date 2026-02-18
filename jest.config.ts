import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts', '!src/swagger.ts'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@assets/(.*)$': '<rootDir>/assets/$1',
    '^@secrets/(.*)$': '<rootDir>/secrets/$1',
    '^@guards/(.*)$': '<rootDir>/src/guards/$1',
    '^@interceptors/(.*)$': '<rootDir>/src/interceptors/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@factories/(.*)$': '<rootDir>/test/factories/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
    'package.json': '<rootDir>/package.json',
  },
};

export default config;
