#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let parseRow (row: string) =
    row.Split "-" |> fun c -> if c[0] < c[1] then c[0], c[1] else c[1], c[0]

type Graph = Map<string, Set<string>>

let getComputers =
    Array.collect (fun (a, b) -> [| a; b |]) >> Array.distinct >> Array.sort

// Only keep connections a -> b, where a < b
let getGraph connections =
    let grouped =
        connections
        |> Array.groupBy fst
        |> Array.map (fun (k, v) -> k, v |> Array.map snd |> Set)
        |> Map

    connections
    |> getComputers
    |> Array.map (fun c -> c, if grouped.ContainsKey c then grouped[c] else Set.empty)
    |> Map

let getOptions (graph: Graph) (clique, remaining) =
    let canAdd computer =
        clique |> List.forall (fun c -> graph[c].Contains computer)

    let options = remaining |> List.filter canAdd

    options |> List.mapi (fun i computer -> computer :: clique, options[i + 1 ..])

let getTriplets (graph: Graph) =
    let rec find (clique, remaining) =
        if List.length clique = 3 then
            [ clique ]
        else
            getOptions graph (clique, remaining) |> List.collect find

    find ([], graph.Keys |> Seq.toList)

let getLargest (graph: Graph) =
    let rec find (clique, remaining) =
        match getOptions graph (clique, remaining) with
        | [] -> clique
        | options -> options |> List.map find |> Seq.maxBy Seq.length

    find ([], graph.Keys |> Seq.toList) |> List.rev

let hasTStart = List.exists (fun (t: string) -> t.StartsWith "t")

DayUtils.runDay (fun input ->
    let graph = input |> Array.map parseRow |> getGraph

    let result1 = graph |> getTriplets |> List.filter hasTStart |> List.length
    let result2 = graph |> getLargest |> String.concat ","

    result1, result2, 1175, "bw,dr,du,ha,mm,ov,pj,qh,tz,uv,vq,wq,xw")
