module Year2024.Day5

let isValidUpdate rules =
    List.pairwise >> List.forall (fun pair -> Set.contains pair rules)

let sortUpdate rules =
    List.sortWith (fun a b -> if Set.contains (a, b) rules then 1 else -1)

let middle (update: int list) = update[update.Length / 2]

let solve =
    DayUtils.solveDay (fun input ->
        let splitAt = input |> Array.findIndex ((=) "")
        let parsed = input |> Array.map Input.parseAllInts
        let rules = parsed[0 .. splitAt - 1] |> Array.map (fun r -> r[0], r[1]) |> Set

        let correct, incorrect =
            parsed[splitAt + 1 ..] |> Array.partition (isValidUpdate rules)

        let result1 = correct |> Array.sumBy middle
        let result2 = incorrect |> Array.map (sortUpdate rules) |> Array.sumBy middle

        result1, result2, 4662, 5900)
