# This is a discord bot I developed for the group I used to play a game with, to keep track of contributions made by all the other group members #
- This was the instruction list I provided when I left the group as I did not want to pay the operating costs of the bot anymore

# Technologies/libraries used #
- MongoDB
- Mongoose
- Node.js
- Discord.js
- Node-scheduler

# Setting up Discord authentication token #
- You have to setup a discord bot through Discord's website, get the OAUTH Token
- Then paste that token into the config.json file in this folder

# Steps #
- Get a cloud server (Free tier Amazon EC2 Ubuntu 16.04 instance)
- Install Node.js on the machine
- Install NPM on the machine
- Install MongoDB on the machine
- Drop this folder into some directory on the machine (probably best to leave it at the directory '~/')
- In the terminal `cd` into the folder and run `npm install` (package.json has info on all the packages needed)
- Install pm2: `sudo npm install pm2 -g`
- In the terminal type `sudo pm2 start app.js`
- All done!

- Kristo


