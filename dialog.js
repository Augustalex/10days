module.exports = [
    {
        name: 'Intro',
        play: async ({ fx, output }) => {
            await output.type(`I wake up, the clock is 10 am. It's very cold in my room.. hm`);
        },
        actions: [
            { name: 'check the radiator' },
            { name: 'get dressed' }
        ]
    },
    {
        name: 'check the radiator',
        play: async ({ fx, output }) => {
            await output.type(`It's burning. I must be ill i guess..`);
            await output.type(`Nothing to eat for 5 days could also have something to do with it.`);
        },
        actions: [{ name: 'go to the living room', target: 'House' }]
    },
    {
        name: 'get dressed',
        play: async ({ fx, output }) => {
            await output.type(`These clothes are dirty, but I cannot waste the water to wash them and the lake is poison.`);
            await output.type(`Also I'm starving, and I don't want to eat dirty clothes again.`);
        },
        actions: [{ name: 'go to the living room', target: 'House' }]
    },
    {
        name: 'House',
        play: async ({ output }) => {
            await output.type(`Our living room..`);
        },
        actions: [
            { name: 'go to outside' },
            { name: 'look outside' },
            { name: 'eat' },
            { name: 'wash my face' },
            { name: 'read a book' },
            { name: 'check on the others' }
        ],
    },
    {
        name: 'wash my face',
        play: async ({ state, output }) => {
            state.addTag('washed face');
            await output.type('...now my chin itches a lot, does not feel good.');
        },
        actions: [
            { name: 'itch', target: 'House' }
        ],
    },
    {
        name: 'look outside',
        play: async ({ state, fx, output }) => {
            if (state.hasTag('closedTheCurtains')) {
                await output.type(`The curtains are closed, did I close the curtains? I guess I closed the curtains. Should not close the curtains..`);
            }
            else {
                const weather = state.getWeather();
                await output.typeContinously(`It looks`);
                await fx.wait(500);
                await output.typeContinously(`... `, 1000);
                await fx.wait(1000);
                await output.type(weather + '.', 3000);
            }
        },
        getActions: ({ state }) => {
            if (state.hasTag('closedTheCurtains')) {
                state.removeTag('closedTheCurtains');
                return [{ name: 'open the curtains', target: 'House' }];
            }
            else {
                state.addTag('closedTheCurtains');
                return [{ name: 'close the curtains', target: 'House' }];
            }
        }
    },
    {
        name: 'go to outside',
        play: async ({ fx, state, output }) => {
            if (state.hasTag('washed face')) {
                await output.type('My chin itches again,');
                await fx.wait(1000);
                await output.type(' and I scratch it.');
                await fx.wait(1000);
                await output.type(' Now my chin is in my hand.');
            }
            else if (state.hasTag('goingBackHome')) {
                await output.type('Nice to be outside house again');
            }
            else {
                await output.type('Nice to be out of the house');
            }
        },
        getActions: async ({ state }) => {
            if (state.hasTag('washed face')) {
                return { name: 'die', target: 'Death' };
            }
            return [
                { name: 'turn left to the lake', target: 'The Lake' },
                { name: 'go straight to the bus stop', target: 'Bus stop' }
            ]
        }
    },
    {
        name: 'Death',
        play: async ({ state, fx, output }) => {
            const weather = state.getWeather();
            await output.typeContinously(`...`);
            await fx.wait(500);
            await output.typeContinously(`...`);
            await fx.wait(500);
            await output.typeContinously(`... at least the weather was`, 1000);
            await fx.wait(1000);
            await output.typeContinously(`  ${weather}`, 5000);
            await fx.wait(3000);
            process.exit();
        },
        actions: []
    },
    {
        name: 'Bus stop',
        play: async ({ state, output }) => {
            await output.type(`The time table is 10 years old.. Not that it matters.`);
        },
        getActions: async ({ state }) => {
            const weather = state.getWeather();
            const actions = [{ name: `eh`, target: 'House' }];

            if (!state.hasTag('triedStealingTheBike')) {
                if (weather === 'wet') {
                    actions.push({ name: 'steal a bike', target: 'I cut myself on the rusty texture' });
                }
                else {
                    actions.push({
                        name: 'steal a bike',
                        target: 'Riding to the city',
                        onSelect: () => {
                            state.addTag('gotTheBike')
                            state.addTag('triedStealingTheBike');
                        }
                    });
                }
            }

            if (!state.hasTag('waitedForTheBus')) {
                actions.push({
                    name: 'wait for a bus',
                    target: 'wait for a bus',
                    onSelect: () => state.addTag('waitedForTheBus')
                });
            }

            return actions;
        }
    },
    {
        name: 'Riding to the city',
        play: async ({ state, output }) => {
            await output.type(`It's a long way to the city, and this is a crap bike.`);
        },
        getActions: async ({ state }) => {
            return [{ name: 'carry on', target: 'City' }];
        }
    },
    {
        name: 'I cut myself on the rusty texture',
        play: async ({ state, output }) => {
            await output.type(`I cut myself on the rusty texture.. you don't make it through mistakes like these.`);
        },
        getActions: async ({ state }) => {
            return [
                { name: 'let the poison in the air kill you', target: 'Death' },
                { name: 'die already', target: 'Death' }
            ];
        }
    },
    {
        name: 'wait for a bus',
        play: async ({ state, output }) => {
            await output.type(`I see something in the distance, it's headlights..`);
        },
        getActions: async ({ state }) => {
            const weather = state.getWeather();
            return [
                { name: 'wait', target: 'wait for a bus - wait' },
                { name: 'run', target: 'running from the bus' }
            ]
        }
    },
    {
        name: 'wait for a bus - wait',
        play: async ({ state, output }) => {
            await output.type(`There is shouting and gunfire..`);
        },
        getActions: async ({ state }) => {
            return [
                { name: 'wait', target: 'wait for a bus - wait - wait' },
                { name: 'run', target: 'running from the bus' }
            ]
        }
    },
    {
        name: 'wait for a bus - wait - wait',
        play: async ({ state, output }) => {
            await output.type(`They stop next to me and asks me if I want a ride, and don't think it's possible to say no..`);
        },
        getActions: async ({ state }) => {
            return [
                { name: 'yes', target: 'City' },
                { name: 'die', target: 'Death' }
            ]
        }
    },
    {
        name: 'running from the bus',
        play: async ({ state, output }) => {
            if (state.getWeather() === 'icy') {
                await output.type(`I run but slip on the ice and hit my head, I'm loosing consciousness..`);
            }
            else {
                await output.type(`I run, but they see me. There is a loud noise, and I hit the ground. There is blood, and I feel very cold now.`);
            }
        },
        getActions: async ({ state }) => {
            return [{ name: 'die', target: 'Death' }];
        }
    },
    {
        name: 'City',
        play: async ({ state, output }) => {
            await output.type(`You can see some dead people from where I'm standing`);
        },
        getActions: async ({ state }) => {
            return [
                { name: 'go to the pharmacy', target: 'Pharmacy' },
                { name: 'go to the supermarket', target: 'Supermarket' },
                { name: 'look around', target: 'look around the city' }
            ];
        }
    },
    {
        name: 'Pharmacy',
        play: async ({ state, output }) => {
            const weather = state.getWeather();
            if (weather === 'icy') {
                state.addTag('gotDrugs');
                await output.type(`You get some drugs. Might be useful.`);
            }
            else if (weather === 'rainy' || weather === 'wet') {
                await output.type(`The ceiling is leaking water, the drugs that are left are useless.`);
            }
            else {
                await output.type(`This place has been emptied out by someone else...`);
            }
        },
        getActions: async ({ state }) => {
            return [
                { name: 'go back', target: 'City' }
            ];
        }
    },
    {
        name: 'Supermarket',
        play: async ({ state, output }) => {
            const weather = state.getWeather();
            if (weather === 'icy' || weather === 'rainy' || weather === 'wet') {
                state.addTag('gotFood');
                await output.type(`You get some food`);
            }
            else {
                await output.type(`You're not alone`);
            }
        },
        getActions: async ({ state }) => {
            const weather = state.getWeather();
            const hasGun = state.hasTag('gotGun');
            if (weather === 'icy' || weather === 'rainy' || weather === 'wet') {
                return [{ name: 'go back', target: 'City' }]
            }
            else {
                const actions = [{ name: 'run', target: 'Supermarket - run' }];
                if (hasGun) {
                    actions.push({ name: 'Shoot at them', target: 'Supermarket - shoot at them' });
                }
                return actions;
            }
        }
    },
    {
        name: 'Supermarket - shoot at them',
        play: async ({ state, output }) => {
            const hasPracticed = state.hasTag('practicedGun');
            if (hasPracticed) {
                await output.type(`I hit them and they had some drugs from the pharmacy on them. Might be useful, as well as all this food.`);
            }
            else {
                await output.type(`I fire and miss. They are running towards me with some broken milk bottles. I think I will die.`);
            }
        },
        getActions: async ({ state }) => {
            const hasPracticed = state.hasTag('practicedGun');
            if (hasPracticed) {
                state.addTag('gotFood');
                state.addTag('gotDrugs');
                state.addTag('goingBackHome');
                return [{ name: 'wander back home', target: 'House' }];
            }
            else {
                return [{ name: 'reflect on my life (die)', target: 'Death' }];
            }
        }
    },
    {
        name: 'Supermarket - run',
        play: async ({ state, output }) => {
            if (state.getWeather() === 'icy') {
                await output.type(`I'm running for my life, but the ground is icy and I slip. My head hurts.. it's bleeding.`);
            }
            else {
                await output.type(`I'm running for my life. I'm not gonna stop until I'm home.`);
            }
        },
        getActions: async ({ state }) => {
            if (state.getWeather() === 'icy') {
                return [{ name: 'die', target: 'Death' }];
            }
            else {
                state.addTag('goingBackHome');
                return [{ name: `don't stop`, target: 'go to outside' }];
            }
        }
    },
    {
        name: 'The Lake',
        play: async ({ state, output }) => {
            await output.type(`I don't want to be here i think...`);
        },
        getActions: async ({ state }) => {
            return [{ name: `I'm useless`, target: 'go to outside' }];
        }
    }
]


