module Year2025.Day7

open Vec2

let countSplits grid =
    let start = Grid.findKey ((=) 'S') grid

    let moveFrontier =
        List.map ((+) Dir.Down)
        >> List.collect (fun p ->
            match Grid.tryGet grid p with
            | Some '.' -> [ p ]
            | Some '^' -> [ p + Dir.Left; p + Dir.Right ]
            | _ -> [])

    let rec getSplits frontier =
        match moveFrontier frontier with
        | [] -> 0
        | next ->
            let splits = List.length next - List.length frontier

            next |> List.distinct |> getSplits |> (+) splits

    getSplits [ start ]

let solve =
    DayUtils.solveDay (fun input ->
        let grid = array2D input

        let result1 = grid |> countSplits
        let result2 = 0

        result1, result2, 1585, 0)
