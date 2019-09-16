const { BotFrameworkAdapter, UserState, ConversationState, MemoryStorage} = require('botbuilder');
const restify = require('restify');

const dotenv = require('dotenv');
const path = require('path');
const ENV = path.join(__dirname, '.env');

dotenv.config({path: ENV});

const PORT = process.env.PORT || 4000;



const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppID,
    appPassword: process.env.MicrosoftAppPassword
});
    

adapter.onTurnError = async(context, error) => {
        console.log('Error bro Error, can be solved easily');

        await context.sendActivity('Please try again later');
    }; 


const memory = new MemoryStorage();

const userState = new UserState(memory);

const server = restify.createServer();

server.listen(PORT, ()=>{
    console.log(`Chatbot server is up and running on port ${PORT}`);
});

const {StateBot} = require('./statebot');

bot = new StateBot(userState);

server.post('/api/statebot', (request, response)=>{
    // console.log('Request Received');
    adapter.processActivity(request, response, async(context) => {
        await bot.run(context);
    });
});