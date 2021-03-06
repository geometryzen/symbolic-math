import { ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_POW } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_rat_rat } from "../mul/is_mul_2_rat_rat";
import { is_rat } from "../rat/RatExtension";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<Rat, BCons<Sym, Rat, Rat>> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('pow_2_rat_mul_2_rat_rat', MATH_POW, is_rat, and(is_cons, is_mul_2_rat_rat), $);
    }
    transform2(opr: Sym, lhs: Rat, rhs: Cons, expr: BCons<Sym, Rat, Cons>): [TFLAGS, U] {
        return [TFLAG_NONE, expr];
    }
}

export const pow_2_rat_mul_2_rat_rat = new Builder();
