const { WaterfallDialog,
        ComponentDialog,
        ChoiceFactory,
        DialogSet,
        DialogTurnStatus,
        ChoicePrompt,
        TextPrompt,
        NumberPrompt,
        ConfirmPrompt} = require('botbuilder-dialogs');

const CHOICE_PROMPT = 'CHOICE_PROMPT';
const TEXT_PROMPT = 'TEXT_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';

const USER_PROFILE = 'USER_PROFILE';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

const {UserModel} = require('../userModel');

class DialogBot extends ComponentDialog {
    
    constructor(userState) {
        console.log('Called');
        super('userProfileDialog');

        this.userProfile = userState.createProperty(USER_PROFILE);

        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG,[
            this.getTransport.bind(this),
            this.getName.bind(this),
            this.afterName.bind(this),
            this.getAge.bind(this),
            this.afterAge.bind(this),
            this.detailOkay.bind(this)

        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async run(turnContext, accessor) {
        console.log('Hello');
        const dialogSet= new DialogSet(accessor);
        dialogSet.add(this);

        // const dialogContext = await dialogSet.createContext(turnContext);
        // const results = await dialogContext.continueDialog();
        // console.log(results);

        const dialogContext = await dialogSet.createContext(turnContext);
        const result = await dialogContext.continueDialog();

        console.log(result);
        console.log(this.initialDialogId);

        if(result.status === DialogTurnStatus.empty){
            console.log('here');
            console.log(this.id);
            await dialogContext.beginDialog(this.id);
        }
    }

    async getTransport(step) {
        console.log('Called get transport');
        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'How you would like to transport',
            choices: ChoiceFactory.toChoices(['Car', 'Bike', 'Truck'])
        });
    }

    async getName(step) {
        step.values.transport = step.result.value;
        await step.context.sendActivity(`Your tranport mode is ${step.values.transport}`);
        return await step.prompt(TEXT_PROMPT, `Enter your name?`);
    }

    async afterName(step) {
        step.values.name = step.result;
        await step.context.sendActivity(`You said your name was ${step.values.name}`);
        return await step.prompt(CONFIRM_PROMPT, 'Would you like to submit your age', ['Yes', 'No']);
    }

    async getAge(step) {
        if(step.result) {
            console.log('step.result');
            console.log(step.result);
            const promptOption = {prompt: 'Please enter your age', retryPrompt: 'The age must be in between 20 and 60'};
           return await step.prompt(NUMBER_PROMPT, promptOption);
        }else {
            return  await step.next(-1);
        }
    }

    async afterAge(step) {
        step.values.age = step.result; 
        const msg = step.result === -1 ? 'NO Age Provided' : `Your age is ${step.result}`;
        await step.context.sendActivity(msg);
        return await step.prompt(CONFIRM_PROMPT, 'Is this detail ok ?');

    }

    async detailOkay(step) {
        if(step.result) {
            const userProfile = await this.userProfile.get(step.context, new UserModel() );
            userProfile.transport = step.values.transport;
            userProfile.name = step.values.name;
            userProfile.age = step.values.age;

            let msg = `You have submitted these details ${step.values.transport} and ${step.values.name} `;
            if(step.values.age !== -1) {
                msg += `and age ${step.values.age}`;
            } 
            await step.context.sendActivity(msg);
        } else {
            await step.context.sendActivity('Your details have been discarded');
        }

        return await step.endDialog();
    }
}

module.exports.DialogBot = DialogBot;