import { Eval_condense } from "../../condense";
import { ExtensionEnv, Operator, OperatorBuilder, PHASE_EXPANDING, TFLAG_DIFF, TFLAG_HALT, TFLAG_KEEP } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { CONDENSE } from "../../runtime/constants";
import { Cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly hash: string;
    readonly phases = PHASE_EXPANDING;
    constructor($: ExtensionEnv) {
        super('condense', CONDENSE, $);
        this.hash = hash_nonop_cons(this.opr);
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const retval = Eval_condense(expr, $);
        retval.meta |= TFLAG_KEEP;
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const condense_varargs = new Builder();
