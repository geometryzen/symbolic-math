import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("polar", function () {
    // TODO: polar should return the parts [r,theta] rather than being a formatting function.
    // We could rebuild z using a complex_from_polar function.
    xit("1+i", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `polar(1+i)`,
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "???");
        assert.strictEqual(engine.renderAsInfix(value), "2^(1/2)*exp(1/4*i*pi)");
        engine.release();
    });
});
