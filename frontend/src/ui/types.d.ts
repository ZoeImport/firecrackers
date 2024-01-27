declare module 'qrcode/lib/browser.js' {
    interface Options {
        version?: number,
        errorCorrectionLevel?: 'low' | 'medium' | 'quartile' | 'high' | 'L' | 'M' | 'Q' | 'H'
        maskPattern?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
        toSJISFunc?: Function
        margin?: number
        scale?: number
        small?: boolean
        width?: number
        color?: {
            dark?: string
            light?: string
        }
    }

    interface ToDataURLOptions extends Options {
        type?: 'image/png' | 'image/jpeg' | 'image/webp'
        rendererOpts?: {
            quality?: number
        }
    }

    export function toDataURL(text: string, options: ToDataURLOptions, callback: (error: any, url: string) => void): void
}