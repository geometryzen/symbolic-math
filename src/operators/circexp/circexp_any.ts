import { circexp } from "../../circexp";
import { ExtensionEnv, PHASE_EXPANDING, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { evaluatingTrigAsExp } from "../../modes/modes";
import { CIRCEXP } from "../../runtime/constants";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = U;
type EXP = UCons<Sym, ARG>;

class Op extends Function1<ARG> implements Operator<EXP> {
    readonly hash: string;
    readonly phases = PHASE_EXPANDING;
    constructor($: ExtensionEnv) {
        super('circexp_any', CIRCEXP, is_any, $);
        this.hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    transform1(opr: Sym, arg: ARG, oldExpr: EXP): [TFLAGS, U] {
        const $ = this.$;
        const flag = $.getModeFlag(evaluatingTrigAsExp);
        $.setModeFlag(evaluatingTrigAsExp, true);
        try {
            const rawExpr = circexp(arg, $);
            const newExpr = $.valueOf(rawExpr);
            // console.lg(`oldExpr=${oldExpr}`);
            // console.lg(`rawExpr=${rawExpr}`);
            // console.lg(`newExpr=${newExpr}`);
            const changed = !newExpr.equals(oldExpr);
            return [changed ? TFLAG_DIFF : TFLAG_NONE, newExpr];
        }
        finally {
            $.setModeFlag(evaluatingTrigAsExp, flag);
        }
    }
}

export const circexp_any = new Builder();
