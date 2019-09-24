const dotenv = require('dotenv');
const restify = require('restify');
const {BotFrameworkAdapter} = require('botbuilder');
const path = require('path');

const {EchoBot} = require('./bot');

const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });


//Variables
const PORT = process.env.PORT || 3000;

//Server

const server = restify.createServer();

server.listen(process.env.PORT || 3000, ()=>{
    console.log(`Server listening at port ${PORT} AND Url is ${server.url}` );
});


//Initialize Adapter

const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword    
});

adapter.onTurnError = async (context, error) => {
    console.error(error);

    await context.sendActivity('Something went wrong brother');
};

// Initialize bot handler

const bot = new EchoBot();


server.post('/api/echo', (request, response) => {
    adapter.processActivity(request, response, async(context) => {
        await bot.run(context);
    });
});