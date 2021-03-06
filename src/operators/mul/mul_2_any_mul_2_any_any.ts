import { TFLAG_DIFF, ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_cons } from "../../hashing/hash_info";
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

/**
 * a * (b * c) => (a * b) * c 
 */
class Op extends Function2<U, BCons<Sym, U, U>> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_any_mul_2_any_any', MATH_MUL, is_any, and(is_cons, is_mul_2_any_any), $);
        this.hash = hash_binop_atom_cons(MATH_MUL, HASH_ANY, MATH_MUL);
    }
    transform2(opr: Sym, lhs: U, rhs: BCons<Sym, U, U>, orig: BCons<Sym, U, BCons<Sym, U, U>>): [TFLAGS, U] {
        const $ = this.$;
        if ($.isAssocL(MATH_MUL)) {
            const a = lhs;
            const b = rhs.lhs;
            const c = rhs.rhs;
            const ab = $.valueOf(makeList(opr, a, b));
            return [TFLAG_DIFF, $.valueOf(makeList(rhs.opr, ab, c))];
        }
        return [TFLAG_NONE, orig];
    }
}

export const mul_2_any_mul_2_any_any = new Builder();
