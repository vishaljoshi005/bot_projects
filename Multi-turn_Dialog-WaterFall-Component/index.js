const path = require('path');
const dotenv = require('dotenv');
const ENV = path.join(__dirname, '.env');
dotenv.config({path:ENV});

const restify = require('restify');

const {BotFrameworkAdapter, UserState, ConversationState, MemoryStorage} = require('botbuilder');

const {DialogBot} = require('./bot/dialogBot');
const {MessageBot} = require('./handler/messageHandler');



const PORT = process.env.PORT || 4000;




const adapter = new BotFrameworkAdapter();

adapter.onTurnError = async(context, error) => {
    console.log(error);
    await context.sendActivity('Please try again later');
};

const memory = new MemoryStorage();
const userState = new UserState(memory);
const conversationState = new ConversationState(memory); 

const dialog = new DialogBot(userState);
const bot = new MessageBot(conversationState, userState, dialog);


const server = restify.createServer();

server.listen(3000, (error) => {
    // console.log(error);
    console.log(`ChatBot is up and running on port ${PORT}`);
});


server.post('/api/dialog', async(request, response) => {
    adapter.processActivity(request, response, async(context) => {
        // Add handler
        await bot.run(context);
    } );
});