import { parse } from 'csv-parse'
import fs from 'node:fs'

const csvPath = new URL('../repository/tasks.csv', import.meta.url)

const stream = fs.createReadStream(csvPath)

const csvParse = parse({
    delimiter: ',',
    from_line: 2,
    skip_empty_lines: true,
})

async function import_csv(){
    const linesCSV = stream.pipe(csvParse)

    for await (const line of linesCSV){
        const [title, description] = line

        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title, description
            })
        })
    }
}

import_csv()

function wait(ms){
    return new Promise((resolve) => setTimeout(resolve, ms))
}

