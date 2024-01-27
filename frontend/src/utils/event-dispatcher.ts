export default class EventDispatcher<T> {
    private listeners: Array<Listener<T>>

    constructor() {
        this.listeners = new Array<Listener<T>>()
    }

    addListener(listener: Listener<T>) {
        if (this.listeners.indexOf(listener) == -1) {
            this.listeners.push(listener)
        }
    }

    removeListener(listener: Listener<T>) {
        const index = this.listeners.indexOf(listener)
        if (index !== -1) {
            this.listeners.splice(index, 1)
        }
    }

    clearListeners() {
        this.listeners = new Array<Listener<T>>()
    }

    dispatchEvent(event: T) {
        for (const listener of this.listeners) {
            try {
                listener(event)
            } catch (e) {
                console.log(e)
            }
        }
    }
}

type Listener<T> = (e: T) => boolean | void