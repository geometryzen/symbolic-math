
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { is_blade } from "../blade/BladeExtension";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Blade * Blade
 */
class Op extends Function2<Blade, Blade> implements Operator<BCons<Sym, Blade, Blade>> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_blade_blade', MATH_MUL, is_blade, is_blade, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_BLADE, HASH_BLADE);
    }
    transform2(opr: Sym, lhs: Blade, rhs: Blade): [TFLAGS, U] {
        return [TFLAG_DIFF, lhs.mul(rhs)];
    }
}

export const mul_2_blade_blade = new Builder();
