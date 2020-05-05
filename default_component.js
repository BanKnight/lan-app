const Queue = require("lan-core/Queue")

module.exports = {
    data()
    {
        const queues = {
            session: 0,
            main: new Queue(),
        }
        return {
            $curr: null,
            $queue: queues
        }
    },
    init(options)
    {
        //this.new_comp("xxx",options)
        //this.add_comp("xxx")
    },
    start()
    {

    },
    uninit()
    {

    },
    stop()
    {

    },
    local: {

    },
    global: {
        async call(msg)
        {
            msg.session = ++this.session

            const promise = new Promise((resolve, reject) =>
            {
                this.send(msg)
                this.$curr = { session: this.session, resolve, reject }
            })

            const result = await promise

            this.$curr = null

            if (result.method == "$e")
            {
                throw result.body
            }

            return result.body
        }
    },

}