import { rational } from '../../../bignum';
import { add_terms } from '../../../calculators/add/add_terms';
import { compare_terms } from '../../../calculators/compare/compare_terms';
import { dirac } from '../../../dirac';
import { ExtensionEnv } from '../../../env/ExtensionEnv';
import { exp } from '../../../exp';
import { makeList } from '../../../makeList';
import {
    ARCCOS,
    ARCCOSH,
    ARCSIN,
    ARCSINH,
    ARCTAN,
    ARCTANH,
    BESSELJ,
    BESSELY,
    COS,
    COSH,
    ERF,
    ERFC,
    HERMITE,
    INTEGRAL,
    LOG, MULTIPLY, POWER, SECRETX,
    SGN,
    SIN,
    SINH,
    TAN,
    TANH
} from '../../../runtime/constants';
import { DynamicConstants } from '../../../runtime/defs';
import { is_abs, is_add } from '../../../runtime/helpers';
import { subst } from '../../subst/subst';
import { caddr, cadr } from '../../../tree/helpers';
import { negOne, one, two, wrap_as_int, zero } from '../../../tree/rat/Rat';
import { Sym } from '../../../tree/sym/Sym';
import { car, cdr, is_cons, nil, U } from '../../../tree/tree';
import { besselj } from '../../besselj/besselj';
import { bessely } from '../../bessely/bessely';
import { cos } from '../../cos/cosine';
import { ycosh } from '../../cosh/cosh';
import { hermite } from '../../hermite/hermite';
import { sgn } from '../../sgn/sgn';
import { simplify } from '../../simplify/simplify';
import { sin } from '../../sin/sine';
import { sinh } from '../../sinh/sinh';
import { is_sym } from '../../sym/is_sym';
import { derivative } from '../derivative';
import { MATH_DERIVATIVE } from '../MATH_DERIVATIVE';
import { dpower } from './dpower';
import { dproduct } from './dproduct';

export function d_scalar_scalar(F: U, X: U, $: ExtensionEnv): U {
    // console.log(`d_scalar_scalar ${render_as_infix(F, $)} ${render_as_infix(X, $)}`);
    if (is_sym(X)) {
        return d_scalar_scalar_1(F, X, $);
    }

    // Example: d(sin(cos(x)),cos(x))
    // Replace cos(x) <- X, find derivative, then do X <- cos(x)
    const arg1 = subst(F, X, SECRETX, $); // p1: sin(cos(x)), p2: cos(x), SECRETX: X => sin(cos(x)) -> sin(X)
    const darg1x = derivative(arg1, SECRETX, $);
    return subst(darg1x, SECRETX, X, $); // p2:  cos(x)  =>  cos(X) -> cos(cos(x))
}

