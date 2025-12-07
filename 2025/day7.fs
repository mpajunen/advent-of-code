module Year2025.Day7

open Vec2

type Beam =
    { Location: Vec
      Splits: int
      Timelines: int64 }

    static member inline move b =
        { b with
            Location = b.Location + Dir.Down }

    static member inline split b =
        [ { b with
              Splits = b.Splits
              Location = b.Location + Dir.Left }
          { b with
              Splits = 1
              Location = b.Location + Dir.Right } ]

    static member inline combine (a: Beam) (b: Beam) =
        { Location = a.Location
          Splits = a.Splits + b.Splits
          Timelines = a.Timelines + b.Timelines }

let propagateBeams grid =
    let start = Grid.findKey ((=) 'S') grid

    let moveFrontier =
        List.map Beam.move
        >> List.collect (fun b ->
            match Grid.tryGet grid b.Location with
            | Some '.' -> [ b ]
            | Some '^' -> Beam.split b
            | _ -> [])

    let combineLocation =
        List.groupBy _.Location >> List.map (snd >> List.reduce Beam.combine)

    let rec propagate frontier =
        match moveFrontier frontier with
        | [] -> List.reduce Beam.combine frontier
        | next -> next |> combineLocation |> propagate

    propagate
        [ { Location = start
            Splits = 0
            Timelines = 1L } ]

let solve =
    DayUtils.solveDay (fun input ->
        let combined = input |> array2D |> propagateBeams

        let result1 = combined.Splits
        let result2 = combined.Timelines

        result1, result2, 1585, 16716444407407L)
