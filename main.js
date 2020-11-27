"use strict"

const electron = require('electron')
const { app, BrowserWindow } = electron

// server below
const express = require('express')
const appExpress = express()
const http = require('http').Server(appExpress)
const io = require('socket.io')(http)
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser')

appExpress.use(bodyParser.json())

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let invisibleWindow, mainWindow

function createWindow() {
  // Create the browser window.

  // 画面サイズを取得
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize

  mainWindow = new BrowserWindow({
    width: 320,
    height: 240,
  })

  invisibleWindow = new BrowserWindow({
    width,
    height,
    frame: false, //　ウィンドウフレーム非表示
    transparent: true,  //背景を透明に
    alwaysOnTop: true,  //常に最前面
  })


  // 透明な部分のマウスのクリックを検知させない
  invisibleWindow.setIgnoreMouseEvents(true)

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  invisibleWindow.loadFile('invisible.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  invisibleWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    invisibleWindow = null
    mainWindow = null
  })

  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    invisibleWindow = null
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.



// 透明画面にメッセージを送る
function sendToRendererContent(slackText) {
  // mainWindow.webContents.on('did-finish-load', () => {
  // レンダラー側のonが実行される前に送るとエラーで落ちるので注意
  invisibleWindow.webContents.send('slackContent', slackText)
  // })
}



//// Slack Outgoing Web Hook
const { RTMClient } = require('@slack/client')
const token = require('./account.json').token

const rtm = new RTMClient(token, { logLevel: 'debug' })

rtm.start()

io.on('connection', function (socket) {
  socket.on('message', function (msg) {
      io.emit('message', msg)
  })
})

appExpress.post('/slack', function (req, res) {
  sendToRendererContent(req.body.text)

  const { type, event } = req.body

  if (type === 'challenge') {
      // 認証用リクエストなので、特に何もしない
  } else if (type === 'event_callback') {
      console.log(event.text)
      io.emit('message', event.text)
  }

  res.status(200).json(req.body)

})

http.listen(PORT, function () {
  console.log('server listening. Port:' + PORT)
})
