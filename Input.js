const readLine = require('readline');
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

module.exports = function Input({
    state,
    output
}) {

    return {
        prompt,
        question,
        selectAction
    }

    function question(text) {
        return new Promise(resolve => {
            rl.question(text + ' ', answer => {
                resolve(answer);
            });
        });
    }

    function prompt() {
        return new Promise(resolve => {
            const onLineListener = line => {
                rl.off('line', onLineListener);
                resolve(line);
            };
            rl.on('line', onLineListener);
        });
    }

    async function selectAction(actions) {
        const options = actions.map(a => a.name);

        let choice = '';
        while (!options.includes(choice)) {
            if (choice !== '' && choice !== 'hm') {
                let texts = [
                    `that's not it`,
                    `not quite right ${state.getName()}`,
                    `my words are slurring`,
                    `focus`,
                    `get your shit together`,
                    `ugh`,
                    `lol`,
                    `nope nope nope nope`,
                    `NO`,
                    `yes and NO.`,
                    `pawdpwajdpiwajdwad`,
                    `press CTRL + C`,
                    `nope`,
                    `not that`,
                    `can't do that`
                ];
                output.text('\t' + texts[Math.round(Math.random() * (texts.length - 1))] + '\n');
            }
            choice = await prompt();
            if (choice === 'hm') {
                let texts = [
                    '... What was I thinking about?',
                    '... What was I thinking about again?',
                    '... my memory is a mess',
                    '... wake up ' + state.getName(),
                    '... focus ' + state.getName()
                ];
                output.text('\t' + texts[Math.round(Math.random() * (texts.length - 1))] + '\n');
                for (let action of actions) {
                    output.line('...' + action.name);
                }
                output.breakLine();
            }
        }

        return actions.find(a => a.name === choice);
    }
}