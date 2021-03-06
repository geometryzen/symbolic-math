import { Extension, ExtensionEnv, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_HYP } from "../../hashing/hash_info";
import { epsilon, Hyp } from "../../tree/hyp/Hyp";
import { U } from "../../tree/tree";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";

class HypExtension implements Extension<Hyp> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor($: ExtensionEnv) {
        // Nothing to see here.
    }
    get key() {
        return epsilon.name;
    }
    get hash() {
        return HASH_HYP;
    }
    get name() {
        return 'HypExtension';
    }
    transform(expr: U): [TFLAGS, U] {
        return [expr instanceof Hyp ? TFLAG_HALT : TFLAG_NONE, expr];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(expr: Hyp, $: ExtensionEnv): U {
        throw new Error("Hyp Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(expr: Hyp): boolean {
        return false;
    }
    isKind(arg: U): arg is Hyp {
        return arg instanceof Hyp;
    }
    isMinusOne(): boolean {
        return false;
    }
    isOne(): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: Hyp): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: Hyp): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: Hyp): boolean {
        return false;
    }
    isZero(): boolean {
        // A hyperreal is non-zero and small than every real number.
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    one(zero: Hyp, $: ExtensionEnv): Hyp {
        // Hyp does not have a zero value.
        throw new Error();
    }
    subst(expr: Hyp, oldExpr: U, newExpr: U): U {
        if (this.isKind(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(hyp: Hyp, $: ExtensionEnv): string {
        throw new Error("HypExtension.toInfixString Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(hyp: Hyp, $: ExtensionEnv): string {
        throw new Error("HypExtension.toLatexString Method not implemented.");
    }
    toListString(hyp: Hyp): string {
        return hyp.printname;
    }
}

/**
 * The hyperreal Extension.
 */
export const hypExtensionBuilder = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new HypExtension($);
});