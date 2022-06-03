import { assert } from "chai";
import { print_expr } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("clock", function () {
    it("i", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `clock(i)`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(print_expr(value, $), "i");
        engine.release();
    });
    it("(1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i)", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=0`,
            `(1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i)`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(print_expr(value, $), "3**(1/2)*i");
        engine.release();
    });
    it("((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=0`,
            `((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(print_expr(value, $), "-3**(1/2)");
        engine.release();
    });
    it("-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=0`,
            `-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(print_expr(value, $), "1/2*3**(1/2)");
        engine.release();
    });
    it("(-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i)**2", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=0`,
            `(-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i)**2`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(print_expr(value, $), "3/4");
        engine.release();
    });
    it("1/4+(-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i)**2", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=0`,
            `1/4+(-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i)**2`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(print_expr(value, $), "1");
        engine.release();
    });
    it("(1/4+(-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i)**2)**(1/2)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `(1/4+(-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i)**2)**(1/2)`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(print_expr(value, $), "1");
        engine.release();
    });
    it("exp(i*pi/3)", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=0`,
            `exp(i*pi/3)`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(print_expr(value, $), "1/2+(1/2*3**(1/2))*i");
        engine.release();
    });
    it("clock(exp(i*pi/3))", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=0`,
            `clock(exp(i*pi/3))`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(print_expr(value, $), "(-1)**(1/3)");
        engine.release();
    });
});