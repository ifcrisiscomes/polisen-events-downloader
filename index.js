const fetch = require('node-fetch');
const fse = require('fs-extra');
const tableify = require('tableify');
const css = fse.readFileSync('./node_modules/tableify/style.css');

const jsonPath = "/data/events.json";
const filePath = "/data/index.html";

const updateTime = 60000;

download();

async function download() {
    console.log('Start downloading', new Date());
    try {
        const res = await fetch('https://polisen.se/api/events');
        const json = await res.json();

        console.log('Download complete', new Date());

        await fse.ensureFile(jsonPath);

        let previousJson;
        try {
            previousJson = await fse.readJson(jsonPath);
        }
        catch(e) {}

        let writeJson = false;
        if(json.length) {
            if(!previousJson || !previousJson.length) {
                writeJson = true;
            }
            else {
                if(json[0].id !== previousJson[0].id) {
                    writeJson = true;
                }
            }
        }

        if(writeJson) {
            const html = 
                        '<html><head><meta charset="UTF-8">' +
                        '<style>' + css + '</style>' +
                        '</head>' + 
                        '<body>' + tableify(json) + '</body>';
 
            await fse.outputFile(filePath, html);
            await fse.outputJson(jsonPath, json);
            console.log('Writing to file complete', new Date());
        }
        else {
            console.log('Nothing to update in JSON')
        }
        
    }
    catch(e) { 
        console.error(e);
    }
    setTimeout(download, updateTime);
}