module Program =
    let getSolver (year, day) =
        match year with
        | _ -> failwith $"Invalid year: {year}"

    let runDay date =
        DayUtils.readInput date |> getSolver date

    let runYear year =
        for day in 1..25 do
            printfn "----------------------------------------"
            printfn "%d: Day %d" year day
            runDay (year, day)

    let getYearParams =
        function
        | [ year ] -> int year
        | _ -> System.DateTime.Now.Year - (if System.DateTime.Now.Month = 12 then 0 else 1)

    let getDayParams =
        function
        | day :: rest -> getYearParams rest, int day
        | _ -> getYearParams [], System.DateTime.Now.Day

    [<EntryPoint>]
    let main argv =
        match argv |> Array.toList with
        | "day" :: rest -> getDayParams rest |> runDay
        | "year" :: rest -> getYearParams rest |> runYear
        | _ -> printfn $"Usage: day <year> <day>\n       year <year>"

        0
