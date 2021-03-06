import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { SINH } from "../../runtime/constants";
import { Rat, zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";
import { is_rat } from "../rat/is_rat";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = Rat;
type EXP = UCons<Sym, ARG>;

class Op extends Function1<ARG> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('sinh_rat', SINH, is_rat, $);
        this.hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(exp: EXP): boolean {
        return true;
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        if (arg.isZero()) {
            return [TFLAG_DIFF, zero];
        }
        else {
            return [TFLAG_HALT, expr];
        }
    }
}

export const sinh_rat = new Builder();
