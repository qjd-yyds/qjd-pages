#!/usr/bin/env node

process.argv.push("--cwd")
process.argv.push(process.cwd())
process.argv.push("--gulpfile")
process.argv.push(require.resolve("..")) // 文件路径
require("gulp/bin/gulp")