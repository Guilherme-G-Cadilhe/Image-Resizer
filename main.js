/** 
 * To run locally in continous development( nodemon ) use:
 * - "npx electronmon ."
 */

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin'



function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Image Resizer', // Name of App
    width: isDev ? 1000 : 500,
    height: 600,
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

  // If window didnt load properly
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
});



// If operating System isnt MAC, ensure the app closes.
app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})