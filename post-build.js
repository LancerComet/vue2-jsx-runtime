const tsfmt = require('typescript-formatter')
const fs = require('fs')
const path = require('path')

console.log('Start post build...')

formatDist()

async function formatDist () {
  console.log('Start formatting dist files...')

  const distPath = path.resolve(__dirname, './dist')
  if (!fs.existsSync(distPath)) {
    console.log('No dist folder, exit.')
    return
  }

  const tsFiles = getAllFiles(distPath)
    .filter(item => item.endsWith('.ts'))

  await tsfmt.processFiles(tsFiles, {
    replace: true,
    editorconfig: true,
    tslint: false
  })

  console.log('Dist formatting done.')
}

function getAllFiles (dirPath) {
  let result = []

  const files = fs.readdirSync(dirPath)
  for (const filePath of files) {
    const fullPath = path.resolve(dirPath, filePath)
    const stat = fs.statSync(fullPath)
    if (!stat.isDirectory()) {
      result.push(fullPath)
    } else {
      result = result.concat(getAllFiles(fullPath))
    }
  }

  return result
}
