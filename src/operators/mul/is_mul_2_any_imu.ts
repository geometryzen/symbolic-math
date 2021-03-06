import { IMU_TYPE, is_imu } from "../imu/is_imu";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_any_imu(expr: Cons): expr is BCons<Sym, U, IMU_TYPE> {
    return is_mul_2_any_any(expr) && is_imu(expr.rhs);
}