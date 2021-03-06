
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { BCons } from "./BCons";
import { Function2 } from "./Function2";
import { GUARD } from "./GUARD";

class Builder<L extends U, R extends U> implements OperatorBuilder<BCons<Sym, L, R>> {
    constructor(private readonly name: string, private readonly hash: string, private readonly opr: Sym, private readonly guardL: GUARD<U, L>, private readonly guardR: GUARD<U, R>) {
        // Nothing to see here.
    }
    create($: ExtensionEnv): Operator<BCons<Sym, L, R>> {
        return new FlipOperator(this.name, this.hash, this.opr, this.guardL, this.guardR, $);
    }
}

class FlipOperator<L extends U, R extends U> extends Function2<L, R> implements Operator<BCons<Sym, L, R>> {
    constructor(public readonly name: string, public readonly hash: string, opr: Sym, guardL: GUARD<U, L>, guardR: GUARD<U, R>, $: ExtensionEnv) {
        super(name, opr, guardL, guardR, $);
    }
    transform2(opr: Sym, lhs: L, rhs: R): [TFLAGS, U] {
        return [TFLAG_DIFF, makeList(opr, rhs, lhs)];
    }
}

export function heterogenous_canonical_order<L extends U, R extends U>(name: string, hash: string, opr: Sym, guardR: GUARD<U, R>, guardL: GUARD<U, L>): Builder<L, R> {
    return new Builder(name, hash, opr, guardL, guardR);
}
