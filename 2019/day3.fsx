#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

type Wire = Line array

let getNext (from: Vec) (instruction: string) : Vec =
    let dir = Move.findDir instruction[0]
    let steps = int instruction[1..]

    Move.apply from { Dir = dir; Steps = steps }

let parseWire (input: string) =
    input.Split "," |> Array.scan getNext origin |> Array.pairwise

let getIntersections (wire1: Wire) (wire2: Wire) : Vec array =
    Array.collect (fun segment -> Array.choose (Line.getIntersection segment) wire2) wire1

let segmentsTo (target: Vec2.Vec) (wire: Wire) =
    let fullSteps = wire |> Array.takeWhile (Line.includesPoint target >> not)

    let (_, fullStepEnd) =
        Array.tryLast fullSteps |> Option.defaultValue (origin, origin)

    Array.append fullSteps [| (fullStepEnd, target) |]

let stepsTo (wires: Wire array) (target: Vec) =
    wires
    |> Array.collect (segmentsTo target)
    |> Array.map (fun (a, b) -> Vec.manhattan a b)
    |> Array.sum

let solve (input: string array) =
    let wires = Array.map parseWire input
    let intersections = getIntersections wires[0] wires[1]

    let result1 = intersections |> Array.map (Vec.manhattan origin) |> Array.min
    let result2 = intersections |> Array.map (stepsTo wires) |> Array.min

    result1, result2, 266, 19242

DayUtils.runDay solve
