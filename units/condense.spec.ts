import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("condense", function () {
    it("condense(7208+2736*5^(1/2))", function () {
        const lines: string[] = [
            `condense(7208+2736*5^(1/2))`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(lines.join('\n'));
        // TODO: Does expo
        assert.strictEqual(engine.renderAsInfix(values[0]), "8*(901+342*5^(1/2))");
        engine.release();
    });
});
