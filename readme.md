# macOSpilot: Your Personal macOS AI Assistant

macOSpilot is your on-demand AI assistant that answers questions within any macOS application. Simply trigger the assistant with a keyboard shortcut, ask your question by voice or text, and receive an audio and text response directly overlaid on your current window.

## Features

- **Application Agnostic**: Works seamlessly across all macOS applications.
- **Easy Activation**: Trigger the assistant with a simple keyboard shortcut.
- **Dual Input Modes**: Ask questions using either voice or text.
- **In-Context Answers**: Responses are displayed and read aloud, overlaying your current application window.

## How It Works

1. **Setup**: macOSpilot is built on NodeJS/Electron. Start by installing the project and its dependencies.
2. **Activation**: Use the configured keyboard shortcut to activate macOSpilot, which captures a screenshot of your active window and starts the microphone.
3. **Interaction**: Ask your question and end the input with the same keyboard shortcut. For text input, type your question and press enter.
4. **Processing**: The question is transcribed using OpenAI's Whisper API and analyzed along with the screenshot by OpenAI's Vision API.
5. **Response**: The answer is displayed in a notification window and read aloud using text-to-speech technology.
6. **Session History**: Answers are stored temporarily for the session in a manageable history window.

## Installation

Ensure NodeJS is installed on your machine. Clone the repository and install dependencies:
bash

git clone https://github.com/elfvingralf/macOSpilot-ai-assistant.git
cd macOSpilot-ai-assistant
yarn install  # or npm install

Run the application:
bash

yarn start or npm start


## Configuration

Access the settings through the icon in the main window's top right corner:

- **API Key**: Add your OpenAI API key (note: not stored encrypted).
- **Keyboard Shortcut**: Default is "CommandOrControl+Shift+'". Change as needed.
- **Input Methods**: Choose between voice or text input.
- **Window Sizes and Settings**: Adjust the dimensions and opacity of the windows.

## Packaging as an App

Convert to an executable `.app` for macOS:
bash
npm run package-mac


Find the executable in `/release-builds/` under your platform's folder. Initial setup might require granting necessary permissions.

## Planned Improvements

- Persistent conversation state across sessions.
- In-memory processing for screenshots and audio to enhance performance.
- Configurable audio playback settings and always-on-top window behavior.
- Improved screenshot functionality with selectable areas.

## License

macOSpilot is open-sourced software licensed under the MIT license. This license permits use, modification, and distribution of the software for any purpose, provided that the original copyright and permission notice are included with any substantial portions of the software.
