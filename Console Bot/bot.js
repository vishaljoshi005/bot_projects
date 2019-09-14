class ConsoleBot {
    async onTurn(context){

        if(context.activity.type === 'message' && context.activity.text){

            if(context.activity.text.toLowerCase()==='exit') {
                context.sendActivity('GoodBye');
                process.exit();
            }else {
                return context.sendActivity( `You typed ${context.activity.text}`);
            }
        }
     }
}

module.exports.ConsoleBot = ConsoleBot;