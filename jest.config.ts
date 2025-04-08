/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  transform: {
    "^.+\.(t|j)sx?$": ["@swc/jest"],
  },
  clearMocks: true,
  coverageProvider: "v8",
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  }
};