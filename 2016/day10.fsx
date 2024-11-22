#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"

type Target =
    | Bot of int
    | Output of int

type Transfer = { Bot: int; Low: Target; High: Target }

type Instruction =
    | Value of int * int
    | Transfer of Transfer

let parseTarget (s: string) =
    match s.Split " " |> Array.toList with
    | [ "bot"; n ] -> Bot(int n)
    | [ "output"; n ] -> Output(int n)
    | _ -> failwith $"Invalid target {s}"

let parseInstruction =
    function
    | Input.ParseRegex "value (\d+) goes to bot (\d+)" [ value; bot ] -> Value(int value, int bot)
    | Input.ParseRegex "bot (\d+) gives low to (.+) and high to (.+)" [ bot; low; high ] ->
        Transfer(
            { Bot = int bot
              Low = parseTarget low
              High = parseTarget high }
        )
    | s -> failwith $"Invalid instruction ${s}"

let initialize =
    Array.choose (function
        | Value(chip, bot) -> Some(chip, bot)
        | _ -> None)
    >> Array.groupBy snd
    >> Array.map (fun (bot, chips) -> Bot(bot), chips |> Array.map fst)
    >> Map

let getTransfers =
    Array.choose (function
        | Transfer t -> Some(t.Bot, t)
        | _ -> None)
    >> Map

let findDistributor = Map.tryFindKey (fun _ chips -> Array.length chips = 2)

let addChipTo receiver chip allChips =
    let chips = allChips |> Map.tryFind receiver |> Option.defaultValue [||]

    allChips |> Map.add receiver (Array.append chips [| chip |])

let processTransfer (transfer, low, high) =
    addChipTo transfer.Low low
    >> addChipTo transfer.High high
    >> Map.add (Bot(transfer.Bot)) [||]

let findNextTransfer (transfers: Map<int, Transfer>) allChips =
    match allChips |> findDistributor with
    | Some distributor ->
        match distributor, allChips[distributor] |> Array.sort with
        | Bot n, [| low; high |] -> Some(transfers[n], low, high)
        | _ -> None
    | None -> None

let rec findBot findTransfer chips =
    match chips |> findTransfer with
    | Some(transfer, 17, 61) -> transfer.Bot
    | Some t -> chips |> processTransfer t |> findBot findTransfer
    | _ -> failwith "Invalid transfer"

let rec distributeAll findTransfer chips =
    match chips |> findTransfer with
    | Some t -> chips |> processTransfer t |> distributeAll findTransfer
    | None -> chips

let outProduct (allChips: Map<Target, int[]>) =
    [ 0..2 ] |> List.map (fun i -> allChips[Output(i)] |> Array.head) |> List.sum

let solve (input: string array) =
    let instructions = input |> Array.map parseInstruction

    let startChips = instructions |> initialize
    let findTransfer = instructions |> getTransfers |> findNextTransfer

    let result1 = startChips |> findBot findTransfer
    let result2 = startChips |> distributeAll findTransfer |> outProduct

    result1, result2, 157, 1085

DayUtils.runDay solve
