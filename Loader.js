const path = require("path")
const Base = require("lan-core/Loader")

const extend_node = require("./extend_node")

module.exports = class Loader extends Base
{
    constructor(lan, options)
    {
        super(lan, options)
    }

    load(template)
    {
        const whole = path.resolve(this.options.search, template)

        const component = require(whole)

        return async (node, ...args) =>
        {
            const loop = extend_node(node, component)

            await node.start(...args)

            await loop()

            await node.stop()

            node.confirm_dead()
        }
    }
}
