const path = require('path');
const remote = require('electron').remote
const app = remote.app;

var xmlData = app.getPath('downloads');
this.path = path.join(xmlData + '/' + 'downloads/' + startDate + '_' + endDate + 'P' + pageNumber + '.xml');
fs.writeFile(this.path, body);

function test() {
    console.log("Export...");
}