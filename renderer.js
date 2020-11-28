
NicoJS = require('nicoJS')
const { ipcRenderer } = require('electron')

const Echo = require('laravel-echo')
window.Pusher = require('pusher-js');

var nico = new NicoJS({
  app: document.getElementById('app'),
  width: 1500,
  height: 400,
  font_size: 60,
  color: '#fff'
})

// コメント待機
nico.listen()

// コメント送信
// nico.loop(['Hello World.'])

ipcRenderer.on('message', (event, text) => {
  nico.send(text)
})

const createdEcho = new Echo({
  broadcaster: 'pusher',
  key: 'local',
  wsHost: '127.0.0.1',
  wsPort: 6001,
  forceTLS: false,
  disableStats: true,
})

createdEcho.channel('event-topic')
  .listen('EventTopicWasCreated', event => {
    nico.send(event.topic.content)
  })
