const dialogs = require('../dialog.js');

module.exports = function ({
    input,
    output,
    fx,
    state
}) {

    const introDialog = dialogs.find(d => d.name === 'Intro');

    return {
        run
    };

    async function run() {
        const name = await input.question(`What's your name?`);
        state.setName(name);
        let string = '';
        for (let i = 0; i < 1000; i++) {
            string += (Math.random() < .5 ? name.toUpperCase() : name.toLowerCase());
        }
        output.text(string);
        await fx.wait(100);
        console.clear();

        play(introDialog);
    }

    async function play(dialog) {
        await dialog.play({ state, fx, output });

        const validActions = !!dialog.getActions ? await dialog.getActions({ state }) : dialog.actions;
        const chosenAction = await input.selectAction(validActions);
        chosenAction.onSelect && chosenAction.onSelect();

        const nextDialogName = chosenAction.target || chosenAction.name;
        const nextDialog = dialogs.find(d => d.name === nextDialogName);

        output.clear();

        if (!nextDialog) {
            console.log('...there seems to be pages missing from this book?');
            await new Promise(resolve => setTimeout(resolve, 3000));
            output.clear();
            play(dialog);
        }
        else {
            play(nextDialog);
        }
    }
};