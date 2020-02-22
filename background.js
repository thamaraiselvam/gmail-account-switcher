const switcher = require('./index')
class EventsModule {
    constructor(){
        this.observe()
    }
    observe() {
        chrome.commands.onCommand.addListener(function(command) {
            if(command == 'current-tab-1'){
                switcher.switch(1)
            }
        });
    }

    getKeyandNavigationTarget(command){

        if (command.length == 0 ||  !command.includes('-tab-')){
            throw new Error('invalid command')
        }

        let result = {}

        result['target'] = command.includes('new') ? 'new': 'current'
        result['key'] = command.split('-tab-')[1]

        return result
    }
}

module.exports = new EventsModule();
