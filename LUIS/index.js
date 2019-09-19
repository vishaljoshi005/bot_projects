const dotenv = require('dotenv');
const path = require('path');
const ENV = path.join(__dirname, '.env');
dotenv.config({path: ENV});

const PORT = process.env.PORT || 4000;

const {BotFrameworkAdapter, UserState, ConversationState,MemoryStorage, InputHints} = require('botbuilder');

const restify = require('restify');

const {LuisConfig} = require('./luisConfig');

const {Handler} = require('./bot/messageHandler');
const {DialogBot} = require('./bot/dialogBot');

const { LuisAppId, LuisApiKey, LuisHostname } = process.env;
const luisConfig = { applicationId: LuisAppId, endpointKey: LuisApiKey, endpoint: LuisHostname };

const adapter = new BotFrameworkAdapter();

adapter.onTurnError = async (context, error) => {
    console.error(`\n [OnTurnError] ${error}`);

    context.sendActivity('Please Try again later');
};

const memory = new MemoryStorage();
const userState = new UserState(memory);
const conversationState = new ConversationState(memory);

const luisRecognizer = new LuisConfig(luisConfig);

const dialogBot = new DialogBot(luisRecognizer);

const handler = new Handler(conversationState, userState, dialogBot);


const server = restify.createServer();

server.listen(PORT, () => {
    console.log(`ChatBot is up and running at URL ${server.url} and PORT is ${server.port}`);
});

server.post('/api/messages', async( request, response) => {
    adapter.processActivity(request, response, async(context) => {
        console.log('here');
        // add handler
        await handler.run(context);
    });
});