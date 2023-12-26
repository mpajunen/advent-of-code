#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

open System.Collections.Generic

type Edge = string * string
type Graph = Edge array * Dictionary<string, int>

let parseRow (s: string) =
    s.Split(": ")
    |> fun parts -> parts[1].Split(" ") |> Array.map (fun subPart -> parts[0], subPart)

let initialNodeCounts edges =
    let counts = Dictionary()

    for a, b in edges do
        counts[a] <- 1
        counts[b] <- 1

    counts

let random = System.Random()

let contract ((edges, nodeCounts): Graph): Graph =
    let index = random.Next(edges.Length - 1)
    let left, right = edges[index]

    nodeCounts[left] <- nodeCounts[left] + nodeCounts[right]
    nodeCounts.Remove(right) |> ignore

    let replace s = if s = right then left else s

    let newEdges =
        edges
        |> Array.removeAt index
        |> Array.map (fun (a, b) -> replace a, replace b)
        |> Array.filter (fun (a, b) -> a <> b)

    newEdges, nodeCounts

let kargerMinCut (initial: Edge array) =
    let rec cut (graph: Graph) =
        let (_, counts) = graph

        if counts.Count <= 2 then graph else contract graph |> cut

    let nodeCounts = initialNodeCounts initial

    cut (Array.copy initial, nodeCounts)

let repeatKarger (edges: Edge array) =
    seq { 0..1000 }
    |> Seq.map (fun _ -> kargerMinCut edges)
    |> Seq.find (fun (edges, _) -> edges.Length = 3)

let solve (input: string array) =
    let edges =
        input
        |> Array.collect parseRow
        |> Array.map (fun (a, b) -> if a > b then b, a else a, b)
        |> Array.sort

    let (minEdges, minCounts) = edges |> repeatKarger

    let result1 = minCounts[fst minEdges[0]] * minCounts[snd minEdges[0]]
    let result2 = 0

    result1, result2, 568214, 0

DayUtils.runDay solve
