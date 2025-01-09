#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

type Technique =
    | Cut of int64
    | Deal of int64
    | Reverse

let parseTechnique (row: string) : Technique =
    let parts = row.Split(' ')

    match parts[0], parts[1] with
    | "cut", _ -> Cut(int64 parts[1])
    | "deal", "into" -> Reverse
    | "deal", "with" -> Deal(int64 parts[3])
    | _ -> failwith "Unknown shuffle"

let modulo a b = (a % b + b) % b

let moduloMultiply (a: int64) (b: int64) (m: int64) =
    (bigint a * bigint b) % (bigint m) |> int64

type Operation =
    { Mul: int64
      Add: int64 }

    static member inline apply modBase n op = modulo (n * op.Mul + op.Add) modBase

    static member inline combine modBase a b =
        { Mul = moduloMultiply a.Mul b.Mul modBase
          Add = moduloMultiply a.Add b.Mul modBase + b.Add }

    static member inline combineMany modBase = List.reduce (Operation.combine modBase)

let techniqueToOp =
    function
    | Cut m -> { Mul = 1L; Add = -m }
    | Deal m -> { Mul = m; Add = 0L }
    | Reverse -> { Mul = -1L; Add = -1L }

let solve (input: string array) =
    let techniques = input |> Array.map parseTechnique |> Array.toList

    let op = techniques |> List.map techniqueToOp |> Operation.combineMany 10_007L
    let result1 = Operation.apply 10_007L 2019L op
    let result2 = 0

    result1, result2, 6978L, 0

DayUtils.runDay solve
