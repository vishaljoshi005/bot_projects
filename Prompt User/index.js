const { BotFrameworkAdapter, UserState, ConversationState, MemoryStorage} =require('botbuilder');
const {PromptBot} = require('./bot/promptbot');
const restify =  require('restify');
const path = require('path');
const ENV = path.join(__dirname,'.env');
const dotenv = require('dotenv');

dotenv.config({path: ENV});

const PORT = process.env.PORT || 4000;

const adapter = new BotFrameworkAdapter();

adapter.onTurnError = async(context, error) =>{
    if(error) {
        console.log(error);

        context.sendActivity('Please try again later');
    }
};

const memory = new MemoryStorage();
const userState = new UserState(memory);
const conversationState = new ConversationState(memory);

const bot = new PromptBot(conversationState, userState);
const server = restify.createServer();

server.listen(PORT, () => {
    console.log(`Chatbot Server is up and running on port ${PORT}`);
});

server.post('/api/prompt', async(request, response) => {
    adapter.processActivity(request, response, async(context) => {
        await  bot.run(context);
    });
} );