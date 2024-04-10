const { app, BrowserWindow } = require("electron");
const path = require("node:path");
const { PythonShell } = require("python-shell");

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");

  // PythonShell用オプションの宣言
  let options = {
    mode: "text",
    pythonOptions: ["-u"],
  };

  // PythonShellの宣言
  let pythonShell = new PythonShell("./test.py", options);

  // Pythonからメッセージの受け取り
  pythonShell.on("message", (msg) => {
    console.log("recieve:");
    console.log(msg);
  });

  // Pythonからエラーの受け取り
  pythonShell.on("error", (err) => {
    console.log("ERROR:");
    console.err(err);
  });

  // Pythonへメッセージの送信
  pythonShell.send("hello world");

  // Pythonの終了
  pythonShell.end((err, code, signal) => {
    if (err) {
      console.log(err);
    } else {
      console.log("The exit code was: " + code);
      console.log("The exit signal was: " + signal);
      console.log("finished");
    }
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
