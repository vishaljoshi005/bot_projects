const {ActivityHandler} = require('botbuilder');

class EchoBot extends ActivityHandler {

    constructor(){
        super();

        this.onMessage( async (context, next) =>{
            await context.sendActivity(`You said ${context.activity.text}`);

            await next();
        });

        this.onMembersAdded (async (context, next) => {
            const AddedMember = context.activity.membersAdded;
            console.log('AddedMember');
            console.log(AddedMember);

            for (let addedId = 0; addedId< AddedMember.length; ++addedId) {

                console.log(`Context activity recipient id `);
                console.log(context.activity.recipient.id);
                
                if(AddedMember[addedId].id !== context.activity.recipient.id) {
                    await context.sendActivity('Hello What can I do for you today?');
                }
            }
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;