const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
function createWindow() {

    var win = new BrowserWindow({
        icon: __dirname + '/logo512.png',
        width: 320,
        height: 452,
        show: false,
        resizable: false
    });

    win.removeMenu();
    win.on('ready-to-show', function(){
        win.show();
    });

    if(isDev){
        win.setAlwaysOnTop(true, 'screen');
        win.openDevTools({mode:'undocked'});
        win.loadURL('http://localhost:3000');
    } else{
        win.loadFile('build/index.html');
    }

}
app.on('ready', createWindow);