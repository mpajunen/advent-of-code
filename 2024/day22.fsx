#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

open System.Collections.Generic

let mix secret n = secret ^^^ n

let prune secret = secret % 16_777_216L

let step op secret = secret |> op |> mix secret |> prune

let getNext =
    [ (fun s -> s * 64L); (fun s -> s / 32L); (fun s -> s * 2048L) ]
    |> List.map step
    |> List.reduce (>>)

let getSecrets secret =
    [| 1..2000 |] |> Array.scan (fun s _ -> getNext s) secret

let modulo n m = (n % m + m) % m

let nextKey key n = modulo (key * 100L + n) 100_000_000L

let getSequences (secrets: int64 array) =
    let seqs = Array.create secrets.Length (0L, 0L)

    let mutable key = 0L
    let mutable previous = 0L

    for i in 0 .. secrets.Length - 1 do
        let price = secrets[i] % 10L
        key <- nextKey key (price - previous)

        seqs[i] <- key, price

        previous <- price

    seqs[4..] |> Array.distinctBy fst

let getCounts allSecrets =
    let counts = Dictionary()

    for secrets in allSecrets do
        for key, price in getSequences secrets do
            let prev = if counts.ContainsKey key then counts[key] else 0L

            counts[key] <- prev + price

    counts

DayUtils.runDay (fun input ->
    let allSecrets = input |> Array.map (int64 >> getSecrets)

    let result1 = allSecrets |> Array.sumBy Array.last
    let result2 = allSecrets |> getCounts |> _.Values |> Seq.max

    result1, result2, 16619522798L, 1854L)
