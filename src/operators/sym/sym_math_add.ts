import { CostTable } from "../../env/CostTable";
import { TFLAG_HALT, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_ADD } from "../../runtime/ns_math";
import { VERSION_ONE } from "../../runtime/version";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_sym } from "./is_sym";
import { TYPE_NAME_SYM } from "./TYPE_NAME_SYM";

class Builder implements OperatorBuilder<Sym> {
    create($: ExtensionEnv): Operator<Sym> {
        return new SymMathAdd($);
    }
}

/**
 * 
 */
class SymMathAdd implements Operator<Sym> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(private readonly $: ExtensionEnv) {
    }
    get key(): string {
        return TYPE_NAME_SYM.name;
    }
    get name(): string {
        return 'SymMathAdd';
    }
    cost(expr: U, costs: CostTable): number {
        return costs.getCost(MATH_ADD, this.$);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(expr: Sym): boolean {
        throw new Error("SymMathAdd Method not implemented.");
    }
    isKind(expr: U): boolean {
        if (is_sym(expr)) {
            return MATH_ADD.equalsSym(expr);
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isMinusOne(expr: Sym): boolean {
        throw new Error("SymMathAdd Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isOne(expr: Sym): boolean {
        throw new Error("SymMathAdd Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: Sym): boolean {
        throw new Error("SymMathAdd Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: Sym): boolean {
        throw new Error("SymMathAdd Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: Sym): boolean {
        throw new Error("SymMathAdd Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isZero(expr: Sym): boolean {
        throw new Error("SymMathAdd Method not implemented.");
    }
    subst(expr: Sym, oldExpr: U, newExpr: U): U {
        if (expr.equals(oldExpr)) {
            return newExpr;
        }
        else {
            return expr;
        }
    }
    toInfixString(): string {
        if (this.$.version > VERSION_ONE) {
            return '+';
        }
        else {
            return 'add';
        }
    }
    toListString(): string {
        if (this.$.version > VERSION_ONE) {
            return '+';
        }
        else {
            return 'add';
        }
    }
    transform(expr: U): [TFLAGS, U] {
        if (is_sym(expr) && MATH_ADD.equalsSym(expr)) {
            return [TFLAG_HALT, expr];
        }
        else {
            return [NOFLAGS, expr];
        }
    }
    valueOf(expr: Sym): Sym {
        return expr;
    }
}

export const sym_math_add = new Builder();
