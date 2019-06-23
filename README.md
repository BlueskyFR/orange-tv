# Orange-TV

*A simple interface for IFTTT, Google Assistant and an Orange decoder written in Node.JS.*


If you want to run it, follow these steps :

1. First, clone the repository, and make sure to have Node.JS installed. Then, execute the following command to install the dependencies:
```bash
npm i
```

2. Then, edit the first line in app.js by replacing '192.168.1.33' with you decoder's local IP (found in the livebox configuration, accessible at http://livebox/):
```js
const localDecoderIP = '192.168.1.33'; // Replace with your decoder's local IP
```
This app has to run on a local server (on the same network as the decoder) and handles requests made by **port 8000**: this is because the port 80 needs root access.
I recommand you to setup **port forwarding** using Nginx for example (you can find the Nginx configuration file at the end) to use your app with PM2 or any other node process manager if you want.

3. Run the app! You can use `node app.js` to run it with NodeJS directly or run it using a process manager such as PM2 :
```bash
pm2 start app.js --name orange-tv --watch
pm2 save
```

4. Setup IFTTT! Use the **Google Assistant** module for the **IF** condition and a **webhook** for the **THEN**, specifying an endpoint such as `[your NodeJS server's public IP]/tv/netflix/stateoff`. Your server IP **SHOULD be public** because the IFTTT webhook calls are made from an external server, not from your phone.
Enjoy!


# Documentation

## Endpoints

Here are the endpoints:

Endpoint | Description
-------- | --------
`/tv/channel/[X]` | Switch to channel `[X]`
`/tv/netflix/[state]` | Launch Netflix. `[state]` can be either "**stateon**" or "**stateoff**". If "stateoff" is specified, then the decoder is powered on before launching Netflix.
`/tv/on` and `/tv/off` | Switch on or off the TV. `/tv/on` also dismiss the main menu after powering up.
`/tv/rec` | Start the recording of the current programm being watched, adding 20 extra minutes to the default end time.
`/tv/infos` | Power up the decoder, switch to channel "France 2" and pauses after a couple of seconds (this is intended to be launched a couple of minutes before the TV news).

## API

Feel free to use the `sendKey(key)` function to make your own endpoints!
The available keys list is stored in the `keyMap` variable. Go ahead and check the source code!
Please do note that all the functions are **async**.

# Port forwarding

**By default, the port is 8000**. If you are launching the app without root privileges or using a process manager, you have to use port forwarding in order to make the app accessible from anywhere without specifying the port to make it default to 80.
A solution is to use **Nginx**; here is an example of configuration file you can use to **remap the port 80 to 8000**:

`/etc/nginx/nginx.conf`:
```nginx
events {

}

http {
  server {
    listen 80 default;
    listen [::]:80 default;
    location / {
      proxy_pass http://127.0.0.1:8000;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-for $proxy_add_x_forwarded_for;
    }
  }
}
```

# License

**Thanks for using my work!**

This project is under the Apache License 2.0 license.
You are free to use it if you:
- Include this license and copyright notice (© Hugo Cartigny (BlueskyFR))
- State the changes you made
- Follow the rest of the license :)
