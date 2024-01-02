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
    { Time1: int64
      Time2: int64
      X: int64
      Y: int64 }

module Hailstone =
    let create index (s: string) =
        s.Split(" @ ")
        |> Array.map Vec3.create
        |> fun v ->
            { Id = index
              Start = v[0]
              Velocity = v[1] }

// X = p.X + v.X * t
// Y = p.Y + v.Y * t
// => (p.X - X) / v.X = (p.Y - Y) / v.Y
// => (p.X - X) * v.Y = (p.Y - Y) * v.X
// => Y * v.X = X * v.Y + p.Y * v.X - p.X * v.Y

// => (X * v1.Y + p1.Y * v1.X - p1.X * v1.Y) * v2.X = (X * v2.Y + p1.Y * v2.X - p2.X * v2.Y) * v1.X
// = X * (v2.Y * v1.X - v1.Y * v2.X) = (p1.Y - p1.Y) * v1.X * v2.X - p1.X * v1.Y * v2.X + p2.X * v2.Y * v1.X
let getIntersectionX (s1: Hailstone) (s2: Hailstone) =
    let p1, v1 = s1.Start, s1.Velocity
    let p2, v2 = s2.Start, s2.Velocity

    let determinant = v2.Y * v1.X - v1.Y * v2.X

    if determinant = 0 then
        -1L // TODO: Maybe?
    else
        ((p1.Y - p2.Y) * v1.X * v2.X - p1.X * v1.Y * v2.X + p2.X * v2.Y * v1.X)
        / determinant

let getIntersection (s1: Hailstone) (s2: Hailstone) =
    let x = getIntersectionX s1 s2

    let time = (x - s1.Start.X) / s1.Velocity.X

    // r.Start = s.Start + (s.Velocity - r.Velocity) * t
    let y = s1.Start.Y + s1.Velocity.Y * time
    let z = s1.Start.Z + s1.Velocity.Z * time

    { X = x; Y = y; Z = z }

// x = s.Start.X + s.Velocity.X * time
// y = s.Start.Y + s.Velocity.Y * time
// => y = s.Start.Y + s.Velocity.Y * (x - s.Start.X) / s.Velocity.X
// => y = (s.Velocity.Y / s.Velocity.X) * x + (s.Start.X - s.Velocity.Y / s.Velocity.X * s.Start.X)
// => y = a * x + b

// => y * s.Velocity.X = s.Start.Y * s.Velocity.X + x * s.Velocity.Y - s.Start.X * s.Velocity.Y

let getIntersectionFactors (s: Hailstone) =
    let a = float s.Velocity.Y / float s.Velocity.X
    let b = float s.Start.Y - a * float s.Start.X

    a, b

// y = a * x + b
// => a1 * x + b = a2 * x + b2
// => x = (b2 - b1) / (a1 - a2)
let findPlaneIntersection (s1: Hailstone) (s2: Hailstone) =
    let x_ = getIntersectionX s1 s2

    let t1_ = (x_ - s1.Start.X) / s1.Velocity.X
    let t2_ = (x_ - s2.Start.X) / s2.Velocity.X

    let y_ = s1.Start.Y + s1.Velocity.Y * t1_

    let a1, b1 = getIntersectionFactors s1
    let a2, b2 = getIntersectionFactors s2

    let xf = (b2 - b1) / (a1 - a2)
    let x = xf |> int64
    let y = (a1 * xf + b1) |> int64

    let t1 = (x - s1.Start.X) / s1.Velocity.X
    let t2 = (x - s2.Start.X) / s2.Velocity.X

    // if (t1 <> t1_) then
    //     printfn "%A" (x, x_, t1, t1_, s1, s2)

    { Time1 = t1; Time2 = t2; X = x; Y = y }

let getCrossings (stones: Hailstone array) =
    stones
    |> Array.mapi (fun index a -> stones[index + 1 ..] |> Array.map (findPlaneIntersection a))
    |> Array.collect id

let TEST_AREA =
    {| Min = 200000000000000L
       Max = 400000000000000L |}

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

let getRelativeToRock s vRock =
    { s with
        Velocity = Vec3.subtract s.Velocity vRock }

// Moving relative to the rock, all hailstones will intersect at the rock starting position
let getRockStart (stones: Hailstone array) (vRock: Vec3) =
    getIntersection (getRelativeToRock stones[0] vRock) (getRelativeToRock stones[1] vRock)

let solve (input: string array) =
    let stones = input |> Array.mapi Hailstone.create

    let result1 = stones |> getCrossings |> Array.filter isInTestArea |> Array.length

    let result2 =
        stones |> getRockVelocity |> getRockStart stones |> (fun s -> s.X + s.Y + s.Z)

    result1, result2, 19523, 566373506408017L

DayUtils.runDay solve
