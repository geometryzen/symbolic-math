import { TFLAG_DIFF, ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = BCons<Sym, U, U>;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * (A * B) * C => A * (B * C)
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('associate_right_mul_2_mul_2_any_any_any', MATH_MUL, and(is_cons, is_mul_2_any_any), is_any, $);
        this.hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_ANY);
    }
    isImag(expr: EXP): boolean {
        const $ = this.$;
        return $.isImag(expr.lhs) && $.isReal(expr.rhs);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        if ($.isAssocR(MATH_MUL)) {
            // (A * B) * C => A * (B * C)
            const a = lhs.lhs;
            const b = lhs.rhs;
            const c = rhs;
            const bc = $.valueOf(makeList(opr, b, c));
            const abc = $.valueOf(makeList(lhs.opr, a, bc));
            return [TFLAG_DIFF, abc];
        }
        return [TFLAG_NONE, expr];
    }
}

export const associate_right_mul_2_mul_2_any_any_any = new Builder();
