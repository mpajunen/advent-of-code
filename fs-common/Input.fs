module Input

open System.Text.RegularExpressions

let parseAllX convert str =
    [ for m in Regex.Matches(str, "-?\d+") -> convert m.Value ]

let parseAllInts = parseAllX int

let parseAllLongs = parseAllX int64

let (|ParseRegex|_|) regex str =
    let m = Regex(regex).Match(str)

    if m.Success then
        Some(List.tail [ for x in m.Groups -> x.Value ])
    else
        None
