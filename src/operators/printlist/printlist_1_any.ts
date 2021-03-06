import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { print_in_mode } from "../../print/print";
import { defs, PRINTMODE_SEXPR } from "../../runtime/defs";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, nil, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { FNAME_PRINTLIST } from "./FNAME_PRINTLIST";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new PrintList($);
    }
}

/**
 * (printlist x) => NIL. Output is written onto defs.prints.
 */
class PrintList extends Function1<U> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('printlist_1_any', FNAME_PRINTLIST, is_any, $);
        this.hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    transform1(opr: Sym, arg: U): [TFLAGS, U] {
        const $ = this.$;
        const argList = items_to_cons(arg);
        if (is_cons(argList)) {
            const texts = print_in_mode(argList, PRINTMODE_SEXPR, $);
            defs.prints.push(...texts);
        }
        return [TFLAG_DIFF, nil];
    }
}

export const printlist_1_any = new Builder();
