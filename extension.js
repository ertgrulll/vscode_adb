const vscode = require("vscode");
const commands = require("./commands");
const functions = require("./functions");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  const store = context.globalState;

  let defaultDevice = store.get("default_device");
  let defaultPort = store.get("port");

  if (!defaultPort) {
    store.update("port", "5555");
    defaultPort = 5555;
  }

  let fastConnect = vscode.commands.registerCommand(
    "android-debug-bridge.fastConnect",
    async function () {
      try {
        if (defaultDevice == null) {
          await vscode.commands.executeCommand(
            "android-debug-bridge.setDefaultDevice"
          );

          if (!defaultDevice) return;
        }

        const devices = await functions.getDevices();

        for (let i = 0; i < devices.devices.length; i++) {
          const device = devices.devices[i];

          if (device.isOffline) continue;

          await functions.tcpip(defaultPort, device.serial);
        }

        await functions.connect(defaultDevice.ip, defaultPort);

        vscode.window.showInformationMessage(
          `Connected to ${defaultDevice.ip}:${defaultPort}`
        );
      } catch (err) {
        const message = err.name != null ? `${err.name}: ${err.message}` : err;
        vscode.window.showErrorMessage(message);
      }
    }
  );

  let connect = vscode.commands.registerCommand(
    "android-debug-bridge.connect",
    function () {
      commands.establishConnection(defaultPort);
    }
  );

  let devices = vscode.commands.registerCommand(
    "android-debug-bridge.devices",
    function () {
      commands.showDeviceList("Available Android devices");
    }
  );

  let restart = vscode.commands.registerCommand(
    "android-debug-bridge.restart",
    commands.restartServer
  );

  let usb = vscode.commands.registerCommand(
    "android-debug-bridge.usb",
    async function () {
      const devices = await functions.getDevices();
      for (let i = 0; i < devices.devices.length; i++) {
        const device = devices.devices[i];
        if (device.serial.includes(":")) {
          await functions.usb(device.serial);
        }
      }

      vscode.window.showInformationMessage("Restarted in usb mode");
    }
  );

  let setDefaultDevice = vscode.commands.registerCommand(
    "android-debug-bridge.setDefaultDevice",
    async () => {
      const device = await commands.showDeviceList(
        "Select device to set as default",
        true
      );

      if (!device) return;

      device["ip"] = await functions.getDeviceIp(device.serial);
      await store.update("default_device", device);
      defaultDevice = device;

      vscode.window.showInformationMessage(
        `Default device set to ${device.label}`
      );
    }
  );

  let setPort = vscode.commands.registerCommand(
    "android-debug-bridge.setPort",
    async function () {
      const port = await vscode.window.showInputBox({
        placeHolder: "Port number",
        prompt: "Port must be between 1024 and 65535",
        validateInput: portValidator,
      });

      if (port && !portValidator(port)) {
        await store.update("port", port);
        defaultPort = port;

        vscode.window.showInformationMessage(
          `Port set to ${port}, this port will be used to next connection`
        );
      }
    }
  );

  context.subscriptions.push(
    fastConnect,
    connect,
    devices,
    restart,
    usb,
    setDefaultDevice,
    setPort
  );
}

/**
 *
 * @param {string} value
 * @returns
 */
const portValidator = (value) => {
  let portNum = parseInt(value.trim());

  if (isNaN(portNum)) {
    return "Please enter a number";
  }

  if (portNum < 1024 || portNum > 65535) {
    return "Please enter a valid port number";
  }

  return null;
};

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
