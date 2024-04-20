const { BrowserWindow, screen } = require('electron');
const path = require('path');

// Configuration for window sizes and properties
const windowConfig = {
  mainWindow: { width: 600, height: 400 },
  notificationWindow: { width: 300, height: 100, opacity: 0.8 },
  textInputWindow: { width: 300, height: 100 }
};

let mainWindow, notificationWindow, textInputWindow;

function createMainWindow() {
  if (!mainWindow) {
    mainWindow = new BrowserWindow({
      width: windowConfig.mainWindow.width,
      height: windowConfig.mainWindow.height,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    mainWindow.loadFile(path.join(__dirname, '..', 'views', 'index.html'));
    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }
  return mainWindow;
}

function createNotificationWindow() {
  if (!notificationWindow) {
    notificationWindow = new BrowserWindow({
      width: windowConfig.notificationWindow.width,
      height: windowConfig.notificationWindow.height,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      opacity: windowConfig.notificationWindow.opacity,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    notificationWindow.loadFile(path.join(__dirname, '..', 'views', 'notifications.html'));
    notificationWindow.on('closed', () => {
      notificationWindow = null;
    });
  }
  return notificationWindow;
}

function createTextInputWindow() {
  if (!textInputWindow) {
    textInputWindow = new BrowserWindow({
      width: windowConfig.textInputWindow.width,
      height: windowConfig.textInputWindow.height,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    textInputWindow.loadFile(path.join(__dirname, '..', 'views', 'textInput.html'));
    textInputWindow.on('closed', () => {
      textInputWindow = null;
    });
  }
  return textInputWindow;
}

async function repositionWindow(window, position) {
  if (!window) return;

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  let newX, newY;
  switch (position) {
    case 'notificationWindow':
      newX = width - windowConfig.notificationWindow.width - 10;
      newY = 10;
      break;
    case 'textInputWindow':
      newX = (width / 2) - (windowConfig.textInputWindow.width / 2);
      newY = (height / 2) - (windowConfig.textInputWindow.height / 2);
      break;
    default:
      newX = 10;
      newY = 10;
  }

  // Ensure the window is within the visible screen bounds
  newX = Math.max(0, Math.min(newX, width - windowConfig.notificationWindow.width));
  newY = Math.max(0, Math.min(newY, height - windowConfig.notificationWindow.height));

  window.setPosition(newX, newY);
}

function closeAllWindows() {
  if (mainWindow) {
    mainWindow.close();
  }
  if (notificationWindow) {
    notificationWindow.close();
  }
  if (textInputWindow) {
    textInputWindow.close();
  }
}

module.exports = {
  createMainWindow,
  createNotificationWindow,
  createTextInputWindow,
  repositionWindow,
  closeAllWindows
};