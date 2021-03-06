import { ExtensionEnv } from './env/ExtensionEnv';
import { makeList } from './makeList';
import { is_flt } from './operators/flt/is_flt';
import { is_rat } from './operators/rat/is_rat';
import { is_negative } from './predicates/is_negative';
import { DIRAC } from './runtime/constants';
import { is_add, is_power } from './runtime/helpers';
import { stack_push } from './runtime/stack';
import { cadr } from './tree/helpers';
import { one, zero } from './tree/rat/Rat';
import { is_cons, U } from './tree/tree';

//-----------------------------------------------------------------------------
//
//  Author : philippe.billet@noos.fr
//
//  Dirac function dirac(x)
//  dirac(-x)=dirac(x)
//  dirac(b-a)=dirac(a-b)
//-----------------------------------------------------------------------------
export function Eval_dirac(p1: U, $: ExtensionEnv): void {
    const result = dirac($.valueOf(cadr(p1)), $);
    stack_push(result);
}

export function dirac(p1: U, $: ExtensionEnv): U {
    return ydirac(p1, $);
}

function ydirac(p1: U, $: ExtensionEnv): U {
    if (is_flt(p1)) {
        if ($.isZero(p1)) {
            return one;
        }
        return zero;
    }

    if (is_rat(p1)) {
        if ($.isZero(p1)) {
            return one;
        }
        return zero;
    }

    if (is_power(p1)) {
        return makeList(DIRAC, cadr(p1));
    }

    if (is_negative(p1)) {
        return makeList(DIRAC, $.negate(p1));
    }

    if (is_negative(p1) || (is_cons(p1) && is_add(p1) && is_negative(cadr(p1)))) {
        p1 = $.negate(p1);
    }

    return makeList(DIRAC, p1);
}
