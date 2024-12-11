module Func

open System.Collections.Generic

let memoize f =
    let cache = Dictionary()

    let rec g x =
        match cache.TryGetValue x with
        | true, result -> result
        | _ ->
            let result = f g x in
            cache[x] <- result
            result

    g

let memoize2 f =
    let cache = Dictionary()

    let rec g x y =
        let key = x, y

        match cache.TryGetValue key with
        | true, result -> result
        | _ ->
            let result = f g x y in
            cache[key] <- result
            result

    g
