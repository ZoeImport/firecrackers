import {Element, Group, Image, BezierCurve, Circle, Star, vector} from 'zrender'
import firecrackerBodyImage from '../assets/firecracker-body.svg'
import firecrackerBoomAudio from '../assets/firecracker-boom.mp3'

const BOODY_LIFE = 200
const BLASTING_FUSE_SPEED = 200 / 1000
const PARTICLE_COUNT_MIN = 150
const PARTICLE_COUNT_MAX = 200
const PARTICLE_X_MIN = -25
const PARTICLE_X_MAX = 25
const PARTICLE_Y_MIN = 28
const PARTICLE_Y_MAX = 178
const PARTICLE_CENTER = [(PARTICLE_X_MAX + PARTICLE_X_MIN) / 2, (PARTICLE_Y_MAX + PARTICLE_Y_MIN) / 2]
const PARTICLE_SIZE_MIN = 2
const PARTICLE_SIZE_MAX = 5
const PARTICLE_COLOR_HUE_MIN = 0
const PARTICLE_COLOR_HUE_MAX = 60
const PARTICLE_COLOR_SATURATION_MIN = 50
const PARTICLE_COLOR_SATURATION_MAX = 100
const PARTICLE_COLOR_LIGHTNESS_MIN = 40
const PARTICLE_COLOR_LIGHTNESS_MAX = 60
const PARTICLE_LIFE_MIN = 500
const PARTICLE_LIFE_MAX = 800
const PARTICLE_V_MIN = 250 / 1000
const PARTICLE_V_MAX = 250 / 1000
const PARTICLE_AY = 500 / 1000000

export default class Firecracker {
    private disposed: boolean
    private ignited: boolean
    private container: Group
    private body: Image
    private blastingFuse: BezierCurve
    private spark: Star
    private particleEffects: ParticleEffects
    private audioPlayer: HTMLAudioElement

