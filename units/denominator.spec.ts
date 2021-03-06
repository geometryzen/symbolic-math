import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("denominator", function () {
    it("denominator(2/3)", function () {
        const lines: string[] = [
            `denominator(2/3)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "3");
        assert.strictEqual(engine.renderAsInfix(actual), "3");

        engine.release();
    });
    it("denominator(x)", function () {
        const lines: string[] = [
            `denominator(x)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "1");
        assert.strictEqual(engine.renderAsInfix(actual), "1");

        engine.release();
    });
    it("denominator(1/x)", function () {
        const lines: string[] = [
            `denominator(1/x)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "x");
        assert.strictEqual(engine.renderAsInfix(actual), "x");

        engine.release();
    });
    it("denominator(a+b)", function () {
        const lines: string[] = [
            `denominator(a+b)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "1");
        assert.strictEqual(engine.renderAsInfix(actual), "1");

        engine.release();
    });
    it("denominator(1/(1/a)", function () {
        const lines: string[] = [
            `denominator(1/(1/a))`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "1");
        assert.strictEqual(engine.renderAsInfix(actual), "1");

        engine.release();
    });
    it("denominator(1/a+1/b)", function () {
        const lines: string[] = [
            `denominator(1/a+1/b)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* a b)");
        assert.strictEqual(engine.renderAsInfix(actual), "a*b");

        engine.release();
    });
});
