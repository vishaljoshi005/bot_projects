const {ActivityHandler, TurnContext} =  require('botbuilder');

const user = 'userProfile';
const conversation = 'conversationQuestion';

const question = {
    none: 'none',
    name: 'name',
    age: 'age',
    phone: 'phone'
};  

class PromptBot extends ActivityHandler {

    constructor(conversationState, userState, conversationReference) {
        super();

        this.conversationReference = conversationReference;

        this.userProfile = userState.createProperty(user);
        this.conversationQuestion =conversationState.createProperty(conversation);

        this.conversationstate = conversationState;
        this.userstate = userState;

        this.onMessage( async(context, next) => {

            const profile = await this.userProfile.get(context, {});

            const convo = await this.conversationQuestion.get(context, {questionNumber: question.none});

            // console.log(typeof convo.questionNumber);

            switch(convo.questionNumber){
                case question.none:
                    await context.sendActivity('What is your name?');
                    convo.questionNumber = question.name;
                    break;
                case question.name:
                    profile.name = context.activity.text;
                    await context.sendActivity('whats is your age?');
                    convo.questionNumber = question.age;
                    break;
                case question.age:
                    profile.age = context.activity.text;
                    await context.sendActivity('what is your phone');
                    convo.questionNumber = question.phone;
                    break;
                case question.phone:
                    profile.phone = context.activity.text;
                    await context.sendActivity('Thanks for you response');
                    convo.questionNumber = 'alright';
                    break;
                case 'alright':
                    console.log('userstate');
                    console.log(this.userstate);
                    
                    console.log('Convo STate');
                    console.log(this.conversationstate);
            }

            await next();

        } );

        this.onMembersAdded( async (context, next) => {
            for( let id in context.activity.membersAdded) {
                if(context.activity.membersAdded[id].id !== context.activity.recipient.id) {
                    await context.sendActivity('Welcome to prompt bot');
                    await context.sendActivity('I will take your info and store it in the states');
                    
                }

            }
            await next();
        });

        this.onDialog(async (context, next) => {
            await this.userstate.saveChanges(context,false);
            await this.conversationstate.saveChanges(context, false);

            // console.log('userState');
            // console.log(this.userstate);

            // console.log('ConvoState');
            // console.log(this.conversationstate);

            await next();
        });

        this.onConversationUpdate(async (context, next) => {
            const ref = TurnContext.getConversationReference(context.activity);
            // this.conversationReference[ref.conversation.id] = ref;
            this.conversationReference.push(ref);
            await next();
        });

    }
}

module.exports.PromptBot = PromptBot;