    constructor() {
        this.disposed = false
        this.ignited = false
        this.container = new Group()
        this.body = new Image({
            style: {
                image: firecrackerBodyImage,
                x: -25,
                y: 28,
                width: 50,
                height: 150,
                opacity: 1
            }
        })
        this.container.add(this.body)
        this.blastingFuse = new BezierCurve({
            shape: {
                x1: 0, y1: 36,
                cpx1: -10, cpy1: 24,
                cpx2: 10, cpy2: 12,
                x2: 0, y2: 0,
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
        this.particleEffects = new ParticleEffects()
        this.container.add(this.particleEffects.getContainer())
        this.audioPlayer = new Audio()
        this.audioPlayer.src = firecrackerBoomAudio
    }

    ignite() {
        if (this.disposed) {
            return
        }
        if (this.ignited) {
            this.reset()
        }
        this.ignited = true
        this.spark.attr({
            invisible: false
        })
        this.blastingFuse.animateTo({
            shape: {
                percent: 0
            }
        }, {
            duration: Math.round(36 / BLASTING_FUSE_SPEED),
            during: (t) => {
                const {x1, y1, cpx1, cpy1, cpx2, cpy2, x2, y2} = this.blastingFuse.shape
                this.spark.setShape({
                    cx: x1 * Math.pow(t, 3) + 3 * cpx1 * Math.pow(t, 2) * (1 - t) + 3 * cpx2! * t * Math.pow(1 - t, 2) + x2 * Math.pow(1 - t, 3),
                    cy: y1 * Math.pow(t, 3) + 3 * cpy1 * Math.pow(t, 2) * (1 - t) + 3 * cpy2! * t * Math.pow(1 - t, 2) + y2 * Math.pow(1 - t, 3)
                })
            },
            done: () => {
                this.spark.attr({
                    invisible: true
                })
                this.body.animateTo({
                    style: {
                        opacity: 0
                    }
                }, {
                    duration: BOODY_LIFE
                })
                this.particleEffects.play()
                this.audioPlayer.play()
            }
        })
    }

    forwardToLast() {
        if (this.disposed) {
            return
        }
        this.ignited = true
        this.body.stopAnimation()
        this.body.setStyle({
            opacity: 0
        })
        this.blastingFuse.stopAnimation()
        this.blastingFuse.setShape({
            percent: 0
        })
        this.spark.attr({
            invisible: true
        })
        this.particleEffects.reset()
        this.audioPlayer.pause()
        this.audioPlayer.currentTime = 0
    }

    reset() {
        if (this.disposed) {
            return
        }
        this.ignited = false
        this.body.stopAnimation()
        this.body.setStyle({
            opacity: 1
        })
        this.blastingFuse.stopAnimation()
        this.blastingFuse.setShape({
            percent: 1
        })
        this.spark.attr({
            shape: {
                cx: 0,
                cy: 0
            },
            invisible: true
        })
        this.particleEffects.reset()
        this.audioPlayer.pause()
        this.audioPlayer.currentTime = 0
    }

    dispose() {
        if (this.disposed) {
            return
        }
        this.disposed = true
        this.container.removeAll()
        this.audioPlayer.pause()
    }

    isDisposed(): boolean {
        return this.disposed
    }

    isIgnited(): boolean {
        return this.ignited
    }

    getContainer(): Element {
        return this.container
    }
}

class ParticleEffects {
    container: Group

    constructor() {
        this.container = new Group()
    }

    play() {
        const particleGlobalCenter = this.container.transformCoordToGlobal(PARTICLE_CENTER[0], PARTICLE_CENTER[1])
        const particleGlobalAY = PARTICLE_AY * this.container.getGlobalScale()[1]
        const particleCount = Math.floor(Math.random() * (PARTICLE_COUNT_MAX - PARTICLE_COUNT_MIN + 1)) + PARTICLE_COUNT_MIN
        for (let i = 0; i < particleCount; i++) {
            const particlePosition = [
                Math.random() * (PARTICLE_X_MAX - PARTICLE_X_MIN + 1) + PARTICLE_X_MIN,
                Math.random() * (PARTICLE_Y_MAX - PARTICLE_Y_MIN + 1) + PARTICLE_Y_MIN
            ]
            const particleGlobalPosition = this.container.transformCoordToGlobal(particlePosition[0], particlePosition[1])
            const particleSize = Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN
            const particleColorHue = Math.floor(Math.random() * (PARTICLE_COLOR_HUE_MAX - PARTICLE_COLOR_HUE_MIN + 1)) + PARTICLE_COLOR_HUE_MIN
            const particleColorSaturation = Math.floor(Math.random() * (PARTICLE_COLOR_SATURATION_MAX - PARTICLE_COLOR_SATURATION_MIN + 1)) + PARTICLE_COLOR_SATURATION_MIN
            const particleColorLightness = Math.floor(Math.random() * (PARTICLE_COLOR_LIGHTNESS_MAX - PARTICLE_COLOR_LIGHTNESS_MIN + 1)) + PARTICLE_COLOR_LIGHTNESS_MIN
            const particleColor = `hsl(${particleColorHue},${particleColorSaturation}%,${particleColorLightness}%)`
            const particleLife = Math.floor(Math.random() * (PARTICLE_LIFE_MAX - PARTICLE_LIFE_MIN + 1)) + PARTICLE_LIFE_MIN
            const particleGlobalV = [0, 0]
            vector.sub(particleGlobalV, particleGlobalPosition, particleGlobalCenter)
            vector.normalize(particleGlobalV, particleGlobalV)
            vector.scale(particleGlobalV, particleGlobalV, Math.random() * (PARTICLE_V_MAX - PARTICLE_V_MIN) + PARTICLE_V_MIN)
            vector.mul(particleGlobalV, particleGlobalV, this.container.getGlobalScale())

            const particle = new Circle({
                shape: {
                    cx: particlePosition[0],
                    cy: particlePosition[1],
                    r: particleSize
                },
                style: {
                    fill: particleColor,
                    opacity: 1
                },
                zlevel: 2
            })
            const _particle = <any>particle
            _particle._t = 0
            this.container.add(particle)

            particle.animate()
                .when(particleLife, {_t: 1})
                .during((target, percent) => {
                    const t = particleLife * percent
                    const newPosition = this.container.transformCoordToLocal(
                        particleGlobalPosition[0] + particleGlobalV[0] * t,
                        particleGlobalPosition[1] + particleGlobalV[1] * t + (particleGlobalAY * t * t / 2)
                    )
                    target.setShape({
                        cx: newPosition[0],
                        cy: newPosition[1]
                    })
                    target.setStyle({
                        opacity: 1 - percent
                    })
                })
                .done(() => {
                    this.container.remove(particle)
                })
                .aborted(() => {
                    this.container.remove(particle)
                })
                .start()
        }
    }

    reset() {
        this.container.removeAll()
    }

    getContainer(): Element {
        return this.container
    }
}