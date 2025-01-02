module Year2024.Day3

let rec getMults enabled =
    function
    | Input.ParseRegex "(mul|do|don't)\((\d*),?(\d*)\)(.*)" [ op; a; b; rest ] ->
        match op with
        | "do" -> getMults true rest
        | "don't" -> getMults false rest
        | _ -> (int a * int b, enabled) :: getMults enabled rest
    | _ -> []

let solve =
    DayUtils.solveDay (fun input ->
        let mults = input |> String.concat "" |> getMults true

        let result1 = mults |> List.sumBy fst
        let result2 = mults |> List.filter snd |> List.sumBy fst

        result1, result2, 156388521, 75920122)
