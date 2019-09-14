const {ConsoleAdapter} = require('./consoleAdapter');
const {ConsoleBot} = require('./bot');

const Adapter =new ConsoleAdapter();

const bot = new ConsoleBot();

Adapter.listen( async (context) => {
    bot.onTurn(context);
});

console.log('Console bot is Up and Running');