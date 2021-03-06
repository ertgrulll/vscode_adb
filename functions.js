const util = require("util");
const exec = util.promisify(require("child_process").exec);

const getDevices = async (excludeWirelessDevices) => {
  const { stdout, stderr } = await exec("adb devices -l");

  if (stderr) {
    throw new Error(`An error occured, you might not installed or not set path for adb.
        ${stderr}`);
  }

  const lines = stdout.split("\n");

  let deviceLines = lines
    .slice(1, lines.length - 1)
    .filter((line) => line.includes("device"));

  let deviceList = deviceLines.map((line) => {
    const props = line.split(/\s+/g);

    const model = props
      .filter((item) => item.includes("model"))[0]
      .replace("model:", "")
      .replace(/_/g, " ");

    const connectionType = props[0].includes(":") ? " (wireless)" : " (usb)";
    const status = props[1] === "offline" ? " - (offline)" : "";

    return {
      description: props[0] + connectionType + status,
      label: model,
      serial: props[0],
      isOffline: props[1] === "offline",
    };
  });

  if (excludeWirelessDevices) {
    deviceList = deviceList.filter((device) => !device.serial.includes(":"));
  }

  return {
    title: lines[0],
    devices: deviceList,
  };
};

const getDeviceIp = async (serial) => {
  if (serial.includes(":")) {
    return serial.split(":")[0];
  }

  const networkInterface = (await exec(`adb -s ${serial} shell getprop`))
    .stdout;

  const wifiInterfaceLine = networkInterface
    .split("\n")
    .filter((line) => line.includes("wifi.interface"))[0];

  const wifiInterface = wifiInterfaceLine
    .split(":")[1]
    .trim()
    .replace("[", "")
    .replace("]", "");

  const result = await exec(
    `adb -s ${serial} shell ip addr show ${wifiInterface}`
  );

  const pattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
  const ip = result.stdout.match(pattern)[0];

  return ip;
};

const connect = async (ip, port) => {
  const { stdout, stderr } = await exec(`adb connect ${ip}:${port}`);

  console.log(stdout);

  if (stdout.includes("no host") || stdout.includes("failed") || stderr) {
    throw new Error(stdout || stderr);
  }
};

const disconnect = async () => {
  const { stdout, stderr } = await exec("adb disconnect");

  return stdout || stderr;
};

const kill = async () => {
  await exec("adb kill-server");
};

const start = async () => {
  await exec("adb start-server");
};

const removeReverseConnections = async () => {
  const { stderr } = await exec("adb reverse --remove-all");

  if (stderr) {
    throw new Error(`An error occured, you might not installed or not set path for adb.
        ${stderr}`);
  }
};

const usb = async (serial) => {
  await exec(`adb -s ${serial} usb`);
};

const tcpip = async (port, serial) => {
  const serialPart = serial ? ` -s ${serial}` : "";
  await exec(`adb ${serialPart} tcpip ${port}`);
};

module.exports = {
  getDevices,
  getDeviceIp,
  connect,
  removeReverseConnections,
  usb,
  tcpip,
  kill,
  start,
  disconnect,
};
