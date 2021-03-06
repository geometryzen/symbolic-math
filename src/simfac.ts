import { add_terms } from './calculators/add/add_terms';
import { ExtensionEnv } from './env/ExtensionEnv';
import { factorial } from './operators/factorial/factorial';
import { equaln, is_num_and_eq_minus_one } from './is';
import { multiply_items_factoring } from './multiply';
import { FACTORIAL } from './runtime/constants';
import { is_add, is_factorial, is_multiply, is_power } from './runtime/helpers';
import { stack_push } from './runtime/stack';
import { caadr, cadadr, caddr, cadr } from './tree/helpers';
import { negOne, one } from './tree/rat/Rat';
import { U } from './tree/tree';

/*
 Simplify factorials

The following script

  F(n,k) = k binomial(n,k)
  (F(n,k) + F(n,k-1)) / F(n+1,k)

generates

       k! n!             n! (1 - k + n)!              k! n!
 -------------------- + -------------------- - ----------------------
 (-1 + k)! (1 + n)!     (1 + n)! (-k + n)!     k (-1 + k)! (1 + n)!

Simplify each term to get

    k       1 - k + n       1
 ------- + ----------- - -------
  1 + n       1 + n       1 + n

Then simplify the sum to get

    n
 -------
  1 + n

*/
// simplify factorials term-by-term
export function Eval_simfac(p1: U, $: ExtensionEnv): void {
    const result = simfac($.valueOf(cadr(p1)), $);
    stack_push(result);
}

export function simfac(p1: U, $: ExtensionEnv): U {
    if (is_add(p1)) {
        const terms = p1.tail().map(
            function (x) {
                return simfac_term(x, $);
            }
        );
        return add_terms(terms, $);
    }
    return simfac_term(p1, $);
}

function simfac_term(p1: U, $: ExtensionEnv): U {
    // if not a product of factors then done
    if (!is_multiply(p1)) {
        return p1;
    }

    // push all factors
    const factors = p1.tail();

    // keep trying until no more to do
    while (yysimfac(factors, $)) {
        // do nothing
    }

    return multiply_items_factoring(factors, $);
}

// try all pairs of factors
function yysimfac(stack: U[], $: ExtensionEnv): boolean {
    for (let i = 0; i < stack.length; i++) {
        const p1 = stack[i];
        for (let j = 0; j < stack.length; j++) {
            if (i === j) {
                continue;
            }
            const p2 = stack[j];

            //  n! / n    ->  (n - 1)!
            if (is_factorial(p1) && is_power(p2) && is_num_and_eq_minus_one(caddr(p2)) && $.equals(cadr(p1), cadr(p2))) {
                stack[i] = factorial($.subtract(cadr(p1), one));
                stack[j] = one;
                return true;
            }

            //  n / n!    ->  1 / (n - 1)!
            if (is_power(p2) && is_num_and_eq_minus_one(caddr(p2)) && caadr(p2).equals(FACTORIAL) && $.equals(p1, cadadr(p2))) {
                stack[i] = $.inverse(factorial($.add(p1, negOne)));
                stack[j] = one;
                return true;
            }

            //  (n + 1) n!  ->  (n + 1)!
            if (is_factorial(p2)) {
                const p3 = $.subtract(p1, cadr(p2));
                if ($.isOne(p3)) {
                    stack[i] = factorial(p1);
                    stack[j] = one;
                    return true;
                }
            }

            //  1 / ((n + 1) n!)  ->  1 / (n + 1)!
            if (
                is_power(p1) &&
                is_num_and_eq_minus_one(caddr(p1)) &&
                is_power(p2) &&
                is_num_and_eq_minus_one(caddr(p2)) &&
                caadr(p2).equals(FACTORIAL)
            ) {
                const p3 = $.subtract(cadr(p1), cadr(cadr(p2)));
                if ($.isOne(p3)) {
                    stack[i] = $.inverse(factorial(cadr(p1)));
                    stack[j] = one;
                    return true;
                }
            }

            //  (n + 1)! / n!  ->  n + 1

            //  n! / (n + 1)!  ->  1 / (n + 1)
            if (
                is_factorial(p1) &&
                is_power(p2) &&
                is_num_and_eq_minus_one(caddr(p2)) &&
                caadr(p2).equals(FACTORIAL)
            ) {
                const p3 = $.subtract(cadr(p1), cadr(cadr(p2)));
                if ($.isOne(p3)) {
                    stack[i] = cadr(p1);
                    stack[j] = one;
                    return true;
                }
                if (is_num_and_eq_minus_one(p3)) {
                    stack[i] = $.inverse(cadr(cadr(p2)));
                    stack[j] = one;
                    return true;
                }
                if (equaln(p3, 2)) {
                    stack[i] = cadr(p1);
                    stack[j] = $.add(cadr(p1), negOne);
                    return true;
                }
                if (equaln(p3, -2)) {
                    stack[i] = $.inverse(cadr(cadr(p2)));
                    stack[j] = $.inverse($.add(cadr(cadr(p2)), negOne));
                    return true;
                }
            }
        }
    }
    return false;
}
