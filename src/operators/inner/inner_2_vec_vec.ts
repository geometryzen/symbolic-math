
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { MATH_INNER } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { is_blade } from "../blade/is_blade";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Blade1 | Blade2 => Blade1.scp(Blade2)
 */
class Op extends Function2<Blade, Blade> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('inner_2_vec_vec', MATH_INNER, is_blade, is_blade, $);
    }
    transform2(opr: Sym, lhs: Blade, rhs: Blade): [TFLAGS, U] {
        return [TFLAG_DIFF, lhs.scp(rhs)];
    }
}

export const inner_2_vec_vec = new Builder();
