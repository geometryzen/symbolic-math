import { assert } from 'chai';
import { rational } from '../src/bignum';
import { cadnr } from '../src/calculators/cadnr';
import { makeList } from '../src/makeList';
import { is_sym } from '../src/operators/sym/is_sym';
import { ASSIGN, QUOTE } from '../src/runtime/constants';
import { MATH_ADD, MATH_COMPONENT, MATH_EQ, MATH_GE, MATH_GT, MATH_INNER, MATH_LCO, MATH_LE, MATH_LT, MATH_MUL, MATH_NE, MATH_OUTER, MATH_POW, MATH_RCO } from '../src/runtime/ns_math';
import { scan_source_text, ScanOptions } from '../src/scanner/scan_source_text';
import { Boo } from '../src/tree/boo/Boo';
import { is_boo } from '../src/operators/boo/is_boo';
import { Flt } from '../src/tree/flt/Flt';
import { is_flt } from '../src/operators/flt/is_flt';
import { is_rat } from '../src/operators/rat/is_rat';
import { negOne, Rat, three, two, zero } from '../src/tree/rat/Rat';
import { is_str } from '../src/operators/str/is_str';
import { Str } from '../src/tree/str/Str';
import { Sym } from '../src/tree/sym/Sym';
import { is_tensor } from '../src/operators/tensor/is_tensor';
import { Cons, is_cons, U } from '../src/tree/tree';

const NAME_A = new Sym('a');
const NAME_B = new Sym('b');
const NAME_C = new Sym('c');
const NAME_D = new Sym('d');
const NAME_E = new Sym('e');
const NAME_F = new Sym('f');
const NAME_ABC = new Sym('abc');
const NAME_FOO = new Sym('foo');

function add(lhs: U, rhs: U): U {
    return makeList(MATH_ADD, lhs, rhs);
}

function mul(lhs: U, rhs: U): U {
    return makeList(MATH_MUL, lhs, rhs);
}

function sub(lhs: U, rhs: U): U {
    // This may change according to how the scanner works.
    return add(lhs, mul(negOne, rhs));
}

