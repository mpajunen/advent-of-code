#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"

let invertChar =
    function
    | '0' -> '1'
    | '1' -> '0'
    | _ -> failwith "Invalid character."

let invert = Seq.rev >> Seq.map (invertChar >> string) >> String.concat ""

let curve (s: string) = s + "0" + invert s

let rec curveFill n (s: string) =
    if s.Length >= n then s[.. n - 1] else curveFill n (curve s)

let rec reduce (s: string) =
    if s = "" then
        ""
    else
        (if s[0] = s[1] then "1" else "0") + reduce (s[2..])

let rec checksum (s: string) =
    let reduced = reduce s

    if reduced.Length % 2 = 1 then reduced else checksum reduced

let solve (input: string array) =
    let result1 = input[0] |> curveFill 272 |> checksum
    let result2 = 0

    result1, result2, "11111000111110000", 0

DayUtils.runDay solve
