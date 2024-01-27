import {Element, Group, Rect, Circle, Path, PathProps} from 'zrender'

export default class Match {
    private container: Group

    constructor() {
        this.container = new Group({
            draggable: true
        })

        const stick = new Rect({
            shape: {
                x: 0,
                y: 0,
                width: 200,
                height: 10
            },
            style: {
                stroke: '#000',
                fill: '#9c6400'
            },
            originX: 0,
            originY: 5,
            rotation: -0.6,
            zlevel: 3
        })
        this.container.add(stick)

        const head = new Circle({
            shape: {
                cx: 0,
                cy: 5,
                r: 10
            },
            style: {
                fill: '#000'
            },
            zlevel: 3,
            silent: true
        })
        this.container.add(head)

        const outerFlame = new Flame({
            style: {
                fill: '#ff2e2e',
                stroke: '#000',
                lineWidth: 3,
                opacity: 0.5
            },
            shape: {
                heightOffset: 0
            },
            scaleX: 1,
            scaleY: 1,
            zlevel: 3,
            silent: true
        })
        const innerFlame = new Flame({
            style: {
                fill: '#ffb62e',
                stroke: '#000',
                lineWidth: 3,
                opacity: 0.5
            },
            shape: {
                heightOffset: 0
            },
            scaleX: 0.6,
            scaleY: 0.6,
            zlevel: 3,
            silent: true
        })
        outerFlame.animate('shape', true)
            .when(100, {
                heightOffset: 10
            })
            .when(100, {
                heightOffset: 0
            }).start()
        innerFlame.animate('shape', true)
            .when(100, {
                heightOffset: 10
            })
            .when(100, {
                heightOffset: 0
            }).start()
        this.container.add(outerFlame)
        this.container.add(innerFlame)
    }

    getContainer(): Element {
        return this.container
    }
}

class FlameShape {
    heightOffset = 0
}

export interface FlameProps extends PathProps {
    shape?: Partial<FlameShape>
}

class Flame extends Path<FlameProps> {
    constructor(props?: FlameProps) {
        super(props)
    }

    buildPath(ctx: CanvasRenderingContext2D, shape: FlameShape) {
        ctx.moveTo(-25, 0)
        ctx.bezierCurveTo(-25, 40, 25, 40, 25, 0)
        ctx.bezierCurveTo(25, -25, 20, -50, 0, -100 - shape.heightOffset)
        ctx.bezierCurveTo(-20, -50, -25, -25, -25, 0)
    }
}