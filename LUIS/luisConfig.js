const {LuisRecognizer} = require('botbuilder-ai');

class LuisConfig {
    constructor(config) {
        console.log('Config');
        console.log(config);
        this.recognizer = new LuisRecognizer(config, {}, true);
    }

    async executeLuisQuery(context) {
        return await this.recognizer.recognize(context);
    }

    getFromEntities(result) {
        let fromValue, fromAirportValue;
        if (result.entities.$instance.From) {
            fromValue = result.entities.$instance.From[0].text;
        }
        if (fromValue && result.entities.From[0].Airport) {
            fromAirportValue = result.entities.From[0].Airport[0][0];
            console.log('\n [LuisConfig getFromEntities]');
            console.log(result.entities.From[0]);
        }

        return { from: fromValue, airport: fromAirportValue };
    }

    getToEntities(result) {
        let toValue, toAirportValue;
        if (result.entities.$instance.To) {
            toValue = result.entities.$instance.To[0].text;
        }
        if (toValue && result.entities.To[0].Airport) {
            toAirportValue = result.entities.To[0].Airport[0][0];
        }

        return { to: toValue, airport: toAirportValue };
    }

    /**
     * This value will be a TIMEX. And we are only interested in a Date so grab the first result and drop the Time part.
     * TIMEX is a format that represents DateTime expressions that include some ambiguity. e.g. missing a Year.
     */
    getTravelDate(result) {
        const datetimeEntity = result.entities['datetime'];
        if (!datetimeEntity || !datetimeEntity[0]) return undefined;

        const timex = datetimeEntity[0]['timex'];
        if (!timex || !timex[0]) return undefined;

        const datetime = timex[0].split('T')[0];
        console.log('\n [LuisConfig] getTravelDate');
        console.log(datetime);
        return datetime;
    }
}

module.exports.LuisConfig = LuisConfig;