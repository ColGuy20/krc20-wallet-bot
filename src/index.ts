import {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    CommandInteraction,
    Interaction,
    EmbedBuilder,
    ColorResolvable,
    CommandInteractionOptionResolver,
} from 'discord.js';
import { token, clientId, guildId } from './config';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
});

client.once('ready', () => {
    console.log('Ready!');
});

client.login(token);

const commands = [
    {
        name: 'create',
        description: 'Initiate your account!',
    },
    {
        name: 'import',
        description: 'Import a pre-existing account!',
        options: [
            {
                name: 'key',
                type: 3, // STRING type
                description: 'The key of the pre-existing account',
                required: true,
            },
        ],
    },
    {
        name: 'verify',
        description: 'Check if inputted key matches session key!',
        options: [
            {
                name: 'key',
                type: 3, // STRING type
                description: 'The key you are trying to verify',
                required: true,
            },
        ],
    },
    {
        name: 'exit',
        description: 'Quit current session!',
    },
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        const currentCommands = await rest.get(Routes.applicationGuildCommands(clientId, guildId)) as any[];

        await Promise.all(
            currentCommands.map(command =>
                rest.delete(Routes.applicationGuildCommand(clientId, guildId, command.id))
            )
        );

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        await rest.put(Routes.applicationCommands(clientId), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

const sessionKeys = new Map<string, string>();

client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const commandInteraction = interaction as CommandInteraction;
    const { commandName, user, guild, options } = commandInteraction;
    const userId = user.id;

    const replyWithEmbed = async (description: string, color: ColorResolvable = '#70C7BA', ephemeral: boolean = false) => {
        const embed = new EmbedBuilder().setColor(color).setDescription(description);
        await commandInteraction.reply({ embeds: [embed], ephemeral });
    };

    const dmUserWithEmbed = async (description: string, color: ColorResolvable = '#70C7BA') => {
        const embed = new EmbedBuilder().setColor(color).setDescription(description);
        await user.send({ embeds: [embed] });
    };

    try {
        if (guild) {
            await replyWithEmbed('You cannot use this bot in a server. I have sent you a private DM to run your commands!', '#70C7BA', true);
            await dmUserWithEmbed('Type a command here to begin!');
        } else {
            if (commandName === 'create') {
                if (sessionKeys.has(userId)) {
                    await replyWithEmbed('A session is already active. Use /exit to end it first.', '#FF0000');
                } else {
                    sessionKeys.set(userId, 'TEMPORARY_KEY');
                    await replyWithEmbed('Account created. Temporary key assigned.');
                }
            } else if (commandName === 'import') {
                if (sessionKeys.has(userId)) {
                    await replyWithEmbed('A session is already active. Use /exit to end it first.', '#FF0000');
                } else {
                    const key = options.get('key')?.value as string;
                    sessionKeys.set(userId, key);
                    await replyWithEmbed(`Imported account with key: ${key}`);
                }
            } else if (commandName === 'verify') {
                if (!sessionKeys.has(userId)) {
                    await replyWithEmbed('No active session. Use /create or /import to start.', '#FF0000');
                } else {
                    const key = options.get('key')?.value as string;
                    const sessionKey = sessionKeys.get(userId);
                    if (sessionKey === key) {
                        await replyWithEmbed(`Key '${key}' verified successfully.`);
                    } else {
                        await replyWithEmbed('Key verification failed.', '#FF0000');
                    }
                }
            } else if (commandName === 'exit') {
                if (!sessionKeys.has(userId)) {
                    await replyWithEmbed('No active session to exit.', '#FF0000');
                } else {
                    sessionKeys.delete(userId);
                    await replyWithEmbed('Session ended. Key cleared.');
                }
            }
        }
    } catch (error) {
        console.error(`Could not send DM to ${user.tag}.\n`, error);
        await replyWithEmbed('I could not send you a DM. Do you have DMs disabled?', '#FF0000', true);
    }
});
