import { ExtensionEnv } from './env/ExtensionEnv';
import { makeList } from './makeList';
import { nativeInt } from './nativeInt';
import { HILBERT } from './runtime/constants';
import { Tensor } from './tree/tensor/Tensor';
import { wrap_as_int } from './tree/rat/Rat';
import { Sym } from './tree/sym/Sym';
import { Cons, U } from './tree/tree';

//-----------------------------------------------------------------------------
//
//  Create a Hilbert matrix
//
//  Input:    Dimension
//
//  Output:    Hilbert matrix
//
//  Example:
//
//  > hilbert(5)
//  ((1,1/2,1/3,1/4),(1/2,1/3,1/4,1/5),(1/3,1/4,1/5,1/6),(1/4,1/5,1/6,1/7))
//
//-----------------------------------------------------------------------------
//define AELEM(i, j) A->u.tensor->elem[i * n + j]
export function hilbert(N: U, $: ExtensionEnv): Cons | Sym | Tensor {
    const n = nativeInt(N);
    if (n < 2) {
        return makeList(HILBERT, N);
    }
    const dims = [n, n];
    const elems = new Array<U>(n * n);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            elems[i * n + j] = $.inverse(wrap_as_int(i + j + 1));
        }
    }
    return new Tensor(dims, elems);
}
