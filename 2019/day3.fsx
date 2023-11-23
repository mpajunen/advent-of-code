#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

type Wire = Vec2.Line array

let getNext (from: Vec2.Vec) (instruction: string) : Vec2.Vec =
    let dir = Vec2.Move.findDir instruction[0]
    let steps = int instruction[1..]

    Vec2.Move.apply from { Dir = dir; Steps = steps }

let parseWire (input: string) =
    input.Split ","
    |> Array.scan getNext Vec2.origin
    |> fun steps -> Array.zip steps[.. steps.Length - 2] steps[1..]

let getIntersections (wire1: Wire) (wire2: Wire) : Vec2.Vec array =
    Array.collect (fun segment -> Array.choose (Vec2.Line.getIntersection segment) wire2) wire1

let segmentsTo (target: Vec2.Vec) (wire: Wire) =
    let fullSteps = wire |> Array.takeWhile (Vec2.Line.includesPoint target >> not)

    let (_, fullStepEnd) =
        Array.tryLast fullSteps |> Option.defaultValue (Vec2.origin, Vec2.origin)

    Array.append fullSteps [| (fullStepEnd, target) |]

let stepsTo (wires: Wire array) (target: Vec2.Vec) =
    wires
    |> Array.collect (segmentsTo target)
    |> Array.map (fun (a, b) -> Vec2.manhattan a b)
    |> Array.sum

let solve (input: string array) =
    let wires = Array.map parseWire input
    let intersections = getIntersections wires[0] wires[1]

    let result1 = intersections |> Array.map (Vec2.manhattan Vec2.origin) |> Array.min
    let result2 = intersections |> Array.map (stepsTo wires) |> Array.min

    result1, result2

DayUtils.runDay solve
