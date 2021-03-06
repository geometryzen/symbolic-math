import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { is_imu } from "../imu/is_imu";
import { MATH_MUL } from "../../runtime/ns_math";
import { negOne } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { items_to_cons, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { MATH_CONJ } from "./MATH_CONJ";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new ConjImaginaryUnit($);
    }
}

class ConjImaginaryUnit extends Function1<U> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('conj_imu', MATH_CONJ, is_imu, $);
    }
    transform1(opr: Sym, arg: U): [TFLAGS, U] {
        return [TFLAG_DIFF, items_to_cons(MATH_MUL, negOne, arg)];
    }
}

export const conj_imaginary_unit = new Builder();
