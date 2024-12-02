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

let parseNode =
    Input.parseAllInts
    >> fun row ->
        { Position = { X = row[0]; Y = row[1] }
          Size = row[2]
          Used = row[3]
          Available = row[4]
          UsedRatio = row[5] }

let isViablePair a b =
    a.Used > 0 && a.Used <= b.Available && a.Position <> b.Position

let findViablePairs nodes =
    nodes
    |> Array.collect (fun a -> nodes |> Array.choose (fun b -> if isViablePair a b then Some(a, b) else None))

(*
The data looks like this:

X.....G
.......
.......
.######
.......
...._..
.......

Where:

  X is the node that can be accessed directly.
  G is the goal data.
  _ is an empty node: data from small nodes can be moved here, emptying that node in turn.
  . are small nodes: data can be moved to a neighboring node provided that node is empty.
  # are large nodes: data can't be moved. There's a single gap in the large node wall.
*)

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
