import { compare_sym_sym } from "../../calculators/compare/compare_sym_sym";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_SYM } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_any_sym } from "./is_mul_2_any_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function symbols_will_exchange(z: Sym, a: Sym, $: ExtensionEnv): boolean {
    if ($.isScalar(z) || $.isScalar(a)) {
        return compare_sym_sym(z, a) > 0;
    }
    return false;
}

function symbols_must_exchange($: ExtensionEnv) {
    return function cross(lhs: BCons<Sym, U, Sym>, rhs: Sym): boolean {
        return symbols_will_exchange(lhs.rhs, rhs, $);
    };
}


/**
 * (X * z) * a => (X * a) * z
 * More fundamentally,
 * (X * z) * a => X * (z * a) => X * (a * z) => (X * a) * z
 */
class Op extends Function2X<BCons<Sym, U, Sym>, Sym> implements Operator<BCons<Sym, BCons<Sym, U, Sym>, Sym>> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_any_sym_sym', MATH_MUL, and(is_cons, is_mul_2_any_sym), is_sym, symbols_must_exchange($), $);
        this.hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_SYM);
    }
    transform2(opr: Sym, lhs: BCons<Sym, U, Sym>, rhs: Sym, orig: BCons<Sym, BCons<Sym, U, Sym>, Sym>): [TFLAGS, U] {
        const $ = this.$;
        if ($.isAssocL(MATH_MUL)) {
            const X = lhs.lhs;
            const z = lhs.rhs;
            const a = rhs;
            const Xa = $.valueOf(makeList(opr, X, a));
            const Xaz = $.valueOf(makeList(lhs.opr, Xa, z));
            return [TFLAG_DIFF, Xaz];
        }
        return [TFLAG_NONE, orig];
    }
}

export const mul_2_mul_2_any_sym_sym = new Builder();
