module Year2025.Day5

type Range =
    { min: int64
      max: int64 }

    member inline this.size = this.max - this.min + 1L

    static member inline parse(s: string) =
        match s.Split '-' |> Array.map int64 with
        | [| min; max |] -> { min = min; max = max }
        | _ -> failwith $"Invalid range string {s}"

    static member inline contains (value: int64) (range: Range) =
        value >= range.min && value <= range.max

    static member inline overlaps (a: Range) (b: Range) = a.min <= b.max && b.min <= a.max

    static member inline combine (a: Range) (b: Range) =
        { min = min a.min b.min
          max = max a.max b.max }

let parseInput (input: string[]) =
    let ranges, available = input |> Array.splitAt (Array.findIndex ((=) "") input)

    ranges |> Array.map Range.parse, available[1..] |> Array.map int64

let rec combineRanges =
    function
    | a :: b :: rest when Range.overlaps a b -> combineRanges (Range.combine a b :: rest)
    | a :: rest -> a :: combineRanges rest
    | [] -> []

let isFresh ranges id = List.exists (Range.contains id) ranges

let solve =
    DayUtils.solveDay (fun input ->
        let allRanges, available = parseInput input

        let ranges = allRanges |> Array.sortBy _.min |> Array.toList |> combineRanges

        let result1 = available |> Array.filter (isFresh ranges) |> Array.length
        let result2 = ranges |> List.sumBy _.size

        result1, result2, 679, 358155203664116L)
