#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"

type Vec = { X: int64; Y: int64 }

type Machine =
    { ButtonA: Vec
      ButtonB: Vec
      Target: Vec }

let parseMachine =
    String.concat ""
    >> Input.parseAllLongs
    >> List.chunkBySize 2
    >> List.map (fun r -> { X = r[0]; Y = r[1] })
    >> (fun r ->
        { ButtonA = r[0]
          ButtonB = r[1]
          Target = r[2] })

// a * ButtonA.X + b * ButtonB.X = Target.X
// a = (Target.X - b * ButtonB.X) / ButtonA.X

// a * ButtonA.Y + b * ButtonB.Y = Target.Y

// b = (Target.Y * ButtonA.X - Target.X * ButtonA.Y) / (ButtonB.Y * ButtonA.X - ButtonB.X * ButtonA.Y)

let getB m =
    let det = m.ButtonB.Y * m.ButtonA.X - m.ButtonB.X * m.ButtonA.Y

    if det = 0L then
        None
    else
        Some((m.Target.Y * m.ButtonA.X - m.Target.X * m.ButtonA.Y) / det)

let getA m b =
    (m.Target.X - b * m.ButtonB.X) / m.ButtonA.X

let checkWin m a b =
    a * m.ButtonA.X + b * m.ButtonB.X = m.Target.X
    && a * m.ButtonA.Y + b * m.ButtonB.Y = m.Target.Y

let tryGetWin machine =
    match getB machine with
    | Some b when b >= 0L ->
        let a = getA machine b

        // TODO: Remove checkWin
        if checkWin machine a b then Some(a, b) else None
    | _ -> None

let cost (a, b) = a * 3L + b

let extraPosition = 10000000000000L

let fixTarget m =
    { m with
        Target =
            { X = m.Target.X + extraPosition
              Y = m.Target.Y + extraPosition } }

DayUtils.runDay (fun input ->
    let machines = input |> Array.chunkBySize 4 |> Array.map parseMachine

    let result1 = machines |> Array.choose tryGetWin |> Array.sumBy cost

    let result2 =
        machines |> Array.map fixTarget |> Array.choose tryGetWin |> Array.sumBy cost

    result1, result2, 29023L, 96787395375634L)
