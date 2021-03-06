import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_any_sym } from "./is_mul_2_any_sym";
import { is_mul_2_imu_any } from "./is_mul_2_imu_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * (X * a) * (i * Y) => (X * i) * (a * Y) 
 */
class Op extends Function2<BCons<Sym, U, Sym>, BCons<Sym, BCons<Sym, Rat, Rat>, U>> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_any_sym_mul_2_imu_sym', MATH_MUL, and(is_cons, is_mul_2_any_sym), and(is_cons, is_mul_2_imu_any), $);
        this.hash = hash_binop_cons_cons(MATH_MUL, MATH_MUL, MATH_MUL);
    }
    transform2(opr: Sym, lhs: BCons<Sym, U, Sym>, rhs: BCons<Sym, BCons<Sym, Rat, Rat>, U>): [TFLAGS, U] {
        const $ = this.$;
        const X = lhs.lhs;
        const a = lhs.rhs;
        const i = rhs.lhs;
        const Y = rhs.rhs;
        const Xi = $.valueOf(items_to_cons(MATH_MUL, X, i));
        const aY = $.valueOf(items_to_cons(MATH_MUL, a, Y));
        const retval = $.valueOf(items_to_cons(MATH_MUL, Xi, aY));
        return [TFLAG_DIFF, retval];
    }
}

export const mul_2_mul_2_any_sym_mul_2_imu_sym = new Builder();
