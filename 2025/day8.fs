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

type Connection =
    { A: int
      B: int
      DistanceSquared: int64 }

let getShortestConnections (points: Vec[]) =
    [ for i in 0 .. points.Length - 1 do
          for j in i + 1 .. points.Length - 1 do
              yield
                  { A = i
                    B = j
                    DistanceSquared = Vec.distanceSquared points[i] points[j] } ]
    |> List.sortBy _.DistanceSquared
    |> List.take 1000

let connectCircuits connections =
    let mutable circuits = Array.init 1000 (fun n -> n)

    let connect connection =
        let aCircuit = circuits[connection.A]
        let bCircuit = circuits[connection.B]

        for i in 0 .. circuits.Length - 1 do
            if circuits[i] = bCircuit then
                circuits[i] <- aCircuit

    connections |> List.iter connect

    circuits

let getCounts = Array.countBy id >> Array.map snd >> Array.sortDescending

let combineLargest = getCounts >> Array.take 3 >> Array.reduce (*)

let solve =
    DayUtils.solveDay (fun input ->
        let points = input |> Array.map Vec.parse

        let result1 = points |> getShortestConnections |> connectCircuits |> combineLargest
        let result2 = 0L

        result1, result2, 181584, 0L)
