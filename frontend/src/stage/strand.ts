import {Element, Group, Line, Star} from 'zrender'
import Firecracker from './firecracker.ts'
import {StrandType} from '../model.ts'

const UNIT_LENGTH = 25

export default class Strand {
    private disposed: boolean
    private type: StrandType
    private ignited: boolean
    private percent: number
    private container: Group
    private fireCrackersContainer: Group
    private firecrackers: Array<Firecracker>
    private blastingFuse: Line
    private spark: Star

    constructor(type: StrandType) {
        this.disposed = false
        this.type = type
        const {firecrackersCount, firecrackersOffset, blastingFuseLength} = attributesForType(type)
        this.ignited = false
        this.percent = 0
        this.container = new Group()
        this.fireCrackersContainer = new Group()
        this.container.add(this.fireCrackersContainer)
        this.firecrackers = new Array<Firecracker>()
        for (let i = 0; i < firecrackersCount; i++) {
            const firecracker = new Firecracker()
            firecracker.getContainer().attr({
                y: (i + firecrackersOffset) * UNIT_LENGTH,
                rotation: Math.abs(i - firecrackersOffset) % 2 === 0 ? -0.9 : 0.9
            })
            this.fireCrackersContainer.add(firecracker.getContainer())
            this.firecrackers.push(firecracker)
        }
        this.blastingFuse = new Line({
            shape: {
                x1: 0, y1: firecrackersOffset * UNIT_LENGTH,
                x2: 0, y2: (firecrackersOffset + blastingFuseLength) * UNIT_LENGTH,
                percent: 1
            },
            style: {
                lineWidth: 2
            }
        })
        this.container.add(this.blastingFuse)
        this.spark = new Star({
            shape: {
                cx: 0,
                cy: 0,
                r: 5,
                n: 8
            },
            style: {
                fill: '#ffc02b'
            },
            zlevel: 1,
            invisible: true
        })
        this.container.add(this.spark)
    }

    ignite(duration = 5000, fromPercent = 0) {
        fromPercent = Math.max(0, Math.min(fromPercent, 1))
        if (this.disposed) {
            return
        }
        if (this.ignited) {
            this.reset()
        }
        const {firecrackersOffset, blastingFuseLength} = attributesForType(this.type)
        this.ignited = true
        this.percent = fromPercent
        const keyPoints = this.firecrackers.map<KeyPoint>((firecracker, i) => {
            return {
                firecracker,
                percent: 1 - i / blastingFuseLength
            }
        })
        this.blastingFuse.setShape({
            percent: 1 - fromPercent
        })
        this.spark.attr({
            invisible: false
        })
        while (keyPoints.length > 0 && fromPercent >= keyPoints[keyPoints.length - 1].percent) {
            keyPoints.pop()?.firecracker.forwardToLast()
        }
        this.blastingFuse.animateTo({
            shape: {
                percent: 0
            }
        }, {
            duration: duration * (1 - fromPercent),
            during: (percent) => {
                const totalPercent = fromPercent + (1 - fromPercent) * percent
                this.percent = totalPercent
                this.spark.setShape({
                    cy: (blastingFuseLength * (1 - totalPercent) + firecrackersOffset) * UNIT_LENGTH
                })
                while (keyPoints.length > 0 && totalPercent >= keyPoints[keyPoints.length - 1].percent) {
                    keyPoints.pop()?.firecracker.ignite()
                }
            },
            done: () => {
                this.percent = 1
                this.spark.attr({
                    invisible: true
                })
                keyPoints.forEach((keyPoint) => keyPoint.firecracker.ignite())
            }
        })
    }

    forwardToLast() {
        if (this.disposed) {
            return
        }
        this.ignited = true
        this.percent = 1
        for (const firecracker of this.firecrackers) {
            firecracker.forwardToLast()
        }
        this.blastingFuse.stopAnimation()
        this.blastingFuse.setShape({
            percent: 0
        })
        this.spark.attr({
            invisible: true
        })
    }

    reset(type?: StrandType) {
        if (this.disposed) {
            return
        }
        if (type) {
            this.type = type
        }
        const {firecrackersCount, firecrackersOffset, blastingFuseLength} = attributesForType(this.type)
        this.ignited = false
        this.percent = 0
        const firecrackers = new Array<Firecracker>()
        for (let i = firecrackersCount; i < this.firecrackers.length; i++) {
            const firecracker = this.firecrackers[i]
            firecracker.dispose()
            this.fireCrackersContainer.remove(firecracker.getContainer())
        }
        for (let i = 0; i < firecrackersCount; i++) {
            let firecracker: Firecracker
            if (i < this.firecrackers.length) {
                firecracker = this.firecrackers[i]
                firecracker.reset()
            } else {
                firecracker = new Firecracker()
                this.fireCrackersContainer.add(firecracker.getContainer())
            }
            firecracker.getContainer().attr({
                y: (i + firecrackersOffset) * UNIT_LENGTH,
                rotation: Math.abs(i - firecrackersOffset) % 2 === 0 ? -0.9 : 0.9
            })
            firecrackers.push(firecracker)
        }
        this.firecrackers = firecrackers
        this.blastingFuse.stopAnimation()
        this.blastingFuse.setShape({
            x1: 0, y1: firecrackersOffset * UNIT_LENGTH,
            x2: 0, y2: (firecrackersOffset + blastingFuseLength) * UNIT_LENGTH,
            percent: 1
        })
        this.spark.attr({
            shape: {
                cy: 0
            },
            invisible: true
        })
    }

    dispose() {
        if (this.disposed) {
            return
        }
        this.disposed = true
        for (const firecracker of this.firecrackers) {
            firecracker.dispose()
        }
        this.container.removeAll()
    }

    isDisposed(): boolean {
        return this.disposed
    }

    getType(): StrandType | null {
        return this.type
    }

    isIgnited(): boolean {
        return this.ignited
    }

    getPercent(): number {
        return this.percent
    }

    getContainer(): Element {
        return this.container
    }
}

interface KeyPoint {
    firecracker: Firecracker,
    percent: number
}

function attributesForType(type: StrandType | null): {
    firecrackersCount: number,
    firecrackersOffset: number,
    blastingFuseLength: number
} {
    let firecrackersCount = 0
    let firecrackersOffset = 0
    let blastingFuseLength = 0
    switch (type) {
        case 'single':
            firecrackersCount = 26
            firecrackersOffset = 0
            blastingFuseLength = 32
            break
        case 'first':
            firecrackersCount = 30
            firecrackersOffset = -4
            blastingFuseLength = 36
            break
        case 'middle':
            firecrackersCount = 54
            firecrackersOffset = -4
            blastingFuseLength = 54
            break
        case 'last':
            firecrackersCount = 50
            firecrackersOffset = 0
            blastingFuseLength = 50
            break
    }
    return {firecrackersCount, firecrackersOffset, blastingFuseLength}
}