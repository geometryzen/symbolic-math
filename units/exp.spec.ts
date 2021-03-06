import { assert } from "chai";
import { create_engine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("exp", function () {
    it("5", function () {
        const lines: string[] = [
            `exp(5)`
        ];
        const engine = create_engine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(power e 5)");
        assert.strictEqual(engine.renderAsInfix(actual), "e**5");
        engine.release();
    });
    it("1", function () {
        const lines: string[] = [
            `e=exp(1)`,
            `exp(1)`
        ];
        const engine = create_engine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "e");
        assert.strictEqual(engine.renderAsInfix(actual), "e");
        engine.release();
    });
    it("exp(i*pi)", function () {
        const lines: string[] = [
            `exp(i*pi)`
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "-1");
        engine.release();
    });
    it("exp(pi*i)", function () {
        const lines: string[] = [
            `exp(pi*i)`
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "-1");
        engine.release();
    });
    it("exp(i*x)", function () {
        const lines: string[] = [
            `exp(i*x)`
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "cos(x)+sin(x)*i");
        engine.release();
    });
    it("exp(-i*x)", function () {
        const lines: string[] = [
            `exp(-i*x)`
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "cos(x)-sin(x)*i");
        engine.release();
    });
    it("exp(x*i)+exp(-x*i)", function () {
        const lines: string[] = [
            `exp(x*i)+exp(-x*i)`
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "2*cos(x)");
        engine.release();
    });
    it("exp(-x*i)+exp(x*i)", function () {
        const lines: string[] = [
            `exp(-x*i)+exp(x*i)`
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "2*cos(x)");
        engine.release();
    });
    it("exp(x*i)-exp(-x*i)", function () {
        const lines: string[] = [
            `exp(x*i)-exp(-x*i)`
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "2*sin(x)*i");
        engine.release();
    });
    it("exp(-x*i)-exp(x*i)", function () {
        const lines: string[] = [
            `exp(-x*i)-exp(x*i)`
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "-2*sin(x)*i");
        engine.release();
    });
    it("exp(-3/4*i*pi)", function () {
        const lines: string[] = [
            `exp(-3/4*i*pi)`
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "-1/2*2**(1/2)-1/2*2**(1/2)*i");
        engine.release();
    });
});
