#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"
#load "./IntCode.fs"

open Vec2

type Action =
    | Forward
    | Left
    | Right

type Move = Action * int

let actionToString =
    function
    | Forward -> "F"
    | Left -> "L"
    | Right -> "R"

let moveToString (action, count) = $"{actionToString action},{count}"

let actionOptions = [ Forward; Left; Right ]

let parseAscii = Seq.map (int >> char >> string) >> String.concat ""

let marshalAscii =
    String.concat "\n" >> sprintf "%s\n" >> Seq.toArray >> Array.map int64

let isScaffolding grid position =
    Grid.isWithin grid position && Grid.get grid position = '#'

let findIntersections grid =
    let isIntersection (position, tile) =
        tile = '#' && Move.adjacent position |> List.forall (isScaffolding grid)

    grid |> Grid.entries |> Seq.filter isIntersection |> Seq.map fst

let applyTurn robot =
    function
    | Left -> robot |> Actor.turn Turn.Left
    | Right -> robot |> Actor.turn Turn.Right
    | Forward -> robot

let applyAction robot =
    function
    | Forward -> robot |> Actor.forward
    | action -> applyTurn robot action

let buildPath grid =
    let canMoveForward robot =
        robot |> Actor.forward |> (fun r -> r.Position |> isScaffolding grid)

    let canAct robot action =
        applyTurn robot action |> canMoveForward

    let findAction robot =
        actionOptions |> List.tryFind (canAct robot)

    let rec walkPath robot =
        match findAction robot with
        | None -> []
        | Some action -> action :: walkPath (applyAction robot action)

    walkPath
        { Position = Grid.findKey (fun t -> t = '^') grid
          Facing = Dir.Up }

let rec compactPath =
    function
    | [] -> []
    | turn :: rest ->
        let count = rest |> List.takeWhile (fun a -> a = Forward) |> List.length

        (turn, count) :: compactPath (List.skip count rest)

let tryFindSubsequenceIndex (subsequence: 'a list) (sequence: 'a list) =
    let rec tryFindSubsequenceIndex' index =
        if index + List.length subsequence > List.length sequence then
            None
        else if subsequence = sequence[index .. index + List.length subsequence - 1] then
            Some index
        else
            tryFindSubsequenceIndex' (index + 1)

    tryFindSubsequenceIndex' 0

let rec findRemainingSegments group segment =
    let index = tryFindSubsequenceIndex group segment

    match index, List.length segment with
    | None, 0 -> []
    | None, _ -> [ segment ]
    | Some 0, _ ->
        let after = List.skip (List.length group) segment

        findRemainingSegments group after
    | Some i, _ ->
        let before = List.take i segment
        let after = List.skip (i + List.length group) segment

        before :: findRemainingSegments group after

let findAllRemainingSegments group =
    List.collect (findRemainingSegments group)

let getPathGroups (fullPath: Move list) =
    let rec getGroups (segments: Move list list) (groups: Move list list) : Move list list option =
        match segments, List.length groups with
        | [], 3 -> Some groups
        | [], _ -> None
        | _, _ ->
            let segment = segments[0]

            let groupOptions =
                [ 1 .. List.length segment ] |> List.map (fun i -> List.take i segment)

            groupOptions
            |> List.tryPick (fun g -> getGroups (findAllRemainingSegments g segments) (g :: groups))

    getGroups [ fullPath ] [] |> Option.get

let rec buildSequenceOrder groups path =
    groups
    |> List.find (fun (_, moves) -> moves = List.take (List.length moves) path)
    |> fun (key, moves) ->
        match List.skip (List.length moves) path with
        | [] -> [ key ]
        | remaining -> key :: buildSequenceOrder groups remaining

let getGroupSequence cameraOutput =
    let path = cameraOutput |> buildPath |> compactPath

    let groups = getPathGroups path |> List.zip [ 'A' .. 'C' ]
    let sequence = buildSequenceOrder groups path

    groups, sequence

let getPathCommands cameraOutput =
    let groups, sequence = getGroupSequence cameraOutput

    let mainRoutine = sequence |> List.map string
    let functions = groups |> List.map (snd >> List.map moveToString)
    let videoFeed = [ "n" ]

    let all = [ mainRoutine ] @ functions @ [ videoFeed ]

    all |> List.map (String.concat ",") |> marshalAscii

let solve (input: string array) =
    let program = IntCode.parseProgram input[0]

    let cameraOutput = IntCode.run program [||] |> parseAscii |> Grid.fromString

    let modified = program |> Array.copy
    modified.[0] <- 2L

    let result1 = cameraOutput |> findIntersections |> Seq.sumBy (fun p -> p.X * p.Y)
    let result2 = cameraOutput |> getPathCommands |> IntCode.run modified |> Seq.last

    result1, result2, 6000, 807320L

DayUtils.runDay solve
