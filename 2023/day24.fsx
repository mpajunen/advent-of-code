#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

type Vec3 = { X: int64; Y: int64; Z: int64 }

module Vec3 =
    let create (s: string) =
        s.Split(",") |> Array.map int64 |> (fun v -> { X = v[0]; Y = v[1]; Z = v[2] })

    let subtract a b =
        { X = a.X - b.X
          Y = a.Y - b.Y
          Z = a.Z - b.Z }

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

let rec gcd a b = if b = 0L then a else gcd b (a % b)

let getAllDivisors (numbers: int64 array) =
    let highest = numbers |> Array.reduce gcd

    [ 1L .. highest ]
    |> List.filter (fun divisor -> numbers |> Array.forall (fun n -> n % divisor = 0))

let getSpeedGroups accessor (stones: Hailstone array) =
    stones
    |> Array.groupBy (_.Velocity >> accessor)
    |> Array.map snd
    |> Array.filter (fun stones -> stones.Length > 2)

// If a group of hailstones has the same velocity along any axis, the distances between the hailstones
// must be divisible by the velocity difference between the launched rock and the hailstones.
let getGroupAllowedVelocities accessor (stones: Hailstone array) =
    let starts = stones |> Array.map (_.Start >> accessor)
    let velocity = stones[0].Velocity |> accessor

    let deltas = starts |> Array.map (fun s -> s - Array.min starts)
    let divisors = deltas |> Array.filter ((<>) 0L) |> getAllDivisors

    divisors |> List.collect (fun n -> [ n; -n ]) |> List.map ((+) velocity) |> Set

let getAxisVelocity (stones: Hailstone array) accessor =
    stones
    |> getSpeedGroups accessor
    |> Array.map (getGroupAllowedVelocities accessor)
    |> Set.intersectMany
    |> Set.minElement // Assumes only one velocity is found

let getRockVelocity (stones: Hailstone array) =
    { X = getAxisVelocity stones _.X
      Y = getAxisVelocity stones _.Y
      Z = getAxisVelocity stones _.Z }

// r.Start + r.Velocity * t = s1.Start + s.Velocity * t
// t = (r.Start - s.Start) / (s.Velocity - r.Velocity)
// t = (r.Start - s.Start) / Δv

// => (r.Velocity - s.Velocity) * t = s1.Start - r.Start
// => Δv * t = s1.Start - r.Start

// => (s.Start.X - r.Start.X) / Δv.X = (s.Start.Y - r.Start.Y) / Δv.Y
// => (s.Start.X - r.Start.X) * Δv.Y = (s.Start.Y - r.Start.Y) * Δv.X

// => r.Start.Y * Δv.X = r.Start.X * Δv.Y + s.Start.Y * Δv.X - s.Start.X * Δv.Y

// => (r.Start.X * Δv1.Y + s1.Start.Y * Δv1.X - s1.Start.X * Δv1.Y) * Δv2.X = (r.Start.X * Δv2.Y + s1.Start.Y * Δv2.X - s2.Start.X * Δv2.Y) * Δv1.X
// = r.Start.X * (Δv2.Y * Δv1.X - Δv1.Y * Δv2.X) = (s1.Start.Y - s1.Start.Y) * Δv1.X * Δv2.X - s1.Start.X * Δv1.Y * Δv2.X + s2.Start.X * Δv2.Y * Δv1.X
let getStartX (s1: Hailstone) (s2: Hailstone) (vRock: Vec3) =
    let Δv1 = Vec3.subtract vRock s1.Velocity
    let Δv2 = Vec3.subtract vRock s2.Velocity

    ((s1.Start.Y - s2.Start.Y) * Δv1.X * Δv2.X - s1.Start.X * Δv1.Y * Δv2.X
     + s2.Start.X * Δv2.Y * Δv1.X)
    / (Δv2.Y * Δv1.X - Δv1.Y * Δv2.X)

let getRockStart (stones: Hailstone array) (vRock: Vec3) =
    let startX = getStartX stones[0] stones[1] vRock

    let s = stones[0]

    // time = (r.Start - s.Start) / (s.Velocity - r.Velocity)
    let time = (startX - s.Start.X) / (s.Velocity.X - vRock.X)

    // r.Start = s.Start + (s.Velocity - r.Velocity) * t
    let startY = s.Start.Y + (s.Velocity.Y - vRock.Y) * time
    let startZ = s.Start.Z + (s.Velocity.Z - vRock.Z) * time

    { X = startX; Y = startY; Z = startZ }

let solve (input: string array) =
    let stones = input |> Array.mapi Hailstone.create

    let result1 = stones |> getCrossings |> Array.filter isInTestArea |> Array.length

    let result2 =
        stones |> getRockVelocity |> getRockStart stones |> (fun s -> s.X + s.Y + s.Z)

    result1, result2, 19523, 566373506408017L

DayUtils.runDay solve
