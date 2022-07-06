console.log('Loading preload...')

const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld("electron", {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(
        channel,
        (event, ...args) => func(args)
    )
})