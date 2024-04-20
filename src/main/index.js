const { app, ipcMain, globalShortcut, systemPreferences, BrowserWindow } = require("electron");
const path = require("path");
const { createMainWindow, createNotificationWindow, createTextInputWindow, repositionWindow, closeAllWindows } = require("./windowManager");
const { getApiKey, setApiKey, getSetting, setSetting } = require("./configManager");
const { transcribeUserRecording, callVisionAPI, playVisionApiResponse } = require("./apiManager");

// Set configs and placeholder variables
const keyboardShortcut = "CommandOrControl+Shift+'"; // Keyboard shortcut that triggers the app
let isRecording = false;
let inputMethod = getSetting("inputMethod", "voice");

// Initialize the main window and other components when Electron app is ready
app.whenReady().then(() => {
  createMainWindow();
  createNotificationWindow();

  // Request microphone access
  systemPreferences.askForMediaAccess("microphone").then(accessGranted => {
    if (!accessGranted) {
      console.log("Microphone access denied");
    }
  }).catch(err => {
    console.error("Error requesting microphone access:", err);
  });

  // Register global keyboard shortcut
  globalShortcut.register(keyboardShortcut, async () => {
    let activeWindow = await activeWin(); // Get the currently active window
    if (!isRecording) {
      // Start recording logic
      if (inputMethod === "voice") {
        mainWindow.webContents.send("start-recording");
        notificationWindow.webContents.send("start-recording");
        isRecording = true;
      } else {
        // Open text input window if not using voice
        if (!textInputWindow) {
          createTextInputWindow();
        }
        repositionWindow(activeWindow, "textInputWindow");
      }
    } else {
      // Stop recording logic
      mainWindow.webContents.send("stop-recording");
      notificationWindow.webContents.send("stop-recording");
      isRecording = false;

      // Process recording
      const transcription = await transcribeUserRecording(path.join(tempFilesDir, "macOSpilotAudioInput.mp3"));
      if (transcription) {
        const visionResponse = await callVisionAPI(path.join(tempFilesDir, "macOSpilotScreenshot.png"), transcription);
        playVisionApiResponse(visionResponse);
      }
    }
  });

  // Additional app.on events as needed
});

// IPC event listeners for handling API key storage/access, input method changes, etc.
ipcMain.on("submit-api-key", (event, apiKey) => {
  setApiKey(apiKey);
});

ipcMain.on("request-api-key", (event) => {
  const apiKey = getApiKey();
  event.reply("send-api-key", apiKey); // Consider masking the API key if necessary
});

ipcMain.on("set-input-method", (event, method) => {
  setSetting("inputMethod", method);
  inputMethod = method;
});

ipcMain.on("request-input-method", (event) => {
  const method = getSetting("inputMethod", "voice");
  event.reply("send-input-method", method);
});

// Ensure the app quits when all windows are closed (except on macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Re-create the main window when the app is activated (macOS)
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// Clean up on app quit
app.on("will-quit", () => {
  // Unregister all shortcuts when the application is about to quit
  globalShortcut.unregisterAll();
  closeAllWindows();
});