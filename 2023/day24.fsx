#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

type Vec3 = { X: int64; Y: int64; Z: int64 }

module Vec3 =
    let create (s: string) =
        s.Split(",") |> Array.map int64 |> (fun v -> { X = v[0]; Y = v[1]; Z = v[2] })

type Hailstone =
    { Id: int; Start: Vec3; Velocity: Vec3 }

type Crossing =
    { Time1: float
      Time2: float
      X: float
      Y: float }

module Hailstone =
    let create index (s: string) =
        s.Split(" @ ")
        |> Array.map Vec3.create
        |> fun v ->
            { Id = index
              Start = v[0]
              Velocity = v[1] }

// x = s.Start.X + s.Velocity.X * time
// y = s.Start.Y + s.Velocity.Y * time
// => y = s.Start.Y + s.Velocity.Y * (x - s.Start.X) / s.Velocity.X
// => y = (s.Velocity.Y / s.Velocity.X) * x + (s.Start.X - s.Velocity.Y / s.Velocity.X * s.Start.X)
// => y = a * x + b
let getIntersectionFactors (s: Hailstone) =
    let a = float s.Velocity.Y / float s.Velocity.X
    let b = float s.Start.Y - a * float s.Start.X

    a, b

// y = a * x + b
// => a1 * x + b = a2 * x + b2
// => x = (b2 - b1) / (a1 - a2)
let findPlaneIntersection (s1: Hailstone) (s2: Hailstone) =
    let a1, b1 = getIntersectionFactors s1
    let a2, b2 = getIntersectionFactors s2

    let x = (b2 - b1) / (a1 - a2)
    let y = a1 * x + b1

    let t1 = (x - float (s1.Start.X)) / float (s1.Velocity.X)
    let t2 = (x - float (s2.Start.X)) / float (s2.Velocity.X)

    { Time1 = t1; Time2 = t2; X = x; Y = y }

let getCrossings (stones: Hailstone array) =
    stones
    |> Array.mapi (fun index a -> stones[index + 1 ..] |> Array.map (findPlaneIntersection a))
    |> Array.collect id

let TEST_AREA =
    {| Min = 200000000000000.0
       Max = 400000000000000.0 |}

let isInTestArea c =
    TEST_AREA.Min < c.X
    && TEST_AREA.Max > c.X
    && TEST_AREA.Min < c.Y
    && TEST_AREA.Max > c.Y
    && c.Time1 > 0
    && c.Time2 > 0

let solve (input: string array) =
    let stones = input |> Array.mapi Hailstone.create

    let result1 = stones |> getCrossings |> Array.filter isInTestArea |> Array.length
    let result2 = 0

    result1, result2, 19523, 0

DayUtils.runDay solve
