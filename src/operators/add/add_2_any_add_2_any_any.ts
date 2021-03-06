import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_cons } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_add_2_any_any } from "./is_add_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

export const add_2_any_add_2_any_any = new Builder();

/**
 * Matches X+(Y+Z) where X,Y,Z: U.
 * 
 * X+(Y+Z) => (X+Y)+Z
 */
class Op extends Function2<U, BCons<Sym, U, U>> implements Operator<BCons<Sym, U, BCons<Sym, U, U>>> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        // TODO: Consider replacing the first argument with a matching function and(is_cons, is_add_2_any_any)
        super('add_2_any_add_2_any_any', MATH_ADD, is_any, and(is_cons, is_add_2_any_any), $);
        this.hash = hash_binop_atom_cons(MATH_ADD, HASH_ANY, MATH_ADD);
    }
    transform2(opr: Sym, lhs: U, rhs: BCons<Sym, U, U>, expr: BCons<Sym, U, BCons<Sym, U, U>>): [TFLAGS, U] {
        const $ = this.$;
        if ($.isAssocL(MATH_ADD)) {
            const X = lhs;
            const Y = rhs.lhs;
            const Z = rhs.rhs;
            const A = makeList(MATH_ADD, X, Y);
            const B = $.valueOf(A);
            const C = makeList(MATH_ADD, B, Z);
            const D = $.valueOf(C);
            return [TFLAG_DIFF, D];
        }
        if ($.isAssocR(MATH_ADD)) {
            return [TFLAG_NONE, expr];
        }
        return [TFLAG_NONE, expr];
    }
}
