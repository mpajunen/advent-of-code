module Input

open System.Text.RegularExpressions

let parseAllInts str =
    [ for m in Regex.Matches(str, "-?\d+") -> int m.Value ]

let (|ParseRegex|_|) regex str =
    let m = Regex(regex).Match(str)

    if m.Success then
        Some(List.tail [ for x in m.Groups -> x.Value ])
    else
        None
