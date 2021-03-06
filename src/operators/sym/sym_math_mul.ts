import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { assert_sym } from "./assert_sym";
import { is_sym } from "./is_sym";
import { TYPE_NAME_SYM } from "./TYPE_NAME_SYM";

class Builder implements OperatorBuilder<Sym> {
    create($: ExtensionEnv): Operator<Sym> {
        return new SymMathMul($);
    }
}

/**
 * 
 */
class SymMathMul implements Operator<Sym> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(private readonly $: ExtensionEnv) {
    }
    get key(): string {
        return TYPE_NAME_SYM.name;
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return 'SymMathMul';
    }
    transform(expr: U): [TFLAGS, U] {
        return [this.isKind(expr) ? TFLAG_HALT : TFLAG_NONE, expr];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(expr: Sym): boolean {
        throw new Error("SymMathMul Method not implemented.");
    }
    isKind(expr: U): boolean {
        return is_sym(expr) && MATH_MUL.equals(expr);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isMinusOne(expr: Sym): boolean {
        throw new Error("SymMathMul Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isOne(expr: Sym): boolean {
        throw new Error("SymMathMul Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: Sym): boolean {
        throw new Error("SymMathMul Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: Sym): boolean {
        throw new Error("SymMathMul Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: Sym): boolean {
        throw new Error("SymMathMul Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isZero(expr: Sym): boolean {
        throw new Error("SymMathMul Method not implemented.");
    }
    subst(expr: Sym, oldExpr: U, newExpr: U): U {
        if (expr.equals(oldExpr)) {
            return newExpr;
        }
        else {
            return expr;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(expr: Sym): string {
        return '*';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(expr: Sym): string {
        return '*';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toListString(expr: Sym): string {
        return this.$.getSymbolToken(MATH_MUL);
    }
    valueOf(expr: Sym): Sym {
        return assert_sym(this.transform(expr)[1]);
    }
}

export const sym_math_mul = new Builder();
