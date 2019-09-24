const {ComponentDialog, Dialog} = require('botbuilder-dialogs');
const { DialogSet,
        DialogTurnStatus,
        ChoiceFactory,
        WaterfallDialog,
        TextPrompt,
        ChoicePrompt
        } = require('botbuilder-dialogs');

const {LuisRecognizer} = require('botbuilder-ai');

const TEXT_PROMT_ONE = 'TEXT_PROMPT_ONE';
const TEXT_PROMT_TWO = 'TEXT_PROMPT_TWO';
const TEXT_PROMT_THREE = 'TEXT_PROMPT_THREE';
const TEXT_PROMT_FOUR = 'TEXT_PROMPT_FOUR';

const CHOICE_PROMPT = 'CHOICE_PROMPT';

const WATERFALL_DIALOG ='WATERFALL_DIALOG';

class DialogBot extends ComponentDialog {
    
    
    constructor(luis) {
        super('luischat');
        this.luis = luis;

        this.addDialog(new TextPrompt (TEXT_PROMT_ONE));
        this.addDialog(new TextPrompt (TEXT_PROMT_TWO));
        this.addDialog(new TextPrompt (TEXT_PROMT_THREE));
        this.addDialog(new TextPrompt (TEXT_PROMT_FOUR));

        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.firstStep.bind(this),
            this.secondStep.bind(this),
            this.thirdStep.bind(this),
            this.fourStep.bind(this),
            this.fiveStep.bind(this),
            this.finalStep.bind(this)

        ]) );

        this.initialDialogId = WATERFALL_DIALOG;
        
    }

    async run(context, dialogState) {
        const dialogSet = await new DialogSet(dialogState);
        const dialogContext = await dialogSet.createContext(context);
        dialogSet.add(this);

        const result = await dialogContext.continueDialog();

        if(result.status === DialogTurnStatus.empty) {
        let dialog_context = await dialogContext.beginDialog(this.id);
        return dialog_context;
        }
    }
    
    async firstStep(stepContext) {
        await stepContext.context.sendActivity('Hi I can you with booking a flight');
        return await stepContext.prompt( TEXT_PROMT_ONE, 'For example say book a flight from london to paris');
    }
    
    async secondStep (stepContext) {
        // const details ={} ;
        const luisResult = await this.luis.executeLuisQuery(stepContext.context);
        console.log(luisResult);
        switch(LuisRecognizer.topIntent(luisResult)) {
            case 'BookFlight':
                stepContext.values.from = this.luis.getFromEntities(luisResult).airport;
                stepContext.values.to = this.luis.getToEntities(luisResult).airport;
                stepContext.values.date = this.luis.getTravelDate(luisResult);
                break;
            case 'GetWeather' :
                // stepContext.values.weather = this.luis.getFromEntities(luisResult);
        }
        return await stepContext.next();
    }

    async thirdStep (stepContext) {
        const from = stepContext.values.from;
        if(!from){
            return await stepContext.prompt(TEXT_PROMT_TWO, {prompt: 'Please enter the origin'});
        }
        return await stepContext.next(from);
    }

    async fourStep(stepContext) {
        stepContext.values.from = stepContext.result;
        
        const to = stepContext.values.to;

        if(!to) {
            return await stepContext.prompt(TEXT_PROMT_THREE, 'Please enter the destination');
        }

        return await stepContext.next(to);
        
    }

    async fiveStep (stepContext) {
        stepContext.values.to = stepContext.result;

        const date = stepContext.values.date;

        if(!date) {
            return await stepContext.prompt(CHOICE_PROMPT, 
                { prompt:'Please enter the travel date',
                    choices: ChoiceFactory.toChoices(['Today', 'Tomorrow'])
                });
        }

        return await stepContext.next(date);
    }

    async finalStep(stepContext) {
        
        stepContext.values.date = stepContext.result.value ==='Today' ? new Date() : new Date(+new Date() + 86400000);
        const from = stepContext.values.from;
        const to = stepContext.values.to;
        const date = stepContext.values.date;
        return await stepContext.context.sendActivity(`Your Booking is Confirmed from ${from} to ${to} on ${date}`);

    }

    
}

module.exports.DialogBot = DialogBot;