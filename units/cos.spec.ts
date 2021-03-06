import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("cos", function () {
    // TODO: This should factorize back to cos(a+b)
    it("cos(a+b)", function () {
        const lines: string[] = [
            `cos(a+b)`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(engine.renderAsInfix(value), 'cos(a)*cos(b)-sin(a)*sin(b)');
        assert.strictEqual(engine.renderAsInfix(value), 'cos(a+b)');
    });
});

describe("cos", function () {
    it("cos(x)", function () {
        const lines: string[] = [
            `cos(x)`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), '(cos x)');
        assert.strictEqual(engine.renderAsInfix(value), 'cos(x)');
    });
    it("cos(-x)", function () {
        const lines: string[] = [
            `cos(-x)`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), '(cos x)');
        assert.strictEqual(engine.renderAsInfix(value), 'cos(x)');
    });
    it("cos(-x*y)", function () {
        const lines: string[] = [
            `cos(-x*y)`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), '(cos (* x y))');
        assert.strictEqual(engine.renderAsInfix(value), 'cos(x*y)');
    });
    it("cos(-x*y*z)", function () {
        const lines: string[] = [
            `cos(-x*y*z)`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), '(cos (* x y z))');
        assert.strictEqual(engine.renderAsInfix(value), 'cos(x*y*z)');
    });
    it("cos(a+b)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `cos(a+b)`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), 'cos(a)*cos(b)-sin(a)*sin(b)');
    });
    it("cos(a+b)", function () {
        const lines: string[] = [
            `autofactor=1`,
            `cos(a+b)`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), 'cos(a+b)');
    });
    it("cos(b+a)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `cos(b+a)`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), 'cos(a)*cos(b)-sin(a)*sin(b)');
    });
    it("cos(b+a)", function () {
        const lines: string[] = [
            `autofactor=1`,
            `cos(b+a)`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), 'cos(a+b)');
    });
    it("cos(a-b)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `cos(a-b)`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), 'cos(a)*cos(b)+sin(a)*sin(b)');
    });
    it("cos(a-b)", function () {
        const lines: string[] = [
            `autofactor=1`,
            `cos(a-b)`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), 'cos(a-b)');
    });
    it("cos(b-a)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `cos(b-a)`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), 'cos(a)*cos(b)+sin(a)*sin(b)');
    });
    it("cos(b-a)", function () {
        const lines: string[] = [
            `autofactor=1`,
            `cos(b-a)`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), 'cos(a-b)');
    });
});
