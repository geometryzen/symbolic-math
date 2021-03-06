import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("simplify", function () {
    xit("simplify(exp(-3/4*i*pi))", function () {
        const lines: string[] = [
            `simplify(exp(-3/4*i*pi))`
        ];
        const engine = create_engine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // Expecting -(1+i)/(2^(1/2))
        assert.strictEqual(engine.renderAsSExpr(actual), "(power e (* -3/4 i pi))");
        assert.strictEqual(engine.renderAsInfix(actual), "e**(-3/4*i*pi)");

        engine.release();
    });
    // This currently loops because clockform calls abs which goes to inner product and nothing gets any simpler.
    it("cos(x)^2+sin(x)^2", function () {
        const lines: string[] = [
            `simplify(cos(x)^2+sin(x)^2)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "1");
        assert.strictEqual(engine.renderAsInfix(actual), "1");

        engine.release();
    });
});
