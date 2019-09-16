const { BotFrameworkAdapter, UserState, ConversationState, MemoryStorage} =require('botbuilder');
const {PromptBot} = require('./bot/promptbot');
const restify =  require('restify');
const path = require('path');
const ENV = path.join(__dirname,'.env');
const dotenv = require('dotenv');

dotenv.config({path: ENV});

const PORT = process.env.PORT || 4000;

const adapter = new BotFrameworkAdapter({});

adapter.onTurnError = async(context, error) =>{
    if(error) {
        console.log(error);

        context.sendActivity('Please try again later');
    }
};

const memory = new MemoryStorage();
const userState = new UserState(memory);
const conversationState = new ConversationState(memory);

const coversationReference = [] ;

const bot = new PromptBot(conversationState, userState, coversationReference);
const server = restify.createServer();

server.listen(PORT, () => {
    console.log(`Chatbot Server is up and running on port ${PORT}`);
});

server.post('/api/prompt', async(request, response) => {
    adapter.processActivity(request, response, async(context) => {
        await  bot.run(context);
    });
} );

setTimeout(async()=>{
    console.log(
        'ConvoRefs'
    );
    console.log(coversationReference);
    
    await adapter.continueConversation(coversationReference[0], async turnContext => {
        await turnContext.sendActivity('proactive hello');
    });
    
    // adapter.continueConversation(coversationReference, async(context) => {
    //     let i =0;
    //     for (const conversationReference of Object.values(coversationReference)) {
    //         console.log(coversationReference);
    //         i++;
    //         await adapter.continueConversation(conversationReference, async turnContext => {
    //             await turnContext.sendActivity('proactive hello');
    //         });
    //     }
    //     console.log(`I is ${i}`);


    // });

    // let i =0;
    // for (const conversationReference of Object.values(coversationReference)) {
    //     i++;
    //     console.log(coversationReference);
    //     await adapter.continueConversation(conversationReference, async turnContext => {
    //         await turnContext.sendActivity('proactive hello');
    //     });
    // }
    // console.log(`I is ${i}`);


},10000);