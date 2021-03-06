import { ExtensionEnv } from './env/ExtensionEnv';
import { makeList } from './makeList';
import { ERFC } from './runtime/constants';
import { stack_push } from './runtime/stack';
import { wrap_as_flt } from './tree/flt/Flt';
import { is_flt } from './operators/flt/is_flt';
import { cadr } from './tree/helpers';
import { one } from './tree/rat/Rat';
import { U } from './tree/tree';

//-----------------------------------------------------------------------------
//
//  Author : philippe.billet@noos.fr
//
//  erfc(x)
//
//  GW  Added erfc() from Numerical Recipes in C
//
//-----------------------------------------------------------------------------
export function Eval_erfc(p1: U, $: ExtensionEnv): void {
    const result = yerfc($.valueOf(cadr(p1)), $);
    stack_push(result);
}

function yerfc(p1: U, $: ExtensionEnv): U {
    if (is_flt(p1)) {
        const d = erfc(p1.d);
        return wrap_as_flt(d);
    }

    if ($.isZero(p1)) {
        return one;
    }

    return makeList(ERFC, p1);
}

// from Numerical Recipes in C
export function erfc(x: number) {
    if (x === 0) {
        return 1.0;
    }

    const z = Math.abs(x);
    const t = 1.0 / (1.0 + 0.5 * z);

    const ans =
        t *
        Math.exp(
            -z * z -
            1.26551223 +
            t *
            (1.00002368 +
                t *
                (0.37409196 +
                    t *
                    (0.09678418 +
                        t *
                        (-0.18628806 +
                            t *
                            (0.27886807 +
                                t *
                                (-1.13520398 +
                                    t *
                                    (1.48851587 +
                                        t * (-0.82215223 + t * 0.17087277))))))))
        );

    if (x >= 0.0) {
        return ans;
    }

    return 2.0 - ans;
}
