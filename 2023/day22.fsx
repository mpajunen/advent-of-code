#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

open System.Collections.Generic

type Vec3 = { X: int; Y: int; Z: int }

module Vec3 =
    let create (s: string) =
        s.Split(",") |> Array.map int |> (fun p -> { X = p[0]; Y = p[1]; Z = p[2] })

type Brick = { Id: int; Min: Vec3; Max: Vec3 }

module Brick =
    let create index (s: string) =
        s.Split("~")
        |> Array.map Vec3.create
        |> fun p -> { Id = index; Min = p[0]; Max = p[1] }

    let fallTo minZ brick =
        let maxZ = minZ + brick.Max.Z - brick.Min.Z

        { brick with
            Min = { brick.Min with Z = minZ }
            Max = { brick.Max with Z = maxZ } }

    let isBelow a b =
        a.Min.X <= b.Max.X
        && b.Min.X <= a.Max.X
        && a.Min.Y <= b.Max.Y
        && b.Min.Y <= a.Max.Y

let buildSupports bricks =
    let supportedBy = Dictionary()

    for index, brick in Array.indexed bricks do
        let possibleSupports = bricks[0 .. index - 1] |> Array.filter (Brick.isBelow brick)

        let maxZ =
            possibleSupports |> Array.map _.Max.Z |> Array.append [| 0 |] |> Array.max

        let supports =
            possibleSupports |> Array.filter (fun s -> s.Max.Z = maxZ) |> Array.map _.Id

        supportedBy[brick.Id] <- supports

        bricks[index] <- Brick.fallTo (maxZ + 1) brick

    supportedBy

let solve (input: string array) =
    let bricks = input |> Array.mapi Brick.create |> Array.sortBy _.Min.Z

    let supportedBy = bricks |> buildSupports

    let singleSupports =
        supportedBy.Values
        |> Seq.filter (fun v -> v.Length = 1)
        |> Seq.collect id
        |> Set

    let isSupporting stack brick =
        supportedBy[brick.Id].Length > 0
        && supportedBy[brick.Id] |> Array.forall (fun id -> List.contains id stack)

    let getSupportingCount id =
        let supporting =
            Array.fold (fun stack b -> if isSupporting stack b then b.Id :: stack else stack) [ id ] bricks

        supporting.Length - 1

    let result1 = bricks.Length - singleSupports.Count
    let result2 = singleSupports |> Set.toList |> List.sumBy getSupportingCount

    result1, result2, 434, 61209

DayUtils.runDay solve
