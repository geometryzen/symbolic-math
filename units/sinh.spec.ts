import { assert } from "chai";
import { create_engine } from "../index";

describe("sinh", function () {
    it("(x)", function () {
        const lines: string[] = [
            `sinh(x)`
        ];
        const engine = create_engine();
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(sinh x)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "sinh(x)");
        engine.release();
    });
    it("(0)", function () {
        const lines: string[] = [
            `sinh(0)`
        ];
        const engine = create_engine();
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    it("(0.0)", function () {
        const lines: string[] = [
            `sinh(0.0)`
        ];
        const engine = create_engine({
            dependencies: ['Flt']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "0.0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "0.0");
        engine.release();
    });
    it("(1.0)", function () {
        const lines: string[] = [
            `sinh(1.0)`
        ];
        const engine = create_engine({
            dependencies: ['Flt']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1.175201...");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1.175201...");
        engine.release();
    });
    it("(arcsinh(x))", function () {
        const lines: string[] = [
            `sinh(arcsinh(x))`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "x");
        assert.strictEqual(engine.renderAsInfix(values[0]), "x");
        engine.release();
    });
});
