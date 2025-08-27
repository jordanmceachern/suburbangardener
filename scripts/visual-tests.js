#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");

console.log("🧪 Starting Visual Regression Tests...");
console.log("====================================");

// Function to run command and handle errors
function runCommand(command, description) {
  console.log(`\n📋 ${description}...`);
  try {
    execSync(command, {
      stdio: "inherit",
      cwd: path.resolve(__dirname, ".."),
    });
    console.log(`✅ ${description} completed successfully`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

// Main test execution
async function runTests() {
  try {
    // Check if screenshots should be updated
    const updateScreenshots = process.argv.includes("--update-snapshots");

    if (updateScreenshots) {
      console.log("🔄 Updating baseline screenshots...");
      runCommand(
        "npx playwright test --update-snapshots",
        "Updating visual test snapshots"
      );
    } else {
      console.log("🔍 Running visual regression tests...");
      runCommand(
        "npx playwright test tests/visual/",
        "Running visual regression tests"
      );
    }

    console.log("\n🎉 All visual tests completed!");
    console.log("\n📊 To view test results, run: npx playwright show-report");
  } catch (error) {
    console.error("💥 Test execution failed:", error.message);
    process.exit(1);
  }
}

// Help information
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
Visual Regression Test Runner

Usage:
  npm run test:visual              Run visual regression tests
  npm run test:visual:update       Update baseline snapshots
  
Options:
  --help, -h                       Show this help message
  --update-snapshots              Update baseline screenshots
  
Examples:
  npm run test:visual              # Run tests against existing snapshots
  npm run test:visual:update       # Update all baseline snapshots
  
After running tests, view results with:
  npx playwright show-report
`);
  process.exit(0);
}

// Run the tests
runTests();
