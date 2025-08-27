const { execSync } = require("child_process");

module.exports = async () => {
  console.log("Tearing down test environment...");

  // Kill the development server
  try {
    execSync("lsof -ti:3000 | xargs kill -9", { stdio: "ignore" });
    console.log("Development server stopped.");
  } catch (error) {
    // Server was already stopped
  }

  console.log("Test environment teardown complete.");
};
