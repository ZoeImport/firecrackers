import {init as zrenderInit, registerPainter, ZRenderType, Group} from 'zrender'
import CanvasPainter from 'zrender/lib/canvas/Painter'
import Strand from './strand.ts'
import Match from './match.ts'
import EventDispatcher from '../utils/event-dispatcher.ts'
import {StrandType} from '../model.ts'

registerPainter('canvas', CanvasPainter)

export default class Stage {
    private disposed: boolean
    private strandType: StrandType | null
    private zrender: ZRenderType
    private container: Group
    private strand: Strand
    private match: Match
    private strandCatchFireTimeout: number | null
    private strandCatchFireEventDispatcher: EventDispatcher<void>

    constructor(props: StageProps) {
        const {canvas, width, height, strandType} = props
        this.disposed = false
        this.strandType = strandType
        this.zrender = zrenderInit(canvas, {
            width,
            height
        })
        this.container = new Group({
            x: width / 2,
            scaleX: height / 1250,
            scaleY: height / 1250
        })
        this.zrender.add(this.container)
        this.strand = new Strand(strandType)
        const strandContainer = this.strand.getContainer()
        strandContainer.attr({
            silent: true
        })
        this.container.add(strandContainer)
        this.match = new Match()
        const matchContainer = this.match.getContainer()
        matchContainer.attr({
            x: -100,
            y: 1000
        })
        if (strandType === 'single' || strandType === 'first') {
            this.container.add(matchContainer)
        }

        this.strandCatchFireEventDispatcher = new EventDispatcher<void>()
        this.strandCatchFireTimeout = null
        const strandCatchFireTimeoutHandler = () => {
            this.strandCatchFireEventDispatcher.dispatchEvent()
            this.strandCatchFireTimeout = null
        }
        matchContainer.on('drag', () => {
            if (this.strand.isIgnited()) {
                if (this.strandCatchFireTimeout !== null) {
                    clearTimeout(this.strandCatchFireTimeout)
                    this.strandCatchFireTimeout = null
                }
            } else {
                const {x, y} = matchContainer
                if (isPointInTriangle(0, 800, x - 30, y + 30, x + 30, y + 30, x, y - 120)) {
                    if (this.strandCatchFireTimeout === null) {
                        this.strandCatchFireTimeout = setTimeout(strandCatchFireTimeoutHandler, 1000)
                    }
                } else {
                    if (this.strandCatchFireTimeout !== null) {
                        clearTimeout(this.strandCatchFireTimeout)
                        this.strandCatchFireTimeout = null
                    }
                }
            }
        })
        matchContainer.on('dragend', () => {
            matchContainer.attr({
                x: -100,
                y: 1000
            })
            if (this.strandCatchFireTimeout !== null) {
                clearTimeout(this.strandCatchFireTimeout)
                this.strandCatchFireTimeout = null
            }
        })
    }

    resize(width: number, height: number) {
        if (this.disposed) {
            return
        }
        this.zrender.resize({width, height})
        this.container.attr({
            x: width / 2,
            scaleX: height / 1250,
            scaleY: height / 1250
        })
    }

    igniteStrand(duration?: number, fromPercent?: number) {
        if (this.disposed) {
            return
        }
        this.strand.ignite(duration, fromPercent)
        if (this.strandCatchFireTimeout !== null) {
            clearTimeout(this.strandCatchFireTimeout)
            this.strandCatchFireTimeout = null
        }
    }

    strandForwardToLast() {
        if (this.disposed) {
            return
        }
        this.strand.forwardToLast()
        if (this.strandCatchFireTimeout !== null) {
            clearTimeout(this.strandCatchFireTimeout)
            this.strandCatchFireTimeout = null
        }
    }

    reset(strandType?: StrandType) {
        if (this.disposed) {
            return
        }
        if (strandType) {
            this.strandType = strandType
        }
        this.strand.reset(strandType)
        const matchContainer = this.match.getContainer()
        if (strandType === 'single' || strandType === 'first') {
            this.container.add(matchContainer)
            matchContainer.attr({
                x: -100,
                y: 1000
            })
        } else {
            this.container.remove(matchContainer)
        }
        if (this.strandCatchFireTimeout !== null) {
            clearTimeout(this.strandCatchFireTimeout)
            this.strandCatchFireTimeout = null
        }
    }

    addStrandCatchFireListener(listener: () => void) {
        if (this.disposed) {
            return
        }
        this.strandCatchFireEventDispatcher.addListener(listener)
    }

    removeStrandCatchFireListener(listener: () => void) {
        if (this.disposed) {
            return
        }
        this.strandCatchFireEventDispatcher.removeListener(listener)
    }

    dispose() {
        if (this.disposed) {
            return
        }
        this.disposed = true
        this.strand.dispose()
        this.zrender.dispose()
        this.strandCatchFireEventDispatcher.clearListeners()
    }

    isDisposed(): boolean {
        return this.disposed
    }

    getStandType(): StrandType | null {
        return this.strandType
    }

    isStrandIgnited(): boolean {
        return this.strand.isIgnited()
    }

    getStrandPercent(): number {
        return this.strand.getPercent()
    }
}

interface StageProps {
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    strandType: StrandType
}

function isPointInTriangle(px: number, py: number, ax: number, ay: number, bx: number, by: number, cx: number, cy: number): boolean {
    const pax = ax - px
    const pay = ay - py
    const pbx = bx - px
    const pby = by - py
    const pcx = cx - px
    const pcy = cy - py
    const t1 = pax * pby - pay * pbx
    const t2 = pbx * pcy - pby * pcx
    const t3 = pcx * pay - pcy * pax
    return (t1 >= 0 && t2 >= 0 && t3 >= 0) || (t1 <= 0 && t2 <= 0 && t3 <= 0)
}