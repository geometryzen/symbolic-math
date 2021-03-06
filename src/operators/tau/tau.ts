
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_PI, MATH_TAU } from "../../runtime/ns_math";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * (tau x) => (* 2 pi x)
 */
class Op extends Function1<U> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('tau_any', MATH_TAU, is_any, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: U, expr: UCons<Sym, U>): [TFLAGS, U] {
        const two_pi = this.$.multiply(two, MATH_PI);
        const two_pi_x = this.$.multiply(two_pi, arg);
        return [TFLAG_DIFF, two_pi_x];
    }
}

export const tau = new Builder();
