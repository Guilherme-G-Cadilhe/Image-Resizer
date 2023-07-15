const { contextBridge, ipcRenderer } = require('electron')
const os = require('os');
const path = require('path');
const Toastify = require('toastify-js')

/** EXAMPLE
 * Exposes Node Functions via Electron
 * Define an Api 'name' property that can be accessed globally;
 * Define its Functions or Variables
 */
contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // we can also expose variables, not just functions
})
// Access it by "versions.node()" on the Web Script

// ---- MAIN FUNCTIONS -----
contextBridge.exposeInMainWorld('os', {
  homedir: () => os.homedir(),
})
contextBridge.exposeInMainWorld('path', {
  join: (...args) => path.join(...args),
})
contextBridge.exposeInMainWorld('Toastify', {
  toast: (options) => Toastify(options).showToast(),
})

// IpcRenderer is the way to communicate back with the Electron Main process, from the renderer.
contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
})