function d_scalar_scalar_1(F: U, X: Sym, $: ExtensionEnv): U {
    // d(x,x)?
    if (F.equals(X)) {
        return one;
    }

    // d(a,x)?
    if (!is_cons(F)) {
        return zero;
    }

    // TODO: The generalization here would seem to be that we delegate the task to a binary operation implemented by the
    // operator that matches.
    if (is_abs(F)) {
        return dabs(F, X, $);
    }
    if (is_add(F)) {
        return dsum(F, X, $);
    }
    // console.log(`car(p1)=>${car(p1)}`);
    // Turning these into matching patterns...
    const opr = car(F);
    if (opr.equals(MULTIPLY)) {
        return dproduct(F, X, $);
    }
    if (opr.equals(POWER)) {
        return dpower(F, X, $);
    }
    if (opr.equals(MATH_DERIVATIVE)) {
        return dd(F, X, $);
    }
    if (opr.equals(LOG)) {
        return dlog(F, X, $);
    }
    if (opr.equals(SIN)) {
        return dsin(F, X, $);
    }
    if (opr.equals(COS)) {
        return dcos(F, X, $);
    }
    if (opr.equals(TAN)) {
        return dtan(F, X, $);
    }
    if (opr.equals(ARCSIN)) {
        return darcsin(F, X, $);
    }
    if (opr.equals(ARCCOS)) {
        return darccos(F, X, $);
    }
    if (opr.equals(ARCTAN)) {
        return darctan(F, X, $);
    }
    if (opr.equals(SINH)) {
        return dsinh(F, X, $);
    }
    if (opr.equals(COSH)) {
        return dcosh(F, X, $);
    }
    if (opr.equals(TANH)) {
        return dtanh(F, X, $);
    }
    if (opr.equals(ARCSINH)) {
        return darcsinh(F, X, $);
    }
    if (opr.equals(ARCCOSH)) {
        return darccosh(F, X, $);
    }
    if (opr.equals(ARCTANH)) {
        return darctanh(F, X, $);
    }
    if (opr.equals(SGN)) {
        return dsgn(F, X, $);
    }
    if (opr.equals(HERMITE)) {
        return dhermite(F, X, $);
    }
    if (opr.equals(ERF)) {
        return derf(F, X, $);
    }
    if (opr.equals(ERFC)) {
        return derfc(F, X, $);
    }
    if (opr.equals(BESSELJ)) {
        return dbesselj(F, X, $);
    }
    if (opr.equals(BESSELY)) {
        return dbessely(F, X, $);
    }
    if (car(F) === INTEGRAL && caddr(F) === X) {
        return derivative_of_integral(F);
    }
    return dfunction(F, X, $);
}

function dsum(p1: U, p2: Sym, $: ExtensionEnv): U {
    const toAdd = is_cons(p1) ? p1.tail().map((el) => derivative(el, p2, $)) : [];
    return add_terms(toAdd, $);
}

function dlog(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.divide(deriv, cadr(p1));
}

//  derivative of derivative
//
//  example: d(d(f(x,y),y),x)
//
//  p1 = d(f(x,y),y)
//
//  p2 = x
//
//  cadr(p1) = f(x,y)
//
//  caddr(p1) = y
function dd(p1: U, p2: Sym, $: ExtensionEnv): U {
    // d(f(x,y),x)
    const p3 = derivative(cadr(p1), p2, $);

    if (car(p3) === MATH_DERIVATIVE) {
        // handle dx terms
        const caddr_p3 = caddr(p3);
        const caddr_p1 = caddr(p1);
        const cadr_p3 = cadr(p3);
        // Determine whether we should be comparing as terms or factors. I think it is as terms.
        if (compare_terms(caddr_p3, caddr_p1, $) < 0) {
            return makeList(MATH_DERIVATIVE, makeList(MATH_DERIVATIVE, cadr_p3, caddr_p3), caddr_p1);
        }
        else {
            return makeList(MATH_DERIVATIVE, makeList(MATH_DERIVATIVE, cadr_p3, caddr_p1), caddr_p3);
        }
    }

    return derivative(p3, caddr(p1), $);
}

// derivative of a generic function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function dfunction(p1: U, p2: Sym, $: ExtensionEnv): U {
    // console.log(`dfunction ${render_as_infix(p1, $)} ${render_as_infix(p2, $)}`);
    const p3 = cdr(p1); // p3 is the argument list for the function

    if (nil === p3 || p3.contains(p2)) {
        return makeList(MATH_DERIVATIVE, p1, p2);
    }
    return zero;
}

function dsin(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.multiply(deriv, cos(cadr(p1), $));
}

function dcos(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.negate($.multiply(deriv, sin(cadr(p1), $)));
}

function dtan(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.multiply(deriv, $.power(cos(cadr(p1), $), wrap_as_int(-2)));
}

function darcsin(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.multiply(
        deriv,
        $.power($.subtract(one, $.power(cadr(p1), two)), rational(-1, 2))
    );
}

