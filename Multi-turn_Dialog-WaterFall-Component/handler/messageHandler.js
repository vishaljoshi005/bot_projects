const {ActivityHandler} = require('botbuilder');

class MessageBot extends ActivityHandler {
    constructor(conversationState, userState, dialogBot) {
        super();
        this.userState = userState;
        this.conversationState = conversationState;
        this.dialogBot = dialogBot;
        this.dialogState = this.conversationState.createProperty('DialogState');

        this.onMessage(async(context, next) => {
            console.log('Routing through message activity handler');
            await this.dialogBot.run(context, this.dialogState);
            await next();
        });

        this.onDialog(async(context, next) => {
            await this.userState.saveChanges(context, false);
            await this.conversationState.saveChanges(context, false);

            await next();
        } );
    }
}

module.exports.MessageBot = MessageBot;