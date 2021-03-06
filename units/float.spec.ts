import { assert } from "chai";
import { create_engine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("float", function () {
    it("A", function () {
        const lines: string[] = [
            `float(tau(1/2))`
        ];
        const engine = create_engine({
            dependencies: ['Flt']
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "3.141593...");
        assert.strictEqual(engine.renderAsInfix(actual), "3.141593...");
        engine.release();
    });
    it("B", function () {
        const lines: string[] = [
            `1+i`
        ];
        const engine = create_engine({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ 1 i)");
        assert.strictEqual(engine.renderAsInfix(actual), "1+i");
        engine.release();
    });
    it("C", function () {
        const lines: string[] = [
            `1+2*i`
        ];
        const engine = create_engine({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ 1 (* 2 i))");
        assert.strictEqual(engine.renderAsInfix(actual), "1+2*i");
        engine.release();
    });
    it("D", function () {
        const lines: string[] = [
            `(1+2*i)^(1/2)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(power (+ 1 (* 2 i)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(actual), "(1+2*i)^(1/2)");
        engine.release();
    });
    xit("E", function () {
        const lines: string[] = [
            `float((1+2*i)^(1/2))`
        ];
        const engine = create_engine({
            dependencies: ['Flt'],
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(power (add 1.0 (multiply 2.0 i)) 0.5)");
        assert.strictEqual(engine.renderAsInfix(actual), "1.272020...+0.786151...*i");
        engine.release();
    });
    it("F", function () {
        const lines: string[] = [
            `float(x)`
        ];
        const engine = create_engine({
            dependencies: ['Flt'],
            useDefinitions: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "x");
        assert.strictEqual(engine.renderAsInfix(actual), "x");
        engine.release();
    });
    it("G", function () {
        const lines: string[] = [
            `float(pi)`
        ];
        const engine = create_engine({
            dependencies: ['Flt'],
            useDefinitions: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "3.141593...");
        assert.strictEqual(engine.renderAsInfix(actual), "3.141593...");
        engine.release();
    });
});
