# Set-up
## Install packages
Run the following:
```
npm install typescript ts-node @types/node --save-dev
npm install discord.js @discordjs/rest discord-api-types
```
## Create a New Application
Go to the Discord Developer Portal: Discord Developer Portal
Log in with your Discord account.
Click on "New Application" in the top right corner.
Enter a name for your application and click "Create".

## Create a Bot User
In the Application Settings, go to the "Bot" tab on the left sidebar.
Click on "Add Bot" and confirm by clicking "Yes, do it!".
Give your bot a name and customize its avatar if you like.

## Get Your Bot Token
Under the "Bot" tab, you will see a "TOKEN" section.
Click on "Copy" to copy your bot token. This token is important as it is used to log in to your bot account from your code. Keep it secure and do not share it publicly.

## Get Your Client ID and Guild ID
Go to the "OAuth2" tab on the left sidebar.
You will see your Client ID under the "General Information" section. Copy this ID.
Guild ID can be found by right-clicking your server in Discord and selecting "Copy ID" (you need Developer Mode enabled in Discord settings to see this option).

## Set Up OAuth2 for Bot Permissions
In the "OAuth2" tab, click on "URL Generator".

Under "SCOPES", select "bot" and "applications.commands".

Under "BOT PERMISSIONS", select the permissions your bot needs. For basic functionality, you might start with:

Send Messages
Read Message History
Use Slash Commands
Copy the generated OAuth2 URL from the bottom.

## Invite the Bot to Your Server
Paste the copied OAuth2 URL into your browser.
Select the server you want to invite the bot to and click "Authorize".
Complete any required CAPTCHA.

## Configure Your config.ts File
Ensure your config.ts file in your project has the correct tokens and IDs. It should look something like this:

typescript
Copy code
export const token = 'YOUR_DISCORD_BOT_TOKEN';
export const clientId = 'YOUR_CLIENT_ID';
export const guildId = 'YOUR_GUILD_ID';
Replace YOUR_DISCORD_BOT_TOKEN, YOUR_CLIENT_ID, and YOUR_GUILD_ID with the values you obtained from the Developer Portal.

## Enable the Required Intents in the Discord Developer Portal:
Go to the Discord Developer Portal.
Select your application.
Navigate to the "Bot" tab.
Scroll down to the "Privileged Gateway Intents" section.
Enable "MESSAGE CONTENT INTENT" and "SERVER MEMBERS INTENT" if required.
Save changes.

# Running the program
Use `npx ts-node src/index.ts` to run