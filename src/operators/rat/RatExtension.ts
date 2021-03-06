import { Extension, ExtensionEnv, TFLAGS, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_RAT } from "../../hashing/hash_info";
import { evaluatingAsFloat } from "../../modes/modes";
import { wrap_as_flt } from '../../tree/flt/Flt';
import { one, Rat } from "../../tree/rat/Rat";
import { U } from "../../tree/tree";
import { ExtensionOperatorBuilder } from '../helpers/ExtensionOperatorBuilder';

export function is_rat(p: unknown): p is Rat {
    return p instanceof Rat;
}

class RatExtension implements Extension<Rat> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(private readonly $: ExtensionEnv) {
        // Nothing to see here.
    }
    get key(): string {
        return one.name;
    }
    get hash(): string {
        return HASH_RAT;
    }
    get name(): string {
        return 'RatExtension';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(expr: Rat): boolean {
        return false;
    }
    isKind(arg: unknown): arg is Rat {
        return arg instanceof Rat;
    }
    isMinusOne(arg: Rat): boolean {
        return arg.isMinusOne();
    }
    isOne(arg: Rat): boolean {
        return arg.isOne();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: Rat): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: Rat): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: Rat): boolean {
        return false;
    }
    isZero(expr: Rat): boolean {
        return expr.isZero();
    }
    one(): Rat {
        return one;
    }
    subst(expr: Rat, oldExpr: U, newExpr: U): U {
        if (is_rat(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    toInfixString(rat: Rat): string {
        return rat.toInfixString();
    }
    toLatexString(rat: Rat): string {
        return rat.toInfixString();
    }
    toListString(rat: Rat): string {
        return rat.toListString();
    }
    transform(expr: U): [TFLAGS, U] {
        if (expr instanceof Rat) {
            // console.lg(`RatExtension.transform ${expr}`);
            if (this.$.getModeFlag(evaluatingAsFloat)) {
                return [TFLAG_DIFF, wrap_as_flt(expr.toNumber())];
            }
            else {
                return [TFLAG_HALT, expr];
            }
        }
        return [TFLAG_NONE, expr];
    }
    valueOf(expr: Rat): U {
        return this.transform(expr)[1];
    }
}

export const rat = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new RatExtension($);
});