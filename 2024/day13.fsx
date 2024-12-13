#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"
#load "../fs-common/Vec2.fs"

type Vec = Vec2.Vec64

type Machine =
    { ButtonA: Vec
      ButtonB: Vec
      Target: Vec }

let parseMachine =
    String.concat ""
    >> Input.parseAllLongs
    >> List.chunkBySize 2
    >> List.map (fun r -> { Vec.X = r[0]; Vec.Y = r[1] })
    >> (fun r ->
        { ButtonA = r[0]
          ButtonB = r[1]
          Target = r[2] })

// a * ButtonA.X + b * ButtonB.X = Target.X
// a = (Target.X - b * ButtonB.X) / ButtonA.X

// a * ButtonA.Y + b * ButtonB.Y = Target.Y

// b = (Target.Y * ButtonA.X - Target.X * ButtonA.Y) / (ButtonB.Y * ButtonA.X - ButtonB.X * ButtonA.Y)

let getB m =
    let left = Vec.determinant m.ButtonA m.Target
    let det = Vec.determinant m.ButtonA m.ButtonB

    if left % det <> 0L then None else Some(left / det)

let getA m b =
    (m.Target.X - b * m.ButtonB.X) / m.ButtonA.X

let tryGetWin machine =
    match getB machine with
    | Some b when b >= 0L -> Some(getA machine b, b)
    | _ -> None

let cost (a, b) = a * 3L + b

let extraDistance =
    { Vec.X = 10000000000000L
      Vec.Y = 10000000000000L }

let fixTarget m =
    { m with
        Target = m.Target + extraDistance }

DayUtils.runDay (fun input ->
    let machines = input |> Array.chunkBySize 4 |> Array.map parseMachine

    let result1 = machines |> Array.choose tryGetWin |> Array.sumBy cost

    let result2 =
        machines |> Array.map fixTarget |> Array.choose tryGetWin |> Array.sumBy cost

    result1, result2, 29023L, 96787395375634L)
