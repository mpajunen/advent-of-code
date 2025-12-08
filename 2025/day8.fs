module Year2025.Day8

type Vec =
    { X: int64
      Y: int64
      Z: int64 }

    static member inline parse(s: string) =
        match s.Split ',' |> Array.map int64 with
        | [| x; y; z |] -> { X = x; Y = y; Z = z }
        | _ -> failwith $"Invalid Vec string {s}"

    static member inline distanceSquared (a: Vec) (b: Vec) =
        let dx = a.X - b.X
        let dy = a.Y - b.Y
        let dz = a.Z - b.Z

        dx * dx + dy * dy + dz * dz

let getConnections (points: Vec[]) =
    [ for i in 0 .. points.Length - 1 do
          for j in i + 1 .. points.Length - 1 do
              yield i, j ]
    |> List.sortBy (fun (a, b) -> Vec.distanceSquared points[a] points[b])

let groupPoints connections =
    let mutable circuits = Array.init 1000 (fun n -> n)

    let connect (a, b) =
        let aCircuit = circuits[a]
        let bCircuit = circuits[b]

        for i in 0 .. circuits.Length - 1 do
            if circuits[i] = bCircuit then
                circuits[i] <- aCircuit

    let rec connectTillComplete =
        function
        | [] -> List.last connections // Dummy value for part 1
        | next :: rest ->
            connect next

            match circuits |> Array.distinct |> Array.length with
            | 1 -> next
            | _ -> connectTillComplete rest

    circuits, connections |> connectTillComplete

let getCounts = Array.countBy id >> Array.map snd >> Array.sortDescending

let combineLargest = getCounts >> Array.take 3 >> Array.reduce (*)

let getConnectionCombo (points: Vec[]) (a, b) = points[a].X * points[b].X

let solve =
    DayUtils.solveDay (fun input ->
        let points = input |> Array.map Vec.parse

        let connections = getConnections points

        let result1 = connections |> List.take 1000 |> groupPoints |> fst |> combineLargest
        let result2 = connections |> groupPoints |> snd |> getConnectionCombo points

        result1, result2, 181584, 8465902405L)
