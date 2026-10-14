const envFile = Bun.file('.env.local')

function start(command: string[]) {
  return Bun.spawn(command, {
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
  })
}

async function hasConvexUrl() {
  if (!(await envFile.exists())) {
    return false
  }

  const contents = await envFile.text()
  return /^VITE_CONVEX_URL=.+$/m.test(contents)
}

const convex = start(['bunx', 'convex', 'dev'])

while (!(await hasConvexUrl())) {
  if (convex.exitCode !== null) {
    process.exit(convex.exitCode ?? 1)
  }

  await Bun.sleep(500)
}

const vite = start(['bun', 'run', 'dev:client'])
const completed = await Promise.race([
  convex.exited.then((exitCode) => ({ name: 'Convex', exitCode })),
  vite.exited.then((exitCode) => ({ name: 'Vite', exitCode })),
])

console.error(`${completed.name} exited. Stopping the other dev process.`)
convex.kill()
vite.kill()
process.exit(completed.exitCode)
