const Lan = require("lan-core")

const Loader = require("./Loader")

module.exports = class App extends Lan
{
    constructor(options)
    {
        options.Loader = Loader

        super(options)
    }
}