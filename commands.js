const functions = require("./functions");
const vscode = require("vscode");

const establishConnection = async (port) => {
  try {
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "ADB",
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: "Disconnecting from connected device..." });
        await functions.disconnect();

        progress.report({ message: "Waiting device selection..." });
        const result = await showDeviceList("Select device to connect");

        if (!result) return;

        progress.report({ message: "Connecting to device..." });
        const deviceIp = await functions.getDeviceIp(result.serial);

        await functions.tcpip(port, result.serial);
        await functions.connect(deviceIp, port);

        vscode.window.showInformationMessage(
          `Connected to ${deviceIp}:${port}`
        );
      }
    );
  } catch (err) {
    const message = err.name != null ? `${err.name}: ${err.message}` : err;
    vscode.window.showErrorMessage(message);
  }
};

/**
 *
 * @param {string} placeHolder
 * @returns Selected device details
 */
const showDeviceList = async (placeHolder) => {
  try {
    const { title, devices } = await functions.getDevices();

    if (devices.length == 0) {
      vscode.window.showInformationMessage(
        "No device available, plug your device via usb."
      );
      return null;
    }

    return await vscode.window.showQuickPick(devices, {
      placeHolder: placeHolder,
      title: title,
    });
  } catch (err) {
    const message = err.name != null ? `${err.name}: ${err.message}` : err;
    vscode.window.showErrorMessage(message);
  }
};

const restartServer = async () => {
  await functions.kill();
  await functions.start();

  vscode.window.showInformationMessage("Adb server restarted");
};

module.exports = {
  establishConnection,
  showDeviceList,
  restartServer,
};
