const {ActivityHandler } = require('botbuilder');

class Handler extends ActivityHandler {
    constructor(conversationState, userState, dialogBot ) {
        super();

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialogBot = dialogBot;

        this.dialogState = conversationState.createProperty('dialogState');

        this.onMessage(async (context, next) => {
            console.log('onmessage');
            await this.dialogBot.run(context, this.dialogState);
    
            await next();
        } );

        this.onDialog(async (context, next) => {
            await this.userState.saveChanges(context, false);
            await this.conversationState.saveChanges(context, false);
    
            await next();
        } );


    }

    
}

module.exports.Handler = Handler;