const {ActivityHandler } = require('botbuilder');

const STATEUSER = 'isWelcomed';


class StateBot extends ActivityHandler {

    constructor(userState) {
        super();
        this.userState = userState;
        // UserState Accessore
        this.isWelcomed = userState.createProperty(STATEUSER);

        this.onMessage(async (context, next) => {

            // console.log(context.getConversationRefence(context.request));
            const isWelcomed = await this.isWelcomed.get(context, false);
           
            if(isWelcomed === false) {
                const userName = context.activity.from.name;
                // console.log(`Username is ${userName}`);

                await context.sendActivity('First time message only');
                
                await this.isWelcomed.set(context, true);
                console.log(this.isWelcomed);

            } else {
                await context.sendActivity('Second time message');
            }


            await this.userState.saveChanges(context);
            await next();
        });

        this.onMembersAdded(async(context, next) => {

            // console.log(context.activity);
            // console.log(context.activity.membersAdded);
            for(let id in context.activity.membersAdded ) {
                if(context.activity.membersAdded[id].id !== context.activity.recipient.id) {
                    await context.sendActivity('Welcome to stateBot');
                }
            }
            await next();
        });

    }
}


module.exports.StateBot = StateBot;