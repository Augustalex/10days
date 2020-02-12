const Input = require('./Input.js');
const Output = require('./Output.js');
const Fx = require('./Fx.js');
const Scenes = require('./scenes/Scenes.js');
const State = require('./State.js');

function Edit() {

    const state = State();
    const output = Output();
    const input = Input({ state, output });
    const fx = Fx();

    const deps = {
        fx,
        input,
        output,
        state
    };
    const intro = Scenes.Intro(deps);

    return {
        start
    };

    function start() {
        intro.run();
    }
}

const edit = Edit();
edit.start();
