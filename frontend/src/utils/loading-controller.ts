import {computed, ComputedRef, Ref, ref, watch} from 'vue'

export default class LoadingController {
    private minDuration: number
    private taskCount: Ref<number>
    private conditions: Ref<Array<() => boolean>>
    private timeout: Ref<number | null>
    private loading: ComputedRef<boolean>

    constructor(minDuration: number = 0) {
        this.minDuration = minDuration
        this.taskCount = ref(0)
        this.conditions = ref(new Array<() => boolean>())
        this.timeout = ref(null)
        this.loading = computed(() => {
            if (this.taskCount.value > 0) {
                return true
            }
            for (const condition of this.conditions.value) {
                if (condition()) {
                    return true
                }
            }
            return this.timeout.value !== null
        })
        watch(this.loading, (value, oldValue) => {
            if (!oldValue && value && this.minDuration !== 0 && this.timeout.value === null) {
                this.timeout.value = setTimeout(() => {
                    this.timeout.value = null
                }, this.minDuration)
            }
        })
    }

    getLoading(): ComputedRef<boolean> {
        return this.loading
    }

    exec<T>(task: () => Promise<T>): Promise<T> {
        this.taskCount.value++
        let promise: Promise<T>
        try {
            promise = task()
        } catch (e) {
            this.taskCount.value--
            throw e
        }
        return new Promise<T>((resolve, reject) => {
            promise.then(value => {
                this.taskCount.value--
                resolve(value)
            }, (e) => {
                this.taskCount.value--
                reject(e)
            })
        })
    }

    when(condition: () => boolean) {
        this.conditions.value.push(condition)
    }

    removeWhen(condition: () => boolean) {
        const index = this.conditions.value.indexOf(condition)
        if (index !== -1) {
            this.conditions.value.splice(index, 1)
        }
    }

    setMinDuration(minDuration: number) {
        if (this.timeout.value !== null) {
            clearTimeout(this.timeout.value)
        }
        this.timeout.value = null
        this.minDuration = minDuration
    }
}