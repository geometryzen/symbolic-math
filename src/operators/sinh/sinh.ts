import { ExtensionEnv } from '../../env/ExtensionEnv';
import { makeList } from '../../makeList';
import { ARCSINH, SINH } from '../../runtime/constants';
import { wrap_as_flt } from '../../tree/flt/Flt';
import { cadr } from '../../tree/helpers';
import { zero } from '../../tree/rat/Rat';
import { car, U } from '../../tree/tree';
import { is_flt } from '../flt/is_flt';

//            exp(x) - exp(-x)
//  sinh(x) = ----------------
//                   2

/**
 * sinh(x) = (1/2) * (exp(x) - exp(-x))
 */
export function sinh(expr: U, $: ExtensionEnv): U {
    if (car(expr).equals(ARCSINH)) {
        return cadr(expr);
    }
    if (is_flt(expr)) {
        let d = Math.sinh(expr.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return wrap_as_flt(d);
    }
    if ($.isZero(expr)) {
        return zero;
    }
    return makeList(SINH, expr);
}
