var express = require('express');
var app = express();

const request = require('request');

// Switch to channel X
app.get('/tv/channel/:channel', async (req, res) => {
  let channel = req.params.channel;
  if (!channel)
    return;

  let keys = [];

  for (let i = 0; i < channel; i++) {
    let digit = parseInt(channel[i]);
    if (digit != null && digit != NaN) {
      await sendKey((512 + digit).toString());
      await wait(250);
    }
  }

  res.send();
});

// Launch Netflix
/// Powers on the TV if necessary (given by parameter)
app.get('/tv/netflix/:state', async (req, res) => {
  let state = req.params.state;
  if (!state)
    return;

  if (state == "stateoff") {
    await sendKey('ON/OFF');
    await wait(5000);
  } else if (state == "stateon") {
    await sendKey('MENU');
    await wait(500);
  } else
    return;

  await sendKey('DOWN');
  await wait(500);
  await sendKey('DOWN');
  await wait(500);
  await sendKey('RIGHT');
  await wait(500);
  await sendKey('OK');
  await wait(1000);
  await sendKey('OK');
  res.send(await sendKey('OK'));
});

// Switches ON or OFF the TV
app.get('/tv/o(n|ff)', async (req, res) => {
  let output = await sendKey('ON/OFF');
  if (req.params[0] == "n") {
    await wait(5000);
    sendKey('CH+');
  }

  res.send(output);
});

// Starts the recording of a program with
// 20 additional minutes
app.get('/tv/rec', async (req, res) => {
  await sendKey('REC');
  await wait(200);
  await sendKey('RIGHT');
  await wait(200);
  await sendKey('UP');
  await wait(200);
  await sendKey('UP');
  await wait(200);
  res.send(await sendKey('OK'));
});

// Starts the TV and pauses the infos
// on channel 2
app.get('/tv/infos', async (req, res) => {
  await sendKey('ON/OFF');
  await wait(5000);
  await sendKey('CH+');
  await wait(200);
  await sendKey('2');
  await wait(12000);
  res.send(await sendKey('PLAY/PAUSE'));
});

app.listen(8000);

let keyMap = {
  "0": "512",
  "1": "513",
  "2": "514",
  "3": "515",
  "4": "516",
  "5": "517",
  "6": "518",
  "7": "519",
  "8": "520",
  "9": "521",
  "ON/OFF": "116",
  "CH+": "402",
  "CH-": "403",
  "VOL+": "115",
  "VOL-": "114",
  "MUTE": "113",
  "UP": "103",
  "DOWN": "108",
  "LEFT": "105",
  "RIGHT": "106",
  "OK": "352",
  "BACK": "158",
  "MENU": "139",
  "PLAY/PAUSE": "164",
  "FBWD": "168",
  "FFWD": "159",
  "REC": "167",
  "VOD": "393"
};

async function sendKey(key) {
  let output = "";
  let mappedKey = keyMap[key];
  if (mappedKey)
    output += await request.get(`http://192.168.1.33:8080/remoteControl/cmd?operation=01&key=${mappedKey}&mode=0`);

  return output;
}

const wait = ms => new Promise(res => setTimeout(res, ms));
