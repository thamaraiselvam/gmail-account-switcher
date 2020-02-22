const chai = require('chai')
const expect = chai.expect
const assert = chai.assert
const switcher = require('../index')
const chrome = require('sinon-chrome/extensions');

describe('Replace url', () => {

    it('should throw error if source url is empty', () => {
        sourceURL = ''
        replaceValue = '1'
        try {
            switcher.replaceURL(sourceURL, replaceValue)
        } catch (err) {
            expect(err.message).to.equal('source url cannot be empty')
            return
        }

        assert.fail("Error should have been thrown")
    });

    it('should return error if replace value is empty', () => {
        sourceURL = 'example.com'
        replaceValue = ''
        try {
            switcher.replaceURL(sourceURL, replaceValue)
        } catch (err) {
            expect(err.message).to.equal('replace value cannot be empty')
            return
        }

        assert.fail("Error should have been thrown")
    })

    it('should return replaced string for given source and replace values', () => {
        tests = [
            {
                sourceURL: 'https://mail.google.com/mail/u/0/#inbox',
                replaceValue: '1',
                expectedReplacedURL: 'https://mail.google.com/mail/u/1/#inbox'
            },
            {
                sourceURL: 'https://mail.google.com/mail/u/1/#inbox',
                replaceValue: '0',
                expectedReplacedURL: 'https://mail.google.com/mail/u/0/#inbox'
            },
            {
                sourceURL: 'https://mail.google.com/mail/u/0/#inbox',
                replaceValue: '2',
                expectedReplacedURL: 'https://mail.google.com/mail/u/2/#inbox'
            },
            {
                sourceURL: 'https://mail.google.com/mail/u/5/#inbox',
                replaceValue: '0',
                expectedReplacedURL: 'https://mail.google.com/mail/u/0/#inbox'
            }
        ]

        for (const test of tests) {
            actualReplacedURL = switcher.replaceURL(test.sourceURL, test.replaceValue)
            assert.equal(actualReplacedURL, test.expectedReplacedURL)
        }
    })
});

describe('Source and replace strings', () => {
    it("should return source and replace strings for given url and replace values", () => {
        const tests = [
            {
                sourceURL: 'https://mail.google.com/mail/u/0/#inbox',
                replaceValue: '1',
                expected: {
                    source: 'mail/u/0/#inbox',
                    replace: 'mail/u/1/#inbox',
                }
            },
            {
                sourceURL: 'https://mail.google.com/mail/u/0/#inbox',
                replaceValue: '2',
                expected: {
                    source: 'mail/u/0/#inbox',
                    replace: 'mail/u/2/#inbox',
                }
            },
            {
                sourceURL: 'https://mail.google.com/mail/u/1/#inbox',
                replaceValue: '0',
                expected: {
                    source: 'mail/u/1/#inbox',
                    replace: 'mail/u/0/#inbox',
                }
            }
        ]

        for (const test of tests) {
            actual = switcher.sourceAndReplaceStrings(test.sourceURL, test.replaceValue)
            expect(actual).to.deep.equal(test.expected)
        }
    })
})

describe('chrome native', () => {
    before(function () {
        global.chrome = chrome;
    });

    it('should redirect to given url', () => {
        switcher.redirectTo("https://mail.google.com/mail/u/1/#inbox");
        assert.ok(chrome.tabs.update.calledOnce, 'windows.update should be called');
        chrome.tabs.update.calledOnce = false
    })

    after(function () {
        chrome.flush();
        delete global.chrome;
    });
})
