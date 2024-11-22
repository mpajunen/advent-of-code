#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"

type ItemType =
    | Generator
    | Microchip

type ItemPair = { Generator: int; Microchip: int }

type Item = string * ItemType
type FloorItem = int * Item

type State = { Elevator: int; Items: FloorItem[] }

let parseItemType =
    function
    | "generator" -> Generator
    | "microchip" -> Microchip
    | _ -> failwith "Unknown item type"

let parseItem index =
    function
    | Input.ParseRegex "(\w+)-?\w* (generator|microchip)" [ element; itemType ] ->
        Some(index + 1, (element, parseItemType itemType))
    | _ -> None

let parseFloor (index: int) (row: string) =
    row.Split " a " |> Array.choose (parseItem index)

let getItemPairs =
    Array.sortBy (fun (_, (_, itemType)) -> itemType) // Generator before Microchip
    >> Array.groupBy (fun (_, (element, _)) -> element)
    >> Array.map (fun (_, items) ->
        { Generator = fst items[0]
          Microchip = fst items[1] }) // Take floors only, ignore element
    >> Array.sort

let isValidFloor items =
    let generators, microchips =
        items
        |> Array.partition (fun (_, t) -> t = Generator)
        |> fun (g, m) -> g |> Array.map fst |> Set, m |> Array.map fst |> Set

    Set.isEmpty generators || Set.difference microchips generators |> Set.isEmpty

let itemsByFloor = Array.groupBy fst >> Array.map (snd >> Array.map snd)

let isValid = _.Items >> itemsByFloor >> Array.forall isValidFloor

let getFloorItems s =
    s.Items
    |> Array.choose (fun (floor, item) -> if floor = s.Elevator then Some item else None)

let getAllLoads (floor) =
    floor
    |> Seq.collect (fun i -> floor |> Seq.map (fun j -> Set [ i; j ]))
    |> Set
    |> List.ofSeq

let tryMove (s: State) (load, elevator) =
    let items =
        s.Items
        |> Array.map (fun (floor, item) -> (if Set.contains item load then elevator else floor), item)

    let newState = { Elevator = elevator; Items = items }

    if isValid newState then Some newState else None

let allPairs a b =
    a |> List.collect (fun x -> b |> List.map (fun y -> x, y))

let adjacentFloors s =
    [ s.Elevator + 1; s.Elevator - 1 ] |> List.filter (fun f -> f >= 1 && f <= 4)

let getAllMoves state =
    allPairs (state |> getFloorItems |> getAllLoads) (state |> adjacentFloors)

let getNextStates state =
    state |> getAllMoves |> List.choose (tryMove state)

let checksum state =
    state.Elevator, state.Items |> getItemPairs

let isFinished = _.Items >> Array.forall (fun (floor, _) -> floor = 4)

let findMinimumSteps floors =
    let mutable visited = Set.empty

    let findNextStates state =
        if Set.contains (checksum state) visited then
            []
        else
            visited <- Set.add (checksum state) visited

            state |> getNextStates

    let rec getSteps steps states =
        if states |> Seq.exists isFinished then
            steps
        else
            states |> List.collect findNextStates |> getSteps (steps + 1)

    getSteps 0 [ { Elevator = 1; Items = floors } ]

let extraParts =
    [| "elerium", Generator
       "elerium", Microchip
       "dilithium", Generator
       "dilithium", Microchip |]
    |> Array.map (fun part -> 1, part)

let solve (input: string array) =
    let items = input |> Array.mapi parseFloor |> Array.collect id

    let result1 = items |> findMinimumSteps
    let result2 = items |> Array.append extraParts |> findMinimumSteps

    result1, result2, 47, 71

DayUtils.runDay solve
