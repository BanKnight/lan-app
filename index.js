const Lan = require("lan-core")

const Loader = require("./Loader")

module.exports = class App extends Lan
{
    constructor()
    {
        super()
    }

    async init(options)
    {
        options.Loader = Loader

        await super.init(options)
    }
}