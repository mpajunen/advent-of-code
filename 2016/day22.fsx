#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"
#load "../fs-common/Vec2.fs"

open Vec2

type Node =
    { Position: Vec
      Size: int
      Used: int
      Available: int
      UsedRatio: int }

let rowPattern = "/dev/grid/node-x(\d+)-y(\d+) +(\d+)T +(\d+)T +(\d+)T +(\d+)%"

let parseNode =
    function
    | Input.ParseRegex rowPattern row ->
        { Position = { X = int row[0]; Y = int row[1] }
          Size = int row[2]
          Used = int row[3]
          Available = int row[4]
          UsedRatio = int row[5] }
    | s -> failwith $"Failed to parse row {s}"

let isViablePair a b =
    a.Used > 0 && a.Used <= b.Available && a.Position <> b.Position

let findViablePairs nodes =
    nodes
    |> Array.collect (fun a -> nodes |> Array.choose (fun b -> if isViablePair a b then Some(a, b) else None))

// Observations from data:
// - There's a wall of almost full large nodes, with a single gap
// - Data in any other node can be moved to a neighboring node, provided that node is empty
// - Data in any two of the other nodes can't be combined to fit in a single node
// - There's a single empty node

let findFewestSteps nodes =
    let empty = nodes |> Array.find (fun n -> n.Used = 0)

    let wall = nodes |> Array.find (fun n -> n.Size > 100)

    let gap =
        nodes |> Array.find (fun n -> n.Position.Y = wall.Position.Y && n.Size < 100)

    let maxX = nodes |> Array.maxBy (fun n -> n.Position.X)
    let goalDataStart = { X = maxX.Position.X; Y = 0 }

    manhattan empty.Position gap.Position // Move the empty node to the gap
    + manhattan gap.Position goalDataStart // Move the empty node to the wanted data node
    + 5 * (manhattan goalDataStart origin - 1) // Move goal data toward origin by cycling the empty node

let solve (input: string array) =
    let nodes = input[2..] |> Array.map parseNode

    let result1 = nodes |> findViablePairs |> Array.length
    let result2 = nodes |> findFewestSteps // 227 too high

    result1, result2, 910, 222

DayUtils.runDay solve