/*

I wake up, the clock is 10 am.

It's cold in here, should I _get dressed_ or should I _check the radiator_ first?
    check the radiator
        It's burning. I must be ill i guess.. Not having eaten in 4 days could also have something to do with it.
    get dressed
        These clothes are dirty, but I cannot waste the water to wash them and the lake is poison. Also I'm starving, and I don't want to eat dirty clothes again.

Systems:
    Random weather
    Random friends

Location _Home_
    Actions (s:Home):
        - Go to outside
        - Look outside
            Tells you the weather: Rainy, Icy, Wet, Clear, Sunny
        - Eat
            They've eating all that is left, but I couldn't have made it this long without them. I'll have to go outside and get some more.
        - Wash your face
            My chin itches a lot, does not feel good.
        - Read a book
             - The American Dream: A citizens guide to fire arms
                "... so that's why you should keep your aim even after you've fired your shot."
             - The Bible
                Living in the sky as he does, God probably got poisoned as well.
        - Check on the others
                If A: Joe's not in his bed, you never know where you have him. Cathrine is sleeping, I think.
                If B: Ronald is reading a book. Wayne looks at me and grunts, I walk out.
                If C: Jolene is cleaning the rifle. John is staring into the wall.

Location _House_ (after you have left it)
    Actions:
        If A: - Go outside
            If has food, drugs and the gun: Leave it all behind
            If has drugs: Leave it all behind
            If has the gun: Leave it all behind
            If has food: Have a last supper
        - Look outside
            If A: The sun is going down, and in the backyard you see Joe laying the grass, with his face down towards the dirt.
            If B: The sun is going down, the moon is already up and it's a full moon.
            If C: The sun is going down, and the sky is red.
        - Go to bed
                If you found the drugs:
                    It's a nice warm bed, the drugs are helping too.
                If you found food:
                    It's a nice warm bed, and I'm gonna sleep well with a full stomach.
                If you found both:
                    It's a nice warm bed. I don't think I've felt this good since it this all began. I feel like this bodes well.

                A: I wake up from the sound of Joe loading his gun. He blows my head off.
                B: I wake up from the sound of howling. When i get to the others room I found Ronald without a face. I look outside and I see Wayne in the backyard standing on a rock howling at the moon.
                    Actions:
                        Use the gun, If have the gun
                            did not use it and has practiced: I fire my last rounds in his back. I guess I'm alone now.
                            did not use it and has NOT practiced: It's dark outside and I miss every shot. Now my face is dessert.
                            did use it: I fire but I only hear a clicking sound, and now he's seen me.
                        Fight with your fists
                            If has eaten and taken the drugs: I break his nose with my right foot, good thing a got heavy boots. I clutch to his face with both my hand and thrust into a rock breaking his skull. Not how I expected today turning out.
                            If not: My left hand I break first. Resistance is surely futile and my face is dessert.
                        Run, I get 10 feet. Resistance is futile and my face is surely desert.
                C: I wake up from an earring sensation I'm being watched. John is bent over next to my head, staring at me. Jolene is standing by the door with her rifle aimed at his head.
                    Actions:
                        Shout, meaningless. She fires at John and it's a clean shot. But the bullet goes straight through him. I'wont make it. Jolene appears unmoved by the event.
                        Run, there is not time. She fires at John and it's a clean shot. But the bullet goes straight through him. I'wont make it.

                        If has the helmet: Jolene fires at John and it's a clean shot. But the bullet goes straight through him. Good thing I slept with the helmet on.
                            If has washed clothes: Jolene lowers her rifle and smiles at me. She likes me she says, I smell good.
                            If has not: Jolene aims at me now and fires her last round.
Location _Outside_
    Actions:
        If washed your face: My chin itches again, and I scratch it. Now my chin is in my hand.
        - Turn left to the lake
        - Go straight to the bus stop

Location _Bus stop_
    Actions:
        - Steal a bike
            [Cut yourself against the rusty texture if it is wet outside | Fail | Succeed]
                Succeed
                    [Slip on the ice and die if no helmet | Successfully arrive at the city]
                Cut yourself against the rusty texture
                    [Get blood poisoning if has no medical utensils | Alright if has medical utensils]
        - Wait for a bus
            I see something in the distance, it's headlights.
                [Wait | Run]
                    Wait
                        There is shouting and gunfire
                            [Wait | Run]
                                Wait
                                    They stop next to me, asks me if I want a ride. You arrive at the city.
                                Run
                                    I run, but they see me. There is a loud noise, and then it's dark.
                    Run, comes back to outside the house

Location _Lake_
    Actions:
        Only If icy
            - Go out on the ice
                The adrenaline is a comforting sensation as the ice begins to break, I fall in and give up.
            - Shout
                My voice travels faster over water and ice, someone from somewhere shouts back
                    [Investigate | Run]
                    Investigate
                        If has coat on: I look for hours and I find myself back to where I started. Perhaps I better go back.
                        If not: I shout again but here nothing back, but after hours in the cold I cannot find my way back. I won't make it back.
                    Run, comes back to outside the house

        - Dip your toes
            My toe nails turn brown the instance i bring them out of the water. This wasn't a very good idea.
        - Wash your clothes in the lake
            Clean clothes, but they itch a bit now.
        - Jump in
            My skin itches, and I itch it. My skin falls off, and I bleed to death.
       - Look around
            I find this large flower pot, it seems dirty though. But next to it is a helmet. It seems alright.

        Only If rainy
            - Look around (replaces above)
                I find this large flower pot, seems clean. Maybe its from the rain.
            If has flower pot:
                - Fill pot with rain
                - Fill pot with water from the lake
            If has pot with water:
                - Wash clothes in pot of water

Location _City_
    Actions:
        - Go to the Pharmacy
            Icy
                You get some drugs. Might be useful.
            Rainy, Wet
                The ceiling is leaking water, the drugs that are left are useless.
            Clear, sunny
                This place has been emptied out.
        - Go to the Supermarket
            Rainy, Icy, Wet
                You get some food
            Clear, Sunny
                You're not alone
                    [Shoot at them (if have a gun), Run]
                    Shoot at them
                        If practiced, you hit them. You find some drugs from the pharmacy that might be useful. And get some food.
                        -X- If not, you fire and miss. I found myself thinking of high school when they beat me up. I don't think someone will help me this time around though.
                    Run, you find yourself at the bus stop again but exhausted
        - Look around
            There is a lot of stuff laying around, but three things stick out to me.
                - A stack of newspaper, looks like they've been put to cover something.
                    I find a gun, it has some rounds in it.
                - A black purse
                    -!!!- I find some spray, but its leaking and when i pick it up it explodes in my hand. I think i'm blind. (All options now appear labeled with numbers instead of text)
 */

/*

I wake up, the clock is 10 am.

It's cold in here, should I _get dressed_ or should I _check the radiator_ first?
    check the radiator
        It's burning. Must have caught a cold.
    get dressed
        These clothes are dirty, but I cannot waste the water to wash them and the lake is poising.

When i walk into the living room there is no one there, they must still be sleeping.

I go outside and take a left to [_forrest_ | _bus stop_ | _lake_]
    forrest


 */