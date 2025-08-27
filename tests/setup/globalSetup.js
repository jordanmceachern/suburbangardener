const { execSync } = require("child_process");
const path = require("path");

module.exports = async () => {
  console.log("Setting up test environment...");

  // Start Next.js development server for testing
  console.log("Starting Next.js development server...");

  // Kill any existing process on port 3000
  try {
    execSync("lsof -ti:3000 | xargs kill -9", { stdio: "ignore" });
  } catch (error) {
    // Port 3000 is not in use, which is fine
  }

  // Start the development server in the background
  const server = execSync("npm run dev > /dev/null 2>&1 &", {
    cwd: path.resolve(__dirname, "../../"),
    stdio: "ignore",
  });

  // Wait for the server to start
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log("Test environment setup complete.");
};
