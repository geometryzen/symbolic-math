import { is_blade } from "../../operators/blade/is_blade";
import { is_hyp } from "../../operators/hyp/is_hyp";
import { is_sym } from "../../operators/sym/is_sym";
import { is_imu } from "../../operators/imu/is_imu";
import { is_flt } from "../../operators/flt/is_flt";
import { is_rat } from "../../operators/rat/is_rat";
import { is_tensor } from "../../operators/tensor/is_tensor";
import { is_cons, is_nil, U } from "../../tree/tree";
import { is_uom } from "../../operators/uom/is_uom";

const GROUP_NIL = 0;
const GROUP_NUM = 1;
const GROUP_SYM = 2;
const GROUP_TENSOR = 3;
const GROUP_HYP = 4;
const GROUP_CONS = 5;
const GROUP_IMU = 6;
const GROUP_BLADE = 7;
const GROUP_UOM = 8;

type GROUP =
    typeof GROUP_NIL |
    typeof GROUP_NUM |
    typeof GROUP_SYM |
    typeof GROUP_TENSOR |
    typeof GROUP_CONS |
    typeof GROUP_IMU |
    typeof GROUP_HYP |
    typeof GROUP_BLADE |
    typeof GROUP_UOM;

export function group(expr: U): GROUP {
    if (is_rat(expr)) {
        return GROUP_NUM;
    }
    if (is_flt(expr)) {
        return GROUP_NUM;
    }
    if (is_sym(expr)) {
        return GROUP_SYM;
    }
    if (is_cons(expr)) {
        return GROUP_CONS;
    }
    if (is_hyp(expr)) {
        return GROUP_HYP;
    }
    if (is_imu(expr)) {
        return GROUP_IMU;
    }
    if (is_blade(expr)) {
        return GROUP_BLADE;
    }
    if (is_tensor(expr)) {
        return GROUP_TENSOR;
    }
    if (is_uom(expr)) {
        return GROUP_UOM;
    }
    if (is_nil(expr)) {
        return GROUP_NIL;
    }
    throw new Error(`group() of ${expr}`);
}
