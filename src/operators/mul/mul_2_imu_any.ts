import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, PHASE_FLAGS_EXPANDING_UNION_FACTORING, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_IMU } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { IMU_TYPE, is_imu } from "../imu/is_imu";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = IMU_TYPE;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * i * X => X * i
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly phases = PHASE_FLAGS_EXPANDING_UNION_FACTORING;
    readonly dependencies: FEATURE[] = ['Imu'];
    constructor($: ExtensionEnv) {
        super('mul_2_imu_any', MATH_MUL, is_imu, is_any, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_IMU, HASH_ANY);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        return [TFLAG_DIFF, $.valueOf(items_to_cons(opr, rhs, lhs))];
    }
}

export const mul_2_imu_any = new Builder();
