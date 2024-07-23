// Import necessary classes and constants from discord.js and discord-api-types
import { Client, GatewayIntentBits } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { token, clientId } from './config'; // Removed guildId for global commands

// Create a new Discord client instance with specified intents
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.DirectMessages 
    ]
});

// Event listener that runs once when the client is ready
client.once('ready', () => {
    console.log('Ready!');
});

// Log in to Discord with the client's token
client.login(token);

// Define slash commands to be registered
const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
];

// Create a new REST instance for interacting with Discord API
const rest = new REST({ version: '9' }).setToken(token);

// Async function to register slash commands globally
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        // Register the commands globally with the Discord API
        await rest.put(
            Routes.applicationCommands(clientId),  // Global commands
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        // Log any errors that occur during registration
        console.error(error);
    }
})();

// Event listener for handling interactions (slash commands)
client.on('interactionCreate', async interaction => {
    // Ensure the interaction is a command
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    // Handle the 'ping' command
    if (commandName === 'ping') {
        try {
            // Check if the interaction is in a guild or a DM
            if (interaction.guild) {
                // Interaction in a guild (server)
                await interaction.user.send('Pong! This command was triggered from a server.');
                await interaction.reply('I sent you a DM!');
            } else {
                // Interaction in a DM
                await interaction.reply('Pong! This command was triggered from a DM.');
            }
        } catch (error) {
            // Log any errors that occur and reply with an error message
            console.error(`Could not send DM to ${interaction.user.tag}.\n`, error);
            await interaction.reply({ content: 'I could not send you a DM. Do you have DMs disabled?', ephemeral: true });
        }
    }
});
