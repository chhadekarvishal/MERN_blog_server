module.exports = {
  testEnvironment: "node", // Use node environment for running tests
  verbose: true, // Display individual test results with descriptions
  collectCoverage: true, // Enable code coverage reporting
  coverageDirectory: "coverage", // Directory where coverage results are stored
  collectCoverageFrom: ["<rootDir>/api/**/*.js"], // Specify the files to collect coverage from
  coverageReporters: ["text", "lcov"], // Types of report formats
};
