export class HttpException extends Error {
    constructor(
        public readonly message: string,
        public readonly status: number,
    ) {
        super()
        this.initMessage()
    }

    public initMessage() {
        return this.message
    }

    public getStatus(): number {
        return this.status
    }
}
