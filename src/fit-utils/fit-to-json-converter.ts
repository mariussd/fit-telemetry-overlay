import {parseFitFile} from './fit-parser'

const file = Bun.file('./public/telemetry.fit')

file.arrayBuffer().then((content) => {
  parseFitFile(content).then((data) => {
    writeToFile('test.json', data)
  })
})

function writeToFile(fileName: string, data: object) {
  console.log('Writing to file...')
  Bun.write(`./out/${fileName}`, JSON.stringify(data)).then(() => {
    console.log('File written')
  })
}