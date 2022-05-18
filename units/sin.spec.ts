import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sin", function () {
    it("sin(a+b)", function () {
        const lines: string[] = [
            `sin(a+b)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), 'sin(a)*cos(b)+cos(a)*sin(b)');
    });
    it("sin(a-b)", function () {
        const lines: string[] = [
            `sin(a-b)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), 'sin(a)*cos(b)-cos(a)*sin(b)');
    });
    it("sin(b+a)", function () {
        const lines: string[] = [
            `sin(b+a)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), 'sin(a)*cos(b)+cos(a)*sin(b)');
    });
    it("sin(b-a)", function () {
        const lines: string[] = [
            `sin(b-a)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), '-sin(a)*cos(b)+cos(a)*sin(b)');
    });
});

xdescribe("sin", function () {
    it("sin(x)", function () {
        const lines: string[] = [
            `sin(x)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), '(sin x)');
        assert.strictEqual(print_expr(value, $), 'sin(x)');
    });
    it("sin(-x)", function () {
        const lines: string[] = [
            `sin(-x)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), "(* -1 (sin x))");
        assert.strictEqual(print_expr(value, $), '-sin(x)');
    });
    it("sin(-x*y)", function () {
        const lines: string[] = [
            `sin(-x*y)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), '(* -1 (sin (* x y)))');
        assert.strictEqual(print_expr(value, $), '-sin(x*y)');
    });
    it("sin(-x*y*z)", function () {
        const lines: string[] = [
            `sin(-x*y*z)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), '(* -1 (sin (* x y z)))');
        assert.strictEqual(print_expr(value, $), '-sin(x*y*z)');
    });
    it("sin(a+b)", function () {
        const lines: string[] = [
            `sin(a+b)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // WRONG, but this is what we have.
        // assert.strictEqual(print_list(value, $), '(+ (* -1 (sin a) (cos b)) (* (cos (* -1 a)) (sin b)))');
        assert.strictEqual(print_expr(value, $), 'sin(a)*cos(b)+cos(a)*sin(b)');
        // assert.strictEqual(print_expr(value, $), 'sin(a+b)');
    });
    it("sin(b-a)", function () {
        const lines: string[] = [
            `sin(b-a)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), '(* -1 (sin (* x y z)))');
        assert.strictEqual(print_expr(value, $), '-sin(a-b)');
    });
});
