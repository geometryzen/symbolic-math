import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("vectors", function () {
    it("x", function () {
        const lines: string[] = [
            `x`,
        ];
        const engine = create_engine({ treatAsVectors: ['x'] });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x");
        assert.strictEqual(engine.renderAsLaTeX(value), "\\vec{x}");
        assert.strictEqual(engine.renderAsSExpr(value), "x");
        engine.release();
    });
});

describe("vectors", function () {
    it("x*y", function () {
        const lines: string[] = [
            `x*y`,
        ];
        const engine = create_engine({ treatAsVectors: ['x', 'y'] });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x*y");
        // TODO: Whitespace might be good here.
        assert.strictEqual(engine.renderAsLaTeX(value), "\\vec{x}\\vec{y}");
        engine.release();
    });
    it("x|y", function () {
        const lines: string[] = [
            `x|y`,
        ];
        const engine = create_engine({ treatAsVectors: ['x', 'y'] });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x|y");
        assert.strictEqual(engine.renderAsLaTeX(value), "\\vec{x} \\mid \\vec{y}");
        engine.release();
    });
    it("y|x", function () {
        const lines: string[] = [
            `y|x`,
        ];
        const engine = create_engine({ treatAsVectors: ['x', 'y'] });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x|y");
        engine.release();
    });
    it("x^y", function () {
        const lines: string[] = [
            `x^y`,
        ];
        const engine = create_engine({ treatAsVectors: ['x', 'y'] });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x^y");
        assert.strictEqual(engine.renderAsLaTeX(value), "\\vec{x} \\wedge \\vec{y}");
        engine.release();
    });
    it("y^x", function () {
        const lines: string[] = [
            `y^x`,
        ];
        const engine = create_engine({
            dependencies: ['Vector'],
            treatAsVectors: ['x', 'y']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "-x^y");
        engine.release();
    });
    it("x|y+x^y", function () {
        const lines: string[] = [
            `x|y+x^y`,
        ];
        const engine = create_engine({
            dependencies: ['Vector'],
            treatAsVectors: ['x', 'y']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x*y");
        engine.release();
    });
    it("A", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `A`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (* Ax i) (* Ay j) (* Az k))");
        assert.strictEqual(engine.renderAsInfix(value), "Ax*i+Ay*j+Az*k");
        engine.release();
    });
    it("abs(A)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `abs(A)`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(power (+ (power Ax 2) (power Ay 2) (power Az 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "(Ax**2+Ay**2+Az**2)**(1/2)");
        engine.release();
    });
    it("A|B", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `A|B`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (* Ax Bx) (* Ay By) (* Az Bz))");
        assert.strictEqual(engine.renderAsInfix(value), "Ax*Bx+Ay*By+Az*Bz");
        engine.release();
    });
    it("A<<B", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `A<<B`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (* Ax Bx) (* Ay By) (* Az Bz))");
        assert.strictEqual(engine.renderAsInfix(value), "Ax*Bx+Ay*By+Az*Bz");
        engine.release();
    });
    it("A>>B", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `A>>B`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (* Ax Bx) (* Ay By) (* Az Bz))");
        assert.strictEqual(engine.renderAsInfix(value), "Ax*Bx+Ay*By+Az*Bz");
        engine.release();
    });
    // SLOW
    it("B*(A|C)-C*(A|B)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `B = e1 * Bx + e2 * By + e3 * Bz`,
            `C = e1 * Cx + e2 * Cy + e3 * Cz`,
            `B*(A|C)-C*(A|B)`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value,$), "");
        assert.strictEqual(engine.renderAsInfix(value), "(Ay*Bx*Cy-Ay*By*Cx+Az*Bx*Cz-Az*Bz*Cx)*i+(-Ax*Bx*Cy+Ax*By*Cx+Az*By*Cz-Az*Bz*Cy)*j+(-Ax*Bx*Cz+Ax*Bz*Cx-Ay*By*Cz+Ay*Bz*Cy)*k");
        engine.release();
    });
    // SLOW
    it("Ax(BxC)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `B = e1 * Bx + e2 * By + e3 * Bz`,
            `C = e1 * Cx + e2 * Cy + e3 * Cz`,
            `cross(A,cross(B,C))`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value,$), "");
        assert.strictEqual(engine.renderAsInfix(value), "(Ay*Bx*Cy-Ay*By*Cx+Az*Bx*Cz-Az*Bz*Cx)*i+(-Ax*Bx*Cy+Ax*By*Cx+Az*By*Cz-Az*Bz*Cy)*j+(-Ax*Bx*Cz+Ax*Bz*Cx-Ay*By*Cz+Ay*Bz*Cy)*k");

        engine.release();
    });
    // SLOW
    it("Ax(BxC) = B*(A|C)-C*(A|B)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `B = e1 * Bx + e2 * By + e3 * Bz`,
            `C = e1 * Cx + e2 * Cy + e3 * Cz`,
            `cross(A,cross(B,C))-B*A|C+C*A|B`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value,$), "");
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("A|cross(B,C) ", function () {
        // The scalar-valued triple product.
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `B = e1 * Bx + e2 * By + e3 * Bz`,
            `C = e1 * Cx + e2 * Cy + e3 * Cz`,
            `A|cross(B,C)`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value,$), "");
        assert.strictEqual(engine.renderAsInfix(value), "Ax*By*Cz-Ax*Bz*Cy-Ay*Bx*Cz+Ay*Bz*Cx+Az*Bx*Cy-Az*By*Cx");
        engine.release();
    });
    it("B|cross(C,A) ", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `B = e1 * Bx + e2 * By + e3 * Bz`,
            `C = e1 * Cx + e2 * Cy + e3 * Cz`,
            `A|cross(B,C)`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value,$), "");
        assert.strictEqual(engine.renderAsInfix(value), "Ax*By*Cz-Ax*Bz*Cy-Ay*Bx*Cz+Ay*Bz*Cx+Az*Bx*Cy-Az*By*Cx");
        engine.release();
    });
    it("A|cross(B,C)-B|cross(C,A)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `B = e1 * Bx + e2 * By + e3 * Bz`,
            `C = e1 * Cx + e2 * Cy + e3 * Cz`,
            `A|cross(B,C)-B|cross(C,A)`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value,$), "");
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("abs(A)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `abs(A)`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(power (+ (power Ax 2) (power Ay 2) (power Az 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "(Ax**2+Ay**2+Az**2)**(1/2)");
        engine.release();
    });
    describe("Geometric Algebra with Symbols", function () {
        it("The geometric product is associative (ab)c = abc", function () {
            const lines: string[] = [
                `(a*b)*c`
            ];
            const engine = create_engine({
                dependencies: ['Vector'],
                treatAsVectors: ['a', 'b', 'c']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), "(* a b c)");
            assert.strictEqual(engine.renderAsInfix(value), "a*b*c");
            engine.release();
        });
        it("The geometric product is associative a(bc) = abc", function () {
            // What happens here is that bc => b|c + (b^c).
            // Canonicalization rewrites a*(b|c) to (b|c)*a
            // We are left with (+ (* (| b c) a) (* a (^ b c))).
            // Several strategies could be used to achieve factoring back to (* a b c)
            const lines: string[] = [
                `a*(b*c)`
            ];
            const engine = create_engine({ treatAsVectors: ['a', 'b', 'c'] });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), "(* a b c)");
            assert.strictEqual(engine.renderAsInfix(value), "a*b*c");
            engine.release();
        });
        it("abs(a)", function () {
            const lines: string[] = [
                `abs(a)`
            ];
            const engine = create_engine({ treatAsVectors: ['a', 'n'] });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), "(abs a)");
            assert.strictEqual(engine.renderAsInfix(value), "abs(a)");
            engine.release();
        });
        it("Reflections Zero", function () {
            const lines: string[] = [
                `autofactor=1`,
                `implicate=1`,
                `(a*n)*n - 2*(a|n)*n`,
            ];
            const engine = create_engine({
                dependencies: ['Vector'],
                treatAsVectors: ['a', 'n']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), "(* -1 n a n)");
            assert.strictEqual(engine.renderAsInfix(value), "-n*a*n");
            assert.strictEqual(engine.renderAsLaTeX(value), "-\\vec{n}\\vec{a}\\vec{n}");
            engine.release();
        });
        it("Reflections I", function () {
            const lines: string[] = [
                `implicate=0`,
                `(a*n)*n - 2*(a|n)*n + n * a * n`,
            ];
            const engine = create_engine({
                dependencies: ['Vector'],
                treatAsVectors: ['a', 'n']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), "0");
            assert.strictEqual(engine.renderAsInfix(value), "0");
            engine.release();
        });
        it("Reflections II", function () {
            // By moving the parentheses to the right in a * n * n, we throw off the simplification.
            // We can't really stop the nested expression (* n n) from becoming (power n 2), but we
            // could recognize that a * n**2 can be put in a more left-association form.
            const lines: string[] = [
                `autofactor=1`,
                `implicate=0`,
                `a*(n*n) - 2*(a|n)*n + n * a * n`,
            ];
            const engine = create_engine({
                dependencies: ['Vector'],
                treatAsVectors: ['a', 'n']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), "0");
            assert.strictEqual(engine.renderAsInfix(value), "0");
            engine.release();
        });
        it("Reflections Redux", function () {
            const lines: string[] = [
                `implicate=1`,
                `a*n - 2*(a|n)`,
            ];
            const engine = create_engine({
                dependencies: ['Vector'],
                treatAsVectors: ['a', 'n']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(print_list(value,$), "0");
            assert.strictEqual(engine.renderAsInfix(value), "-n*a");
            engine.release();
        });
    });
    it("Scalar,Blade ordering", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay`,
            `B = i * Bx + j * By`,
            `A*B`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (* Ax Bx) (* Ay By) (* (+ (* Ax By) (* -1 Ay Bx)) i^j))");
        assert.strictEqual(engine.renderAsInfix(value), "Ax*Bx+Ay*By+(Ax*By-Ay*Bx)*i^j");
        engine.release();
    });
});
