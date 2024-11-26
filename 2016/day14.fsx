#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Hash.fs"
#load "../fs-common/Input.fs"

let hashMd5 salt index = Hash.md5 (salt + string index)

let hashStretch salt index =
    { 0..2016 } |> Seq.fold (fun acc _ -> Hash.md5 acc) (salt + string index)

let hexChars = "0123456789abcdef"

let tryFindMatch pattern =
    function
    | Input.ParseRegex pattern [ c ] -> Some(hexChars |> Seq.findIndex ((=) (char c)))
    | _ -> None

let findKey hash =
    let mutable keyCandidates = Array.init hexChars.Length (fun _ -> [||])
    let mutable keys = Set.empty
    let mutable index = -1

    let getResult () =
        if keys.Count >= 64 then
            keys |> Set.toArray |> Array.sort |> (fun a -> a[64 - 1])
        else
            999_999

    while getResult () > index - 1000 do
        index <- index + 1

        let hash = hash index

        match tryFindMatch "(.)\1{4}" hash with
        | Some n ->
            keys <-
                keyCandidates[n]
                |> Array.filter (fun k -> index - k <= 1000)
                |> Set
                |> Set.union keys
        | None -> ()

        match tryFindMatch "(.)\1{2}" hash with
        | Some n -> keyCandidates[n] <- Array.append keyCandidates[n] [| index |]
        | None -> ()

    getResult ()

let solve (input: string array) =
    let result1 = input[0] |> hashMd5 |> findKey
    let result2 = input[0] |> hashStretch |> findKey

    result1, result2, 16106, 22423

DayUtils.runDay solve
