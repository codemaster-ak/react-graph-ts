class Connection {
    from: string
    to: string
    weight: number
    colour: string
    key: string

    constructor(from: string, to: string, weight: number, colour = 'black', key: string) {
        this.from = from
        this.to = to
        this.weight = weight
        this.colour = colour
        this.key = key
    }
}

export default Connection;