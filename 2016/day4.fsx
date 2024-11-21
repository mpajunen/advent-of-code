#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"

type Room =
    { Name: string
      SectorId: int
      Checksum: string }

let parseRoom =
    function
    | Input.ParseRegex "([\w\-]+)\-(\d+)\[(\w+)\]" [ name; sectorId; checksum ] ->
        { Name = name
          SectorId = int sectorId
          Checksum = checksum }
    | row -> failwith $"Unable to parse room ${row}"

let letterCounts =
    Seq.filter ((<>) '-')
    >> Seq.countBy id
    >> Seq.sortBy (fun (c, count) -> (-count, c))

let isReal room =
    room.Name
    |> letterCounts
    |> Seq.take 5
    |> Seq.map (fst >> string)
    |> String.concat ""
    |> (=) room.Checksum

let letterBase = int 'a'
let letterCount = int 'z' - int 'a' + 1

let rotateLetter rotation c =
    (int c - letterBase + rotation) % letterCount + letterBase |> char

let decryptName room =
    let shiftChar =
        function
        | '-' -> ' '
        | c -> rotateLetter room.SectorId c

    room.Name |> String.map shiftChar

let solve (input: string array) =
    let rooms = input |> Array.map parseRoom

    let result1 = rooms |> Array.filter isReal |> Array.sumBy _.SectorId

    let result2 =
        rooms |> Array.find (decryptName >> fun s -> s.StartsWith "north") |> _.SectorId

    result1, result2, 245102, 324

DayUtils.runDay solve
