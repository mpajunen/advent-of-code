module Year2025.Day1

let START = 50
let SIZE = 100

let parseRow (row: string) =
    match row[0], row[1..] with
    | 'L', clicks -> -(clicks |> int)
    | 'R', clicks -> clicks |> int
    | _ -> failwith $"Invalid row: {row}"

let rotate dial rotation = (dial + rotation) % SIZE

let rotationPasses dial rotation =
    match dial + rotation with
    | n when n > 0 -> n / SIZE + if dial < 0 then 1 else 0
    | n when n < 0 -> -n / SIZE + if dial > 0 then 1 else 0
    | _ -> 1

let totalPasses (dial, passes) rotation =
    rotate dial rotation, passes + rotationPasses dial rotation

let solve =
    DayUtils.solveDay (fun input ->
        let rotations = input |> Array.map parseRow

        let result1 =
            rotations |> Array.scan rotate START |> Array.filter ((=) 0) |> Array.length

        let result2 = rotations |> Array.fold totalPasses (START, 0) |> snd

        result1, result2, 1097, 7101)
