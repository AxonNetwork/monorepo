/**
    Utility function that generates instances of a class.
 */
export function construct (constructor: Function, args: any[]) {
    const c: any = function (this: any) {
        return constructor.apply(this, args)
    }
    c.prototype = constructor.prototype
    Object.defineProperty(c, 'name', { value: (constructor as any).name })
    return new c()
}

/**
    Simplifies the creation of class decorators for the most common use case.  Example:

        const debugPrintable = utils.makeClassDecorator(function (original, ...args) {
            const obj = utils.construct(original, args)
            obj.debugPrint = function () { console.debug(this) }.bind(obj)
            return obj
        })

        @debugPrintable
        class Blah {
            hello = 'yarrr'

            constructor() {
                console.log('original constructor', this)      // "{hello: 'yarrr'}"
                console.log('instance?', this instanceof Blah) // "true"
            }

            debugPrint: () => void;
        }

        const x = new Blah()
        x.debugPrint()         // works

 */
export function makeClassDecorator <C> (closure: (original: any, args: any[]) => C) {
    return function (target: C) {
        // save a reference to the original constructor
        const original = target

        // the new constructor behaviour
        const wrapper: any = function (this: any, ...args: any[]) {
            return closure.bind(this, original, args)()
        }

        // copy prototype so intanceof operator still works
        wrapper.prototype = (original as any).prototype
        Object.defineProperty(wrapper, 'name', { value: (original as any).name })

        // return new constructor (will override original)
        return wrapper
    }
}