describe("scan", function () {
    describe("Boo", function () {
        it("true", function () {
            expect_boo(expect_one_tree("  true   "), true, 2, 6);
        });
        it("false", function () {
            expect_boo(expect_one_tree("  false   "), false, 2, 7);
        });
    });
    describe("Flt", function () {
        it('9.9', function () {
            const expr = expect_flt(expect_one_tree("    9.9    "), new Flt(9.9), 4, 7);
            assert.strictEqual(expr.toNumber(), 9.9);
        });
        it('9.9e+9', function () {
            const expr = expect_flt(expect_one_tree("    9.9e+9    "), new Flt(9.9e+9), 4, 10);
            assert.strictEqual(expr.toNumber(), 9.9e+9);
        });
        it('9.9e-9', function () {
            const expr = expect_flt(expect_one_tree("    9.9e-9    "), new Flt(9.9e-9), 4, 10);
            assert.strictEqual(expr.toNumber(), 9.9e-9);
        });
        it('9.9e9', function () {
            const expr = expect_flt(expect_one_tree("    9.9e9    "), new Flt(9.9e9), 4, 9);
            assert.strictEqual(expr.toNumber(), 9.9e9);
        });
    });
    it('Rat', function () {
        const expr = expect_rat(expect_one_tree("    1234    "), rational(1234, 1), 4, 8);
        assert.strictEqual(expr.toNumber(), 1234);
    });
    it('Str', function () {
        const expr = expect_str(expect_one_tree('  "Hello"   '), '"Hello"', 2, 9);
        assert.strictEqual(expr.str, 'Hello');
    });
    it("QName", function () {
        expect_sym(expect_one_tree("  abc  "), NAME_ABC, 'abc', 2, 5);
    });
    describe("=", function () {
        it("a=b => (= a b)", function () {
            const expr = expect_cons(expect_one_tree(" a  =  b "));
            expect_sym(cadnr(expr, 0), ASSIGN, '=', 4, 5);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 7, 8);
        });
    });
    describe(":=", function () {
        it("a:=b => (:= a b)", function () {
            const expr = expect_cons(expect_one_tree(" a  :=  b "));
            expect_sym(cadnr(expr, 0), ASSIGN, ':=', 4, 6);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            const rhs = expect_cons(cadnr(expr, 2));
            expect_sym(cadnr(rhs, 0), QUOTE, ':=', 4, 6);
            expect_sym(cadnr(rhs, 1), NAME_B, 'b', 8, 9);
        });
    });
    describe("+", function () {
        it("a+b => (+ a b)", function () {
            const expr = expect_cons(expect_one_tree(" a  +  b "));
            expect_sym_no_info(cadnr(expr, 0), MATH_ADD);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 7, 8);
        });
    });
    describe("-", function () {
        it("a-b => (+ a (* b -1))", function () {
            const actual = expect_cons(expect_one_tree(" a  -  b "));
            const expect = sub(NAME_A, NAME_B);
            assert_equals(actual, expect);
        });
    });
    describe("*", function () {
        it("a*b => (* a b)", function () {
            const expr = expect_cons(expect_one_tree(" a  *  b "));
            expect_sym_no_info(cadnr(expr, 0), MATH_MUL);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 7, 8);
        });
    });
    describe("/", function () {
        it("a/b => (/ a b)", function () {
            const expr = expect_cons(expect_one_tree(" a  /  b "));
            expect_sym_no_info(cadnr(expr, 0), MATH_MUL);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            const powExpr = expect_cons(cadnr(expr, 2));
            expect_sym_no_info(cadnr(powExpr, 0), MATH_POW);
            expect_sym(cadnr(powExpr, 1), NAME_B, 'b', 7, 8);
            const rat = expect_rat_no_info(cadnr(powExpr, 2));
            assert.strictEqual(rat.toNumber(), -1);
        });
    });
    describe("^", function () {
        it("a^b => (^ a b)", function () {
            const expr = expect_cons(expect_one_tree(" a  ^  b "));
            expect_sym_no_info(cadnr(expr, 0), MATH_OUTER);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 7, 8);
        });
    });
    describe("|", function () {
        it("a|b => (| a b)", function () {
            const expr = expect_cons(expect_one_tree(" a  |  b "));
            expect_sym_no_info(cadnr(expr, 0), MATH_INNER);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 7, 8);
        });
    });
    describe("??", function () {
        it("a??b => (?? a b)", function () {
            const expr = expect_cons(expect_one_tree(" a  ??  b "));
            expect_sym_no_info(cadnr(expr, 0), MATH_INNER);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 7, 8);
        });
    });
    describe("Exponentiation", function () {
        it("a**b => (** a b)", function () {
            const expr = expect_cons(expect_one_tree(" a  **  b "));
            expect_sym(cadnr(expr, 0), MATH_POW, '**', 4, 6);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 8, 9);
        });
        it("a**b => (** a b) (useCaretForExponentiation: false)", function () {
            const expr = expect_cons(expect_one_tree(" a  **  b ", { useCaretForExponentiation: false }));
            expect_sym(cadnr(expr, 0), MATH_POW, '**', 4, 6);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 8, 9);
        });
        it("a^b => (** a b) (useCaretForExponentiation: true)", function () {
            const expr = expect_cons(expect_one_tree(" a  ^  b ", { useCaretForExponentiation: true }));
            expect_sym(cadnr(expr, 0), MATH_POW, '^', 4, 5);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 7, 8);
        });
        it("2**3 => (** 2 3)", function () {
            const expr = expect_cons(expect_one_tree(" 2  **  3 "));
            expect_sym(cadnr(expr, 0), MATH_POW, '**', 4, 6);
            expect_rat(cadnr(expr, 1), two, 1, 2);
            expect_rat(cadnr(expr, 2), three, 8, 9);
        });
        it("(-1)**0 => (** -1 0)", function () {
            const expr = expect_cons(expect_one_tree(" (-1)  **  0 "));
            expect_sym(cadnr(expr, 0), MATH_POW, '**', 7, 9);
            // Because the '-' sign is absorbed as a unary minus, the position is recorded for the number without the minus sign.
            expect_rat(cadnr(expr, 1), negOne, 3, 4);
            expect_rat(cadnr(expr, 2), zero, 11, 12);
        });
    });
    describe("<<", function () {
        it("a<<b => (<< a b)", function () {
            const expr = expect_cons(expect_one_tree(" a  <<  b "));
            expect_sym(cadnr(expr, 0), MATH_LCO, '<<', 4, 6);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 8, 9);
        });
    });
    describe(">>", function () {
        it("a>>b => (>> a b)", function () {
            const expr = expect_cons(expect_one_tree(" a  >>  b "));
            expect_sym(cadnr(expr, 0), MATH_RCO, '>>', 4, 6);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 8, 9);
        });
    });
    describe("==", function () {
        it("a==b => (== a b)", function () {
            const expr = expect_cons(expect_one_tree(" a  ==  b "));
            expect_sym(cadnr(expr, 0), MATH_EQ, '==', 4, 6);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 8, 9);
        });
    });
    describe("!=", function () {
        it("a!=b => (!= a b)", function () {
            const expr = expect_cons(expect_one_tree(" a  !=  b "));
            expect_sym(cadnr(expr, 0), MATH_NE, '!=', 4, 6);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 8, 9);
        });
    });
    describe(">", function () {
        it("a>b => (> a b)", function () {
            const expr = expect_cons(expect_one_tree(" a  >  b "));
            expect_sym(cadnr(expr, 0), MATH_GT, '>', 4, 5);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 7, 8);
        });
    });
    describe(">=", function () {
        it("a>=b => (>= a b)", function () {
            const expr = expect_cons(expect_one_tree(" a  >=  b "));
            expect_sym(cadnr(expr, 0), MATH_GE, '>=', 4, 6);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 8, 9);
        });
    });
    describe("<", function () {
        it("a<b => (< a b)", function () {
            const expr = expect_cons(expect_one_tree(" a  <  b "));
            expect_sym(cadnr(expr, 0), MATH_LT, '<', 4, 5);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 7, 8);
        });
    });
    describe("<=", function () {
        it("a<=b => (<= a b)", function () {
            const expr = expect_cons(expect_one_tree(" a  <=  b "));
            expect_sym(cadnr(expr, 0), MATH_LE, '<=', 4, 6);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 8, 9);
        });
    });
    describe("+,+", function () {
        it("a+b+c => (+ (+ a b) c)", function () {
            const expr = expect_cons(expect_one_tree(" a  +  b + c "));
            expect_sym(cadnr(expr, 0), MATH_ADD, '+', 9, 10);
            const abExpr = expect_cons(cadnr(expr, 1));
            expect_sym(cadnr(expr, 2), NAME_C, 'c', 11, 12);
            expect_sym(cadnr(abExpr, 0), MATH_ADD, '+', 4, 5);
            expect_sym(cadnr(abExpr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(abExpr, 2), NAME_B, 'b', 7, 8);
        });
    });
    describe("*,*", function () {
        it("a*b*c => (* (* a b) c)", function () {
            const expr = expect_cons(expect_one_tree(" a  *  b * c "));
            expect_sym(cadnr(expr, 0), MATH_MUL, '*', 9, 10);
            const abExpr = expect_cons(cadnr(expr, 1));
            expect_sym(cadnr(expr, 2), NAME_C, 'c', 11, 12);
            expect_sym(cadnr(abExpr, 0), MATH_MUL, '*', 4, 5);
            expect_sym(cadnr(abExpr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(abExpr, 2), NAME_B, 'b', 7, 8);
        });
    });
    describe("*,+", function () {
        it("a*b+c => (+ (* a b) c)", function () {
            const expr = expect_cons(expect_one_tree(" a  *  b + c "));
            expect_sym_no_info(cadnr(expr, 0), MATH_ADD);
            const abExpr = expect_cons(cadnr(expr, 1));
            expect_sym(cadnr(expr, 2), NAME_C, 'c', 11, 12);
            expect_sym_no_info(cadnr(abExpr, 0), MATH_MUL);
            expect_sym(cadnr(abExpr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(abExpr, 2), NAME_B, 'b', 7, 8);
        });
        it("a+b*c => (+ a (* b c))", function () {
            const expr = expect_cons(expect_one_tree(" a  +  b * c "));
            expect_sym_no_info(cadnr(expr, 0), MATH_ADD);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            const bcExpr = expect_cons(cadnr(expr, 2));
            expect_sym_no_info(cadnr(bcExpr, 0), MATH_MUL);
            expect_sym(cadnr(bcExpr, 1), NAME_B, 'b', 7, 8);
            expect_sym(cadnr(bcExpr, 2), NAME_C, 'c', 11, 12);
        });
    });
    describe("^,*", function () {
        it("a^b*c => (* (^ a b) c)", function () {
            const expr = expect_cons(expect_one_tree(" a  ^  b * c "));
            expect_sym_no_info(cadnr(expr, 0), MATH_MUL);
            const abExpr = expect_cons(cadnr(expr, 1));
            expect_sym(cadnr(expr, 2), NAME_C, 'c', 11, 12);
            expect_sym_no_info(cadnr(abExpr, 0), MATH_OUTER);
            expect_sym(cadnr(abExpr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(abExpr, 2), NAME_B, 'b', 7, 8);
        });
        it("a*b^c => (+ a (^ b c))", function () {
            const expr = expect_cons(expect_one_tree(" a  *  b ^ c "));
            expect_sym_no_info(cadnr(expr, 0), MATH_MUL);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            const bcExpr = expect_cons(cadnr(expr, 2));
            expect_sym_no_info(cadnr(bcExpr, 0), MATH_OUTER);
            expect_sym(cadnr(bcExpr, 1), NAME_B, 'b', 7, 8);
            expect_sym(cadnr(bcExpr, 2), NAME_C, 'c', 11, 12);
        });
    });
    describe("|,^", function () {
        it("a|b^c => (^ (| a b) c)", function () {
            const expr = expect_cons(expect_one_tree(" a  |  b ^ c "));
            expect_sym_no_info(cadnr(expr, 0), MATH_OUTER);
            const abExpr = expect_cons(cadnr(expr, 1));
            expect_sym(cadnr(expr, 2), NAME_C, 'c', 11, 12);
            expect_sym(cadnr(abExpr, 0), MATH_INNER, '|', 4, 5);
            expect_sym(cadnr(abExpr, 1), NAME_A, 'a', 1, 2);
            expect_sym(cadnr(abExpr, 2), NAME_B, 'b', 7, 8);
        });
        it("a^b|c => (^ a (| b c))", function () {
            const expr = expect_cons(expect_one_tree(" a  ^  b | c "));
            expect_sym_no_info(cadnr(expr, 0), MATH_OUTER);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            const bcExpr = expect_cons(cadnr(expr, 2));
            expect_sym(cadnr(bcExpr, 0), MATH_INNER, '|', 9, 10);
            expect_sym(cadnr(bcExpr, 1), NAME_B, 'b', 7, 8);
            expect_sym(cadnr(bcExpr, 2), NAME_C, 'c', 11, 12);
        });
    });
    describe("foo()", function () {
        it("foo() => (foo)", function () {
            const expr = expect_cons(expect_one_tree("  foo  (  ) "));
            expect_sym(cadnr(expr, 0), NAME_FOO, 'foo', 2, 5);
        });
    });
    describe("foo(a)", function () {
        it("foo(a) => (foo a)", function () {
            const expr = expect_cons(expect_one_tree("  foo  ( a ) "));
            expect_sym(cadnr(expr, 0), NAME_FOO, 'foo', 2, 5);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 9, 10);
        });
    });
    describe("foo(a,b)", function () {
        it("foo(a,b) => (foo a b)", function () {
            const expr = expect_cons(expect_one_tree("  foo  ( a , b ) "));
            expect_sym(cadnr(expr, 0), NAME_FOO, 'foo', 2, 5);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 9, 10);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 13, 14);
        });
    });
    describe("a[b]", function () {
        it("a[b] => (component a b)", function () {
            const expr = expect_cons(expect_one_tree("  a  [  b  ] "));
            expect_sym_no_info(cadnr(expr, 0), MATH_COMPONENT);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 2, 3);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 8, 9);
        });
    });
    describe("a[b][c]", function () {
        it("a[b][c] => (component (component a b) c)", function () {
            const expr = expect_cons(expect_one_tree("  a  [  b  ] [  c  ]"));
            expect_sym_no_info(cadnr(expr, 0), MATH_COMPONENT);
            const a_index_b = expect_cons(cadnr(expr, 1));
            expect_sym_no_info(cadnr(a_index_b, 0), MATH_COMPONENT);
            expect_sym(cadnr(a_index_b, 1), NAME_A, 'a', 2, 3);
            expect_sym(cadnr(a_index_b, 2), NAME_B, 'b', 8, 9);
            expect_sym(cadnr(expr, 2), NAME_C, 'c', 16, 17);
        });
    });
    describe("a[b,c]", function () {
        it("a[b,c] => (component a b c)", function () {
            const expr = expect_cons(expect_one_tree("  a  [  b  ,  c  ]"));
            expect_sym_no_info(cadnr(expr, 0), MATH_COMPONENT);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 2, 3);
            expect_sym(cadnr(expr, 2), NAME_B, 'b', 8, 9);
            expect_sym(cadnr(expr, 3), NAME_C, 'c', 14, 15);
        });
    });
    describe("grouping", function () {
        it("a*(b+c) => (* a (+ b c))", function () {
            const expr = expect_cons(expect_one_tree(" a  * (  b + c  ) "));
            expect_sym_no_info(cadnr(expr, 0), MATH_MUL);
            expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
            const bcExpr = expect_cons(cadnr(expr, 2));
            expect_sym_no_info(cadnr(bcExpr, 0), MATH_ADD);
            expect_sym(cadnr(bcExpr, 1), NAME_B, 'b', 9, 10);
            expect_sym(cadnr(bcExpr, 2), NAME_C, 'c', 13, 14);
        });
    });
    it("power should right associate", function () {
        const expr = expect_cons(expect_one_tree(" a ** b ** c "));
        expect_sym_no_info(cadnr(expr, 0), MATH_POW);
        expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
        const powExpr = expect_cons(cadnr(expr, 2));
        expect_sym_no_info(cadnr(powExpr, 0), MATH_POW);
        expect_sym(cadnr(powExpr, 1), NAME_B, 'b', 6, 7);
        expect_sym(cadnr(powExpr, 2), NAME_C, 'c', 11, 12);
    });
    it("tensor", function () {
        // The elements of the tensor should be flattened, and the
        // dimensions should be recorded correctly.  
        const M = expect_one_tree(" [ [ a , b ] , [ c , d ], [ e, f ] ] ");
        if (is_tensor(M)) {
            assert.strictEqual(M.rank, 2);
            assert.strictEqual(M.dim(0), 3);
            assert.strictEqual(M.dim(1), 2);
            expect_sym(M.elem(0), NAME_A, 'a', 5, 6);
            expect_sym(M.elem(1), NAME_B, 'b', 9, 10);
            expect_sym(M.elem(2), NAME_C, 'c', 17, 18);
            expect_sym(M.elem(3), NAME_D, 'd', 21, 22);
            expect_sym(M.elem(4), NAME_E, 'e', 28, 29);
            expect_sym(M.elem(5), NAME_F, 'f', 31, 32);
        }
        else {
            assert.fail();
        }
    });
});

