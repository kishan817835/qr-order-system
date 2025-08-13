const { spawn } = require("child_process");
const path = require("path");

console.log("🚀 Starting backend server...");

const backend = spawn("npm", ["start"], {
  cwd: path.join(__dirname, "backend"),
  stdio: "inherit",
  shell: true,
});

backend.on("error", (error) => {
  console.error("❌ Backend startup error:", error);
});

backend.on("close", (code) => {
  console.log(`🛑 Backend process exited with code ${code}`);
});

// Keep the process alive
process.on("SIGINT", () => {
  console.log("🛑 Shutting down backend...");
  backend.kill("SIGINT");
  process.exit(0);
});
