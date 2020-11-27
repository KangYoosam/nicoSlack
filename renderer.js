
NicoJS = require('nicoJS')
const { ipcRenderer } = require('electron')

var nico = new NicoJS({
  app: document.getElementById('app'),
  width: 1500,
  height: 400,
  font_size: 50,
  color: '#fff'
})

// コメント待機
nico.listen()

// コメント送信
// nico.loop(['Hello World.'])

ipcRenderer.on('message', (event, text) => {
  nico.send(text)
})