function expect_one_tree(sourceText: string, options?: ScanOptions): U {
    const { trees, errors } = scan_source_text(sourceText, options);
    // console.lg(`tree => ${tree}`);
    // console.lg(`errors => ${JSON.stringify(errors)}`);
    if (errors.length > 0) {
        assert.fail(`${errors}`);
    }
    if (trees.length > 0) {
        return trees[0];
    }
    else {
        assert.fail(`No trees from scanning ${JSON.stringify(sourceText)}.`);
    }
}

function expect_boo(expr: U, value: boolean, pos: number, end: number, message?: string | undefined): Boo {
    if (is_boo(expr)) {
        assert.strictEqual(expr.isTrue(), value);
        assert.strictEqual(expr.pos, pos);
        assert.strictEqual(expr.end, end);
        return expr;
    }
    else {
        assert.fail(`expr = ${expr} ${message}`);
    }
}

function expect_cons(expr: U, message?: string | undefined): Cons {
    if (is_cons(expr)) {
        return expr;
    }
    else {
        assert.fail(message);
    }
}

function expect_sym(expr: U, name: Sym, text: string, pos: number, end: number, message?: string | undefined): Sym {
    if (is_sym(expr)) {
        assert.isTrue(expr.equals(name), `expr=${expr.key()} name=${name.key()}`);
        assert.strictEqual(expr.pos, pos);
        assert.strictEqual(expr.end, end);
        return expr;
    }
    else {
        assert.fail(`expr = ${expr} ${message}`);
    }
}

