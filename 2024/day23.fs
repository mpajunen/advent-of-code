module Year2024.Day23

let parseRow (row: string) =
    row.Split "-" |> Array.sort |> (fun c -> c[0], c[1])

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

let getRemaining (graph: Graph) =
    function
    | [] -> graph.Keys |> Seq.toList
    | latest :: _ -> graph[latest] |> Set.toList

let getOptions (graph: Graph) clique =
    let canAdd computer =
        clique |> List.forall (fun c -> graph[c].Contains computer)

    getRemaining graph clique
    |> List.filter canAdd
    |> List.map (fun computer -> computer :: clique)

let getTriplets (graph: Graph) =
    let rec find clique =
        if List.length clique = 3 then
            [ clique ]
        else
            getOptions graph clique |> List.collect find

    find []

let getLargest (graph: Graph) =
    let rec find clique =
        match getOptions graph clique with
        | [] -> clique
        | options -> options |> List.map find |> Seq.maxBy Seq.length

    find [] |> List.rev

let hasTStart = List.exists (fun (t: string) -> t.StartsWith "t")

let solve =
    DayUtils.solveDay (fun input ->
        let graph = input |> Array.map parseRow |> getGraph

        let result1 = graph |> getTriplets |> List.filter hasTStart |> List.length
        let result2 = graph |> getLargest |> String.concat ","

        result1, result2, 1175, "bw,dr,du,ha,mm,ov,pj,qh,tz,uv,vq,wq,xw")
