import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { is_blade } from "../blade/is_blade";
import { BCons } from "../helpers/BCons";
import { is_rat } from "../rat/RatExtension";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_blade_rat(expr: Cons): expr is BCons<Sym, Blade, Rat> {
    return is_mul_2_any_any(expr) && is_blade(expr.lhs) && is_rat(expr.rhs);
}