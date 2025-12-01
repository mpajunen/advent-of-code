module Year2024.Day2

let isSafe level =
    let changes = level |> List.pairwise |> List.map (fun (a, b) -> b - a)

    changes |> List.forall (fun c -> c >= 1 && c <= 3)
    || changes |> List.forall (fun c -> c <= -1 && c >= -3)

let dampenedOptions level =
    seq { 0 .. List.length level - 1 }
    |> Seq.map (fun i -> level[.. i - 1] @ level[i + 1 ..])

let isSafeDampened level =
    isSafe level || level |> dampenedOptions |> Seq.exists isSafe

let solve =
    DayUtils.solveDay (fun input ->
        let levels = input |> Array.map Input.parseAllInts

        let result1 = levels |> Array.filter isSafe |> Array.length
        let result2 = levels |> Array.filter isSafeDampened |> Array.length

        result1, result2, 402, 455)
