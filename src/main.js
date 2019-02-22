const EventEmitter = require('events');
const stringSimilarity = require('./common/stringSimilarity')
const unzip = require('./common/unzip')
const searchModules = require('./searchModules');
const humanizeString = require('./common/humanizeString');

module.exports = class NodeGreekSubs extends EventEmitter {
    constructor(originalName) {
        super()
        this.originalName = humanizeString(originalName);
    }

    async search() {

        let results = searchModules.map(searchModule => this._search(searchModule))

        results = await Promise.all(results);
        results = results.reduce((prev, curr) => [...prev, ...curr], [])

        if(results.length === 0) return [];

        results = stringSimilarity(this.originalName, results)

        const zipBuffer = await this.download(results);
        return await unzip(zipBuffer)

    }

    async _search(searchModule) {
        let name = this.originalName;
        let results = [];

        do {
            try {
                this.emit('search::start', {
                    searchModule: searchModule.name,
                    query: name
                })
                results = await searchModule.collector(name)
                this.emit('search::finish', {
                    searchModule: searchModule.name,
                    query: name,
                    results
                })

            } catch (error) {
                this.emit('search::error', {
                    searchModule: searchModule.name,
                    query: name,
                    error
                })
            }
            name = name.slice(0, name.lastIndexOf(" "))
        } while (results.length === 0 && name.lastIndexOf(" ") > -1);


        return results.map(result => ({ ...result, searchModule }));
    }

    async download(results) {
        let result;
        for (const { url, searchModule } of results) {
            try {
                this.emit('download::start', {
                    searchModule: searchModule.name,
                    url
                })
                result = await searchModule.download(url);
                this.emit('download::finish', {
                    searchModule: searchModule.name,
                    url,
                    result
                })
                break;
            } catch (error) {
                this.emit('download::error', {
                    searchModule: searchModule.name,
                    url,
                    error
                })
            }
        }
        return result;
    }
}