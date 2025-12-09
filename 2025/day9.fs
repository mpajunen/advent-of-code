module Year2025.Day9

open Vec2

type Area = { Min: Vec; Max: Vec }

let toArea (a, b) =
    { Min = { X = min a.X b.X; Y = min a.Y b.Y }
      Max = { X = max a.X b.X; Y = max a.Y b.Y } }

let areaSize a =
    int64 (a.Max.X - a.Min.X + 1) * int64 (a.Max.Y - a.Min.Y + 1)

let getLargestSize = Array.map areaSize >> Array.max

let solve =
    DayUtils.solveDay (fun input ->
        let tiles = input |> Array.map Vec.fromString

        let rectangles = Array.allPairs tiles tiles |> Array.map toArea |> Array.distinct

        let result1 = rectangles |> getLargestSize
        let result2 = 0

        result1, result2, 4767418746L, 0)
