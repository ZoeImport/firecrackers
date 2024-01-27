export class CancelController {
    private canceled: boolean

    constructor() {
        this.canceled = false
    }

    public cancel() {
        this.canceled = true
    }

    public exec<V>(promise: Promise<V>, onResolve?: (value: V) => void, onReject?: (e: any) => void) {
        promise.then(value => {
            if (onResolve && !this.canceled) {
                onResolve(value)
            }
        }, e => {
            if (onReject && !this.canceled) {
                onReject(e)
            }
        })
    }
}