function expect_flt(actual: U, expect: Flt, pos: number, end: number, message?: string | undefined): Flt {
    if (is_flt(actual)) {
        assert.isTrue(actual.equalsFlt(expect));
        assert.strictEqual(actual.pos, pos);
        assert.strictEqual(actual.end, end);
        return actual;
    }
    else {
        assert.fail(`expr = ${actual} ${message}`);
    }
}

function expect_rat(actual: U, expect: Rat, pos: number, end: number, message?: string | undefined): Rat {
    if (is_rat(actual)) {
        assert.isTrue(actual.equalsRat(expect));
        assert.strictEqual(actual.pos, pos);
        assert.strictEqual(actual.end, end);
        return actual;
    }
    else {
        assert.fail(`expr = ${actual} ${message}`);
    }
}

function expect_rat_no_info(expr: U, message?: string | undefined): Rat {
    if (is_rat(expr)) {
        return expr;
    }
    else {
        assert.fail(`expr = ${expr} ${message}`);
    }
}

function expect_str(expr: U, text: string, pos: number, end: number, message?: string | undefined): Str {
    if (is_str(expr)) {
        // assert.strictEqual(expr.text, text);
        assert.strictEqual(expr.pos, pos);
        assert.strictEqual(expr.end, end);
        return expr;
    }
    else {
        assert.fail(`expr = ${expr} ${message}`);
    }
}

function expect_sym_no_info(actual: U, expect: Sym, message?: string | undefined): Sym {
    if (is_sym(actual)) {
        assert.isTrue(actual.equals(expect), `${actual} ${expect}`);
        return actual;
    }
    else {
        assert.fail(`expr = ${actual} ${message}`);
    }
}

function assert_equals(actual: U, expect: U): void {
    if (!actual.equals(expect)) {
        assert.fail(`${actual} ${expect}`);
    }
}

//
// Existing behavior was to "flatten" addition, throwing away left-associativity.
// We shouldn't do this.
// Recursive descent parsers are hard-wired to know precedence and associativity. 
//
/*
describe("+,+", function () {
    it("a+b+c => (+ a b c)", function () {
        const expr = expect_cons(expect_one_tree(" a  +  b + c "));
        expect_sym_no_info(cadnr(expr, 0), MATH_ADD);
        expect_sym(cadnr(expr, 1), NAME_A, 'a', 1, 2);
        expect_sym(cadnr(expr, 2), NAME_B, 'b', 7, 8);
        expect_sym(cadnr(expr, 3), NAME_C, 'c', 11, 12);
    });
});
*/