function darccos(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.negate(
        $.multiply(
            deriv,
            $.power(
                $.subtract(one, $.power(cadr(p1), two)),
                rational(-1, 2)
            )
        )
    );
}

//        Without simplify  With simplify
//
//  d(arctan(y/x),x)  -y/(x^2*(y^2/x^2+1))  -y/(x^2+y^2)
//
//  d(arctan(y/x),y)  1/(x*(y^2/x^2+1))  x/(x^2+y^2)
function darctan(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return simplify(
        $.multiply(deriv, $.inverse($.add(one, $.power(cadr(p1), two)))), $
    );
}

function dsinh(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.multiply(deriv, ycosh(cadr(p1), $));
}

function dcosh(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.multiply(deriv, sinh(cadr(p1), $));
}

function dtanh(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.multiply(deriv, $.power(ycosh(cadr(p1), $), wrap_as_int(-2)));
}

function darcsinh(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.multiply(
        deriv,
        $.power($.add($.power(cadr(p1), two), one), rational(-1, 2))
    );
}

function darccosh(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.multiply(
        deriv,
        $.power($.add($.power(cadr(p1), two), negOne), rational(-1, 2))
    );
}

export function darctanh(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.multiply(
        deriv,
        $.inverse($.subtract(one, $.power(cadr(p1), two)))
    );
}

export function dabs(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.multiply(deriv, sgn(cadr(p1), $));
}

export function dsgn(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.multiply($.multiply(deriv, dirac(cadr(p1), $)), two);
}

export function dhermite(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.multiply(
        $.multiply(deriv, $.multiply(two, caddr(p1))),
        hermite(cadr(p1), $.add(caddr(p1), negOne), $)
    );
}

export function derf(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.multiply(
        $.multiply(
            $.multiply(
                exp($.multiply($.power(cadr(p1), two), negOne), $),
                $.power(DynamicConstants.Pi($), rational(-1, 2))
            ),
            two
        ),
        deriv
    );
}

export function derfc(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.multiply(
        $.multiply(
            $.multiply(
                exp($.multiply($.power(cadr(p1), two), negOne), $),
                $.power(DynamicConstants.Pi($), rational(-1, 2))
            ),
            wrap_as_int(-2)
        ),
        deriv
    );
}

export function dbesselj(p1: U, p2: Sym, $: ExtensionEnv): U {
    if ($.isZero(caddr(p1))) {
        return dbesselj0(p1, p2, $);
    }
    return dbesseljn(p1, p2, $);
}

export function dbesselj0(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.multiply(
        $.multiply(deriv, besselj(cadr(p1), one, $)),
        negOne
    );
}

export function dbesseljn(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    const A = $.add(caddr(p1), negOne);
    const B = $.multiply(caddr(p1), negOne);
    const C = besselj(cadr(p1), A, $);
    const D = $.divide(B, cadr(p1));
    const E = besselj(cadr(p1), caddr(p1), $);
    const F = $.multiply(D, E);
    const G = $.add(C, F);
    return $.multiply(deriv, G);
}

export function dbessely(p1: U, p2: Sym, $: ExtensionEnv): U {
    if ($.isZero(caddr(p1))) {
        return dbessely0(p1, p2, $);
    }
    return dbesselyn(p1, p2, $);
}

export function dbessely0(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    return $.multiply(
        $.multiply(deriv, besselj(cadr(p1), one, $)),
        negOne
    );
}

export function dbesselyn(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative(cadr(p1), p2, $);
    const A = $.add(caddr(p1), negOne);
    const B = $.multiply(caddr(p1), negOne);
    const C = $.divide(B, cadr(p1));
    const D = bessely(cadr(p1), caddr(p1), $);
    const E = bessely(cadr(p1), A, $);
    const F = $.multiply(C, D);
    const G = $.add(E, F);
    return $.multiply(deriv, G);
}

export function derivative_of_integral(p1: U): U {
    return cadr(p1);
}
