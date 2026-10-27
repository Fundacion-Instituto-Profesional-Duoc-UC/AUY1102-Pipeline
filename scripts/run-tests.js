const { spawnSync } = require("node:child_process");

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(
  npm,
  ["run", "test:unit", "--", "--coverage"],
  { stdio: "inherit", shell: process.platform === "win32" }
);

if (result.error) {
  console.error("No se pudieron iniciar las pruebas:", result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
