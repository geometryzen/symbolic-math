import { ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";
import { MATH_CONJ } from "./MATH_CONJ";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new ConjAny($);
    }
}

class ConjAny extends Function1<U> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('conj_any', MATH_CONJ, is_any, $);
    }
    transform1(opr: Sym, arg: U, expr: UCons<Sym, U>): [TFLAGS, U] {
        return [TFLAG_NONE, expr];
    }
}

export const conj_any = new Builder();
