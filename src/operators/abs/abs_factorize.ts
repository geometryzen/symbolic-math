import { ExtensionEnv, Operator, OperatorBuilder, PHASE_FACTORING, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_POW } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_pow_2_any_rat } from "../pow/is_pow_2_any_rat";
import { is_rat } from "../rat/RatExtension";
import { MATH_ABS } from "./MATH_ABS";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LR = Rat;
type LHS = BCons<Sym, LL, LR>;
type RHS = Rat;
type EXP = BCons<Sym, LHS, RHS>;

const guardL = and(is_cons, is_pow_2_any_rat);
const guardR = is_rat;

/**
 * (power (power x 2) 1/2) => abs(x)
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly phases = PHASE_FACTORING;
    constructor($: ExtensionEnv) {
        super('abs_factorize', MATH_POW, guardL, guardR, $);
        this.hash = hash_binop_cons_atom(this.opr, MATH_POW, HASH_ANY);
    }
    isZero(expr: EXP): boolean {
        const x = expr.lhs.lhs;
        return this.$.isZero(x);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const x = lhs.lhs;
        const m = lhs.rhs;
        const n = rhs;
        if (m.isTwo() && n.isHalf()) {
            const factorized = makeList(MATH_ABS, x);
            return [TFLAG_DIFF, factorized];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const abs_factorize = new Builder();
