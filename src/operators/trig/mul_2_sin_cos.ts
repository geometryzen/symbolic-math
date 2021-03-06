import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { MATH_COS } from "../cos/MATH_COS";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_opr_1_any } from "../helpers/is_opr_1_any";
import { UCons } from "../helpers/UCons";
import { MATH_SIN } from "../sin/MATH_SIN";

export class Builder implements OperatorBuilder<Cons> {
    constructor(public readonly name: string, public readonly opr: Sym, public readonly lhs: Sym, public readonly rhs: Sym) {
        // Nothing to see here.
    }
    create($: ExtensionEnv): Operator<Cons> {
        return new Op(this.name, this.opr, this.lhs, this.rhs, $);
    }
}

type LHS = UCons<Sym, U>;
type RHS = UCons<Sym, U>;
type EXPR = BCons<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    constructor(name: string, opr: Sym, lhs: Sym, rhs: Sym, $: ExtensionEnv) {
        super(name, opr, and(is_cons, is_opr_1_any(lhs)), and(is_cons, is_opr_1_any(rhs)), $);
        this.hash = hash_binop_cons_cons(opr, lhs, rhs);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXPR): [TFLAGS, U] {
        const $ = this.$;
        return [TFLAG_DIFF, $.valueOf(makeList(opr, orig.rhs, orig.lhs))];
    }
}

export const mul_2_sin_cos = new Builder('mul_2_sin_cos', MATH_MUL, MATH_SIN, MATH_COS);
