class Switcher {
    async switch(replacer){
        const tab = await chrome.tabs.getCurrent();
        if (tab != undefined && tab.hasOwnProperty('url')) {
            sourceURL = tab.url.toString();
            destination = replaceURL(sourceURL, replacer)
            redirectTo(destination)
        } else {
            console.error('gmail-account-switcher', 'Cannot get current tab')
        }
    }
    replaceURL(sourceURL, replacer) {
        if (sourceURL.length == 0) {
            throw new Error("source url cannot be empty")
        }

        if ( replacer.length == 0) {
            throw new Error('replace value cannot be empty')
        }

        const urls = this.sourceAndReplaceStrings(sourceURL, replacer)
        return sourceURL.replace(urls.source, urls.replace)
    }

    sourceAndReplaceStrings(sourceURL, replacer){
        let re = new RegExp(/(mail\/u\/)(.)(\/#inbox)/gm);
        let matches = re.exec(sourceURL)
        return {
            source: matches[0],
            replace: `${matches[1]}${replacer}${matches[3]}`
        }
    }

    redirectTo(destination){
        return chrome.tabs.update({url: destination, active: true});
    }
}

module.exports = new Switcher()
