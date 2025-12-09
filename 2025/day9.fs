module Year2025.Day9

open Vec2

type Area = { Min: Vec; Max: Vec }

let toArea (a, b) =
    { Min = { X = min a.X b.X; Y = min a.Y b.Y }
      Max = { X = max a.X b.X; Y = max a.Y b.Y } }

let areaSize a =
    int64 (a.Max.X - a.Min.X + 1) * int64 (a.Max.Y - a.Min.Y + 1)

let innerArea a =
    { Min = { X = a.Min.X + 1; Y = a.Min.Y + 1 }
      Max = { X = a.Max.X - 1; Y = a.Max.Y - 1 } }

let areaIntersects a b =
    a.Min.X <= b.Max.X
    && a.Max.X >= b.Min.X
    && a.Min.Y <= b.Max.Y
    && a.Max.Y >= b.Min.Y

let noIntersects edges area =
    edges |> Array.exists (areaIntersects area) |> not

let getRectangles =
    Array.map toArea >> Array.distinct >> Array.sortByDescending areaSize

let solve =
    DayUtils.solveDay (fun input ->
        let tiles = input |> Array.map Vec.fromString

        let rectangles = Array.allPairs tiles tiles |> getRectangles
        let edges = Array.append tiles [| tiles[0] |] |> Array.pairwise |> Array.map toArea

        let result1 = rectangles[0] |> areaSize
        let result2 = rectangles |> Array.find (innerArea >> noIntersects edges) |> areaSize

        result1, result2, 4767418746L, 1461987144L)
