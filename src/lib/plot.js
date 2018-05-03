const SerialPort = require('serialport');

function sendCommand(command) {
  if (!command) {
    return;
  }

  console.log('[Plotter] Sending message:', command);
  port.write(command + '\r');
}

function plot(device, gcodeCommands) {
  const commands = [...gcodeCommands];
  let plot = null;

  port = new SerialPort(device, {baudRate: 115200}, err => {
    if (err) {
      return console.log('Error: ', err.message);
    }

    console.log("[Plotter] Let's go! Starting in 5 sec...");
    setTimeout(() => sendCommand(commands.shift()), 5000);
  });

  port.on('data', data => {
    console.log('[Plotter] Message received:', data.toString());

    if (data.toString().startsWith('ok')) {
      sendCommand(commands.shift());
    }
  });

  port.on('error', err => {
    console.log('[Plotter] Error:', err)
  });
}

module.exports = {plot};
