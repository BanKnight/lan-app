const default_component = require("./default_component")

module.exports = (node, component) =>
{
    extend_component(node, default_component)
    extend_component(node, component)

    async function handle_resp(msg)
    {
        if (node.$curr == null)
        {
            return
        }

        if (node.$curr.session != msg.session)
        {
            return
        }

        node.$curr.resolve(msg)
    }

    async function handle_event(msg)
    {

    }

    async function handle_main(msg)
    {
        await node[msg.method](msg)
    }

    async function loop_main()
    {
        while (true)
        {
            const msg = node.$queues.main.pop()

            if (msg == null)
            {
                break
            }

            switch (msg.method)
            {
                case "$e":          //event
                    await handle_event(msg)
                    break
                default:
                    handle_main(msg)
                    break
            }

            //Todo handle fork
        }
    }

    return async () =>
    {
        setImmediate(loop_main)

        while (node.alive)
        {
            const msg = await node.pop()

            if (msg instanceof Error)
            {
                continue
            }

            console.log(node.id, "recv msg from", msg.from, msg.method, msg.body)

            switch (msg.method)
            {
                case "$r":
                case "$e":
                    handle_resp(msg)
                    break
                default:
                    node.$queues.main.push(msg)
                    break
            }
        }
    }
}

function extend_component(node, component)
{
    component.middlewares = component.middlewares || []
    component.methods = component.methods || []

    const data = component.data()

    if (data)
    {
        Object.assign(node, data)
    }

    node.$middlewares = node.$middlewares || []

    for (let func of component.middlewares)
    {
        let middleware = func(node)             //Todo options

        node.$middlewares.push(middleware)
    }

    for (let key in component.methods)
    {
        let method = component.methods[key]

        node[key] = method.bind(node)
    }

    if (component.start)
    {
        node.start = component.start.bind(node)
    }
    else
    {
        node.start = () => { }
    }

    if (component.stop)
    {
        node.stop = component.stop.bind(node)
    }
    else
    {
        node.stop = () => { }
    }
}




