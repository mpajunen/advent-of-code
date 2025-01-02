module Year2024.Day14

open Vec2

type Robot = { Position: Vec; Velocity: Vec }

let parseRobot =
    Input.parseAllInts
    >> List.chunkBySize 2
    >> List.map (fun r -> { X = r[0]; Y = r[1] })
    >> (fun r -> { Position = r[0]; Velocity = r[1] })

let area = { X = 101; Y = 103 }

let center = { X = area.X / 2; Y = area.Y / 2 }

let getPositionAfter time robot =
    let raw = robot.Position + robot.Velocity * time

    { X = (raw.X % area.X + area.X) % area.X
      Y = (raw.Y % area.Y + area.Y) % area.Y }

let getPositionsAfter = getPositionAfter >> Array.map

let getQuadrant position =
    match compare position.X center.X, compare position.Y center.Y with
    | 0, _ -> None
    | _, 0 -> None
    | quadrant -> Some quadrant

let getSafetyFactor =
    Array.choose (getQuadrant)
    >> Array.countBy id
    >> Array.map snd
    >> Array.reduce ((*))

let getAdjacentCount positions =
    let set = positions |> Set

    positions
    |> Array.sumBy (fun p -> Vec.unitsAll |> List.sumBy (fun u -> if set.Contains(p + u) then 1 else 0))

let findChristmasTreeTime robots =
    let getAdjacent time =
        robots |> getPositionsAfter time |> getAdjacentCount

    let averageAdjacent = ([ 1..10 ] |> List.sumBy getAdjacent) / 10

    let rec findTime time =
        if getAdjacent time > averageAdjacent * 4 then // Determined by looking at the output :)
            time
        else
            findTime (time + 1)

    findTime 1

let solve =
    DayUtils.solveDay (fun input ->
        let robots = input |> Array.map parseRobot

        let result1 = robots |> getPositionsAfter 100 |> getSafetyFactor
        let result2 = robots |> findChristmasTreeTime

        result1, result2, 232253028, 8179)
