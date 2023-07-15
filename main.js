/** 
 * To run locally in continous development( nodemon ) use:
 * - "npx electronmon ."
 */

const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');
const os = require('os');
const { resizeImage } = require('./helper');

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin'
let mainWindow = null;



function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'Image Resizer', // Name of App
    width: isDev ? 1000 : 500,
    height: 600,
    // ENABLING NODE FEATURES
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Open DevTools if in DEV Env
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

// Create 'About' Window
function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    title: 'About Image Resizer', // Name of App
    width: 300,
    height: 300,
  });
  aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
}

// Template for the App Menu Options
const menu = [{
  label: 'File',
  submenu: [{ //Create the Sub Options for the "File" Menu Option
    label: 'Exit App', // Name
    click: () => app.quit(), // After clicking
    accelerator: 'CmdOrCtrl+W' //Shortcut
  }]
}]
// Pre-Built Template Role with Menu Options
const menuWithRole = [
  ...(isMac ? [{
    label: app.name,
    submenu: [{
      label: 'About'
    }]
  }] : []),
  {
    role: 'fileMenu'
  },
  ...(!isMac ? [{
    label: 'Help',
    submenu: [{
      label: 'About',
      click: createAboutWindow,
    }]
  }] : []),
]


app.whenReady().then(() => {
  createMainWindow();

  // Implement custom Menu
  const mainMenu = Menu.buildFromTemplate(menuWithRole)
  Menu.setApplicationMenu(mainMenu);

  // Remove MainWindow from memory on close
  mainWindow.on('closed', () => mainWindow = null)

  // If window didnt load properly
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
});

// Communicate back and forth between Renderer
ipcMain.on('image:resize', (e, options) => {
  options.destination = path.join(os.homedir(), 'imageResizer')
  options.fileName = path.basename(options.imgPath)
  resizeImage(options).then(() => {

    // Send event string named image:done
    mainWindow.webContents.send('image:done')

    shell.openPath(options.destination)
  });


})




// If operating System isnt MAC, ensure the app closes.
app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})