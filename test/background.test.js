const chai = require('chai')
const expect = chai.expect
const assert = chai.assert
const chrome = require('sinon-chrome/extensions');

describe('process oncommand values', () => {

    before(function () {
        global.chrome = chrome;
        events = require('../background')
    });

    it('should throw error for invalid on command', () => {
        const inputs = ['1', '', 'dummy']

        for (const input of inputs) {
            try {
                events.getKeyandNavigationTarget(input)
            } catch (err) {
                expect(err.message).to.equal('invalid command')
                continue
            }

            assert.fail("Error should have been thrown")
        }

    })

    it('should return pressed key and target from on command', () => {
        const tests = [
            {
                command: 'current-tab-1',
                expected: {
                    key: '1',
                    target: 'current'
                }
            },
            {
                command: 'current-tab-2',
                expected: {
                    key: '2',
                    target: 'current'
                }
            },
            {
                command: 'new-tab-9',
                expected: {
                    key: '9',
                    target: 'new'
                }
            }
        ]

        for (const test of tests) {
            actual = events.getKeyandNavigationTarget(test.command)
            expect(actual).to.deep.equal(test.expected)
        }
    })

    // it('should redirect to respective url when keybinding is pressed', () => {
    //     chrome.commands.onCommand.addListener.calledOnce = false
    //     chrome.commands.onCommand.trigger('current-tab-1')
    //     chrome.commands.onCommand.dispatch('1')
    //     assert.ok(chrome.commands.onCommand.addListener.calledOnce);
    //     assert.ok(chrome.commands.onCommand.addListener.withArgs('1').calledOnce);
    // })

    after(function () {
        chrome.flush();
        delete global.chrome;
    });
})
