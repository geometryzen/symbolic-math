import { ExtensionEnv, Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { imu } from "../../env/imu";
import { compare_blade_blade } from "../../operators/blade/BladeExtension";
import { is_blade } from "../../operators/blade/is_blade";
import { is_unaop } from "../../operators/helpers/is_unaop";
import { is_imu } from "../../operators/imu/is_imu";
import { is_mul_2_any_any } from "../../operators/mul/is_mul_2_any_any";
import { is_mul_2_any_blade } from "../../operators/mul/is_mul_2_any_blade";
import { is_mul_2_num_any } from "../../operators/mul/is_mul_2_num_any";
import { is_mul_2_sym_sym } from "../../operators/mul/is_mul_2_sym_sym";
import { is_num } from "../../operators/num/is_num";
import { is_pow_2_any_any } from "../../operators/pow/is_pow_2_any_any";
import { is_pow_2_sym_rat } from "../../operators/pow/is_pow_2_sym_rat";
import { is_rat } from "../../operators/rat/RatExtension";
import { is_sym } from "../../operators/sym/is_sym";
import { one, zero } from "../../tree/rat/Rat";
import { is_cons, U } from "../../tree/tree";
import { factorizeL } from "../factorizeL";
import { compare_num_num } from "./compare_num_num";
import { compare_sym_sym } from "./compare_sym_sym";
import { compare_vars_vars } from "./compare_vars_vars";
import { free_vars } from "./free_vars";

export function compare_terms(lhs: U, rhs: U, $: ExtensionEnv): Sign {
    // console.log(`ENTERING compare_terms ${render_as_infix(lhs, $)} ${render_as_infix(rhs, $)}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: Sign, description: string): Sign {
        // console.log(`LEAVING  compare_terms ${render_as_infix(lhs, $)} ${render_as_infix(rhs, $)} => ${retval} @ ${description}`);
        return retval;
    };
    // console.log(`compare_terms ${render_as_infix(lhs, $)} ${render_as_infix(rhs, $)}`);
    if (lhs.equals(rhs)) {
        return hook(SIGN_EQ, "A");
    }
    if (is_sym(lhs) && is_sym(rhs)) {
        return hook(compare_sym_sym(lhs, rhs), "B");
    }
    if (is_cons(lhs)) {
        if (is_mul_2_num_any(lhs)) {
            // A factor of a number on the lhs has no effect.
            // Note that this only catches the case when lhs = (* Num X).
            return hook(compare_terms(lhs.rhs, rhs, $), "C");
        }
        if (is_mul_2_any_any(lhs)) {
            const [a, b] = factorizeL(lhs);
            if (is_rat(a)) {
                return hook(compare_terms(b, rhs, $), "D");
            }
        }
    }
    if (is_cons(rhs)) {
        if (is_mul_2_num_any(rhs)) {
            // A factor of a number on the rhs has no effect.
            // Note that this only catches the case when rhs = (* Num X).
            return hook(compare_terms(lhs, rhs.rhs, $), "E");
        }
        if (is_mul_2_any_any(rhs)) {
            const [a, b] = factorizeL(rhs);
            // console.lg(`factorizeL ${print_expr(rhs, $)} => a = ${print_expr(a, $)}, b = ${print_expr(b, $)}`);
            if (is_rat(a)) {
                return hook(compare_terms(lhs, b, $), "F");
            }
        }
    }
    if (is_sym(lhs)) {
        if ($.isImag(rhs)) {
            return hook(SIGN_LT, "G");
        }
        if (is_num(rhs)) {
            // Comparing (power x 1) to (power x 0)
            return hook(compare_num_num(one, zero), "H");
        }
        if (is_cons(rhs) && is_pow_2_any_any(rhs)) {
            const base = rhs.lhs;
            const expo = rhs.rhs;
            if (lhs.equals(base)) {
                if (is_num(expo)) {
                    return hook(compare_num_num(one, expo), "I");
                }
            }
        }
        const lvars = free_vars(lhs, $);
        const rvars = free_vars(rhs, $);
        // console.lg(`A. compare_vars_vars lvars=${lvars} rvars=${rvars}`);
        const retval = compare_vars_vars(lvars, rvars);
        return hook(retval, "J");
    }
    if (is_sym(rhs)) {
        if ($.isImag(lhs)) {
            return hook(SIGN_GT, "K");
        }
        if (is_num(lhs)) {
            // Comparing (power x 0) to (power x 1)
            return hook(compare_num_num(zero, one), "L");
        }
        if (is_cons(lhs) && is_pow_2_any_any(lhs)) {
            const base = lhs.lhs;
            const expo = lhs.rhs;
            if (rhs.equals(base)) {
                if (is_num(expo)) {
                    return hook(compare_num_num(expo, one), "M");
                }
            }
        }
        const lvars = free_vars(lhs, $);
        const rvars = free_vars(rhs, $);
        // console.lg(`B. compare_vars_vars lhs=${lhs} rhs=${rhs}`);
        const retval = compare_vars_vars(lvars, rvars);
        return hook(retval, "N");
    }
    if (is_num(lhs)) {
        if ($.isImag(rhs)) {
            return hook(SIGN_LT, "O");
        }
        if (is_cons(rhs) && is_pow_2_any_any(rhs)) {
            const expo = rhs.rhs;
            if (is_num(expo)) {
                return hook(compare_num_num(zero, expo), "P");
            }
        }
    }
    if (is_num(rhs)) {
        if ($.isImag(lhs)) {
            return hook(SIGN_GT, "Q");
        }
        if (is_sym(lhs)) {
            return hook(compare_num_num(one, zero), "R");
        }
        if (is_cons(lhs) && is_pow_2_any_any(lhs)) {
            const base = lhs.lhs;
            const expo = lhs.rhs;
            if (is_sym(base) && is_num(expo)) {
                return hook(compare_num_num(expo, zero), "S");
            }
        }
    }
    if (is_blade(lhs)) {
        if (is_blade(rhs)) {
            return hook(compare_blade_blade(lhs, rhs), "T");
        }
    }
    if (is_cons(lhs) && is_cons(rhs)) {
        if (is_mul_2_any_blade(lhs) && is_mul_2_any_blade(rhs)) {
            switch (compare_blade_blade(lhs.rhs, rhs.rhs)) {
                case SIGN_GT: {
                    return hook(SIGN_GT, "U");
                }
                case SIGN_LT: {
                    return hook(SIGN_LT, "V");
                }
                default: {
                    return hook(compare_terms(lhs.lhs, rhs.lhs, $), "W");
                }
            }
        }
        if (is_mul_2_any_blade(lhs)) {
            return hook(SIGN_GT, "X");
        }
        if (is_mul_2_any_blade(rhs)) {
            return hook(SIGN_LT, "Y");
        }
        if (is_mul_2_any_any(lhs) && is_mul_2_any_any(rhs)) {
            switch (compare_terms(lhs.lhs, rhs.lhs, $)) {
                case SIGN_GT: {
                    return SIGN_GT;
                }
                case SIGN_LT: {
                    return SIGN_LT;
                }
                default: {
                    return compare_terms(lhs.rhs, rhs.rhs, $);
                }
            }
        }
        if (is_pow_2_any_any(lhs) && is_pow_2_any_any(rhs)) {
            // Compare based upon the base first.
            const baseL = lhs.lhs;
            const baseR = rhs.lhs;
            switch (compare_terms(baseL, baseR, $)) {
                case SIGN_GT: {
                    return SIGN_GT;
                }
                case SIGN_LT: {
                    return SIGN_LT;
                }
                default: {
                    // Compare based on the exponents.
                    const expoL = lhs.rhs;
                    const expoR = rhs.rhs;
                    if (is_num(expoL) && is_num(expoR)) {
                        return compare_num_num(expoL, expoR);
                    }
                    return compare_terms(expoL, expoR, $);
                }
            }
        }
        if (is_pow_2_sym_rat(lhs) && is_mul_2_sym_sym(rhs)) {
            const base = lhs.lhs;
            const expo = lhs.rhs;
            if (expo.isTwo()) {
                if (base.equals(rhs.lhs)) {
                    return compare_terms(base, rhs.rhs, $);
                }
                if (base.equals(rhs.rhs)) {
                    return compare_terms(base, rhs.lhs, $);
                }
            }
        }
        if (is_mul_2_sym_sym(lhs) && is_pow_2_sym_rat(rhs)) {
            const base = rhs.lhs;
            const expo = rhs.rhs;
            if (expo.isTwo()) {
                if (lhs.lhs.equals(base)) {
                    return compare_terms(lhs.rhs, base, $);
                }
                if (lhs.rhs.equals(base)) {
                    return compare_terms(lhs.lhs, base, $);
                }
            }
        }
        if (is_unaop(lhs) && is_unaop(rhs)) {
            switch (compare_terms(lhs.opr, rhs.opr, $)) {
                case SIGN_GT: {
                    return SIGN_GT;
                }
                case SIGN_LT: {
                    return SIGN_LT;
                }
                default: {
                    return compare_terms(lhs.arg, rhs.arg, $);
                }
            }
        }
        if (is_imu(lhs)) {
            // This is really a bit imprecise.
            if (rhs.contains(imu)) {
                return SIGN_EQ;
            }
            else {
                return SIGN_GT;
            }
        }
        if (is_imu(rhs)) {
            // This is really a bit imprecise.
            if (lhs.contains(imu)) {
                return SIGN_EQ;
            }
            else {
                return SIGN_LT;
            }
        }
        // Exchanging unary and binary operators can cause looping problems.
        // e.g. when changing associativity.
        /*
        if (is_unaop(lhs) && is_binop(rhs)) {
            return SIGN_LT;
        }
        if (is_binop(lhs) && is_unaop(rhs)) {
            return SIGN_GT;
        }
        */
        // throw new Error(`compare_terms_redux lhs=${print_expr(lhs, $)} rhs=${print_expr(rhs, $)}`);
        //        return compare_terms_redux(lhs.opr, rhs.opr, $);
    }
    if ($.isImag(lhs) && $.isReal(rhs)) {
        return SIGN_GT;
    }
    if ($.isReal(lhs) && $.isImag(rhs)) {
        return SIGN_LT;
    }
    const lvars = free_vars(lhs, $);
    const rvars = free_vars(rhs, $);
    // console.log(`C. compare_vars_vars lhs=${lhs} rhs=${rhs}`);
    const retval = compare_vars_vars(lvars, rvars);
    return hook(retval, "Z");

    // // console.lg(`UNDECIDED compare_terms_redux lhs=${print_expr(lhs, $)} rhs=${print_expr(rhs, $)}`);
    // return SIGN_EQ;
}
