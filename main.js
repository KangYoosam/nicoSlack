"use strict"

const electron = require('electron')
const { app, BrowserWindow } = electron

const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let invisibleWindow

function createWindow() {
  // 画面サイズを取得
  const { width, height } = electron.screen.getPrimaryDisplay().size

  invisibleWindow = new BrowserWindow({
    left: 0,
    top: 0,
    width,
    height,
    frame: false, //　ウィンドウフレーム非表示
    transparent: true,  //背景を透明に
    alwaysOnTop: true,  //常に最前面
  })

  // 透明な部分のマウスのクリックを検知させない
  invisibleWindow.setIgnoreMouseEvents(true)
  invisibleWindow.maximize();

  // and load the index.html of the app.
  // invisibleWindow.loadFile('invisible.html')
  // invisibleWindow.loadURL('file://' + __dirname + '/index.html')
  invisibleWindow.loadURL('file://' + path.join(__dirname, 'index.html'))

  // Emitted when the window is closed.
  invisibleWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    invisibleWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (invisibleWindow === null) {
    createWindow()
  }
})
