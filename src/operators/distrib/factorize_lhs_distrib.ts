import { is_zero_sum } from "../../calculators/factorize/is_zero_sum";
import { ExtensionEnv, Operator, OperatorBuilder, PHASE_FACTORING, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { is_negative } from "../../predicates/is_negative";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_opr_2_any_any } from "../helpers/is_opr_2_any_any";

type LL = U;
type LR = U;
type LHS = BCons<Sym, LL, LR>;
type RL = U;
type RR = U;
type RHS = BCons<Sym, RL, RR>;
type EXP = BCons<Sym, LHS, RHS>;

class OpBuilder implements OperatorBuilder<EXP> {
    constructor(private readonly name: string, private readonly mul: Sym, private readonly add: Sym) {
        // Nothing to see here.
    }
    create($: ExtensionEnv): Operator<EXP> {
        return new Op(this.name, this.mul, this.add, $);
    }
}

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        // Using this method and the PHASE_FACTORING restriction is redundant.
        // We don't want the execution of this transform to conflict with
        // expanding and yet when (A op3 B) increases entropy, we would want the simplification.
        if ($.isFactoring()) {
            const x1 = lhs.lhs;
            const x2 = rhs.lhs;
            if (x1.equals(x2)) {
                return true;
            }
            else if (is_zero_sum(x1, x2, $)) {
                /*
                if (is_negative(x1)) {
                    console.log(`x1 + x2 = 0, x1=${x1}, x2=${x2} x1 is negative`);
                }
                if (is_negative(x2)) {
                    console.log(`x1 + x2 = 0, x1=${x1}, x2=${x2} x2 is negative`);
                }
                */
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
}

class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly phases = PHASE_FACTORING;
    constructor(public readonly name: string, op1: Sym, op2: Sym, $: ExtensionEnv) {
        super(name, op2, and(is_cons, is_opr_2_any_any(op1)), and(is_cons, is_opr_2_any_any(op1)), cross($), $);
        this.hash = hash_binop_cons_cons(op2, op1, op1);
    }
    transform2(op2: Sym, lhs: LHS, rhs: RHS, oldExpr: EXP): [TFLAGS, U] {
        const $ = this.$;
        const op1 = lhs.opr;
        const A = lhs.rhs;
        const B = rhs.rhs;
        const x1 = lhs.lhs;
        const x2 = rhs.lhs;
        if (x1.equals(x2)) {
            const A_op2_B = $.valueOf(items_to_cons(op2, A, B));
            return [TFLAG_DIFF, $.valueOf(items_to_cons(op1, x1, A_op2_B))];
        }
        else if (is_zero_sum(x1, x2, $)) {
            if (is_negative(x1)) {
                const A_op2_B = $.valueOf(items_to_cons(op2, $.negate(A), B));
                return [TFLAG_DIFF, $.valueOf(items_to_cons(op1, $.negate(x1), A_op2_B))];
            }
            if (is_negative(x2)) {
                const A_op2_B = $.valueOf(items_to_cons(op2, A, $.negate(B)));
                return [TFLAG_DIFF, $.valueOf(items_to_cons(op1, x1, A_op2_B))];
            }
            return [TFLAG_NONE, oldExpr];
        }
        else {
            return [TFLAG_NONE, oldExpr];
        }
    }
}

/**
 * (X op1 A) op2 (X op1 B) => X op1 (A op2 B)
 * 
 * @param name The name used for the operator in debugging.
 * @param op1 The operator symbol that plays the role of multiplication.
 * @param op2 The operator symbol that plays the role of addition.
 */
export function factorize_lhs_distrib(name: string, op1: Sym, op2: Sym): OperatorBuilder<EXP> {
    return new OpBuilder(name, op1, op2);
}
