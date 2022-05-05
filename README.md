<div  id="top"></div>
 <br  />
<div  align="center">
	<h3  align="center">Android Debug Bridge</h3>
	<p  align="center">
		Brings ADB functionality to Visual Studio Code.
	</p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
	<summary>Table of Contents</summary>
	<ol>
		<li><a  href="#getting-started">Getting Started</a></li>
		<li><a  href="#usage">Usage</a></li>
		<ul>
			<li><a  href="#show-devices">Show Devices</a></li>
			<li><a  href="#connect">Connect</a></li>
			<li><a  href="#fast-connect">Fast Connect</a></li>
     		<li><a  href="#set-default-device">Set Default Device</a></li>
			<li><a  href="#restart-server">Restart Server</a></li>
			<li><a  href="#usb-mode">USB Mode</a></li>
			<li><a  href="#set-default-port">Set Default Port</a></li>
	    </ul>
		<li><a  href="#contributing">Contributing</a></li>
		<li><a  href="#license">License</a></li>
	</ol>
</details>

## Getting Started
Install extension from [here](https://marketplace.visualstudio.com/items?itemName=sourcekod.android-debug-bridge) or from Visual Studio Code marketplace.

To use adb, you must enable **USB debugging** in the device system settings, under **Developer options**.

> To prepare your device, refer this official ADB [instructions](https://developer.android.com/studio/command-line/adb?authuser=1#Enabling)

## Usage
Press `ctrl + shift + p`  for Windows/Linux, `command + shift + p` on MacOs and type adb to see all available commands. 

### Show Devices
`ADB: Show devices`
Shows all available devices to debugging an Android app. Devices might connected via usb or wireless.

### Connect
`ADB: Connect`
Connects Android device that selected between available devices. 

<p  align="right">(<a  href="#top">back to top</a>)</p>

### Fast Connect
`ADB: Fast connect`
Connects default Android device directly if set before, otherwise shows device options to select a default device.

### Set Default Device
`ADB: Set up a device to connect fast next time`
Changes default device to fast connect.

### Restart Server
`ADB: Restart server`
Kills and starts the adb server. This will cause termination on any running debug process.

<p  align="right">(<a  href="#top">back to top</a>)</p>

### Usb Mode
`ADB: Restart server in usb mode`
Restarts adb server in usb mode for all tcpip devices.

### Set Default Port
`ADB: Set default port`
The default port is 5555, it sets the default port for new connections. The change takes effect on the next connection.

<p  align="right">(<a  href="#top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!  

[Repository](https://github.com/ertgrulll/vscode_adb)

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Ertuğrul Yakın - ertgrulll@outlook.com

## License

Distributed under the MIT License.

<p  align="right">(<a  href="#top">back to top</a>)</p>
