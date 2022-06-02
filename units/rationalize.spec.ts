import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("rationalize", function () {
    it("rationalize(a/b+c/d)", function () {
        const lines: string[] = [
            `rationalize(a/b+c/d)`
        ];
        const engine = createSymEngine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(* (+ (* a d) (* b c)) (power (* b d) -1))");
        assert.strictEqual(print_expr(actual, $), "(a*d+b*c)/(b*d)");

        engine.release();
    });
    it("rationalize(a/b+b/a)", function () {
        const lines: string[] = [
            `rationalize(a/b+b/a)`
        ];
        const engine = createSymEngine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(* (+ (power a 2) (power b 2)) (power (* a b) -1))");
        assert.strictEqual(print_expr(actual, $), "(a^2+b^2)/(a*b)");

        engine.release();
    });
});