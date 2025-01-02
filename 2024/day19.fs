module Year2024.Day19

let getOptionCount (patterns, patternMaxLength) (design: string) =
    let counts = Array.create (design.Length + 1) 0L
    counts[0] <- 1L

    for i in 0 .. design.Length - 1 do
        for j in i .. min (i + patternMaxLength) design.Length - 1 do
            if Set.contains design[i..j] patterns then
                counts[j + 1] <- counts[j + 1] + counts[i]

    counts[design.Length]

let solve = DayUtils.solveDay (fun input ->
    let patterns =
        input[0].Split ", " |> fun p -> Set p, p |> Array.map String.length |> Array.max

    let designs = input[2..]

    let counts = designs |> Array.map (getOptionCount patterns)

    let result1 = counts |> Array.filter (fun c -> c > 0) |> Array.length
    let result2 = counts |> Array.sum

    result1, result2, 247, 692596560138745L)
