#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

type DigitTexts = (int * string) seq

let digitNames =
    [ "zero" // Not used, but provides correct indices
      "one"
      "two"
      "three"
      "four"
      "five"
      "six"
      "seven"
      "eight"
      "nine" ]

let directDigits = { 0..9 } |> Seq.map string |> Seq.indexed

let namedDigits = digitNames |> Seq.indexed

let allDigits = Seq.concat [ directDigits; namedDigits ]

let findDigit (texts: DigitTexts) (row: string) (start: int) =
    Seq.tryFind (fun (_, digit) -> row[start..][.. String.length digit - 1] = digit) texts

let findDigits (texts: DigitTexts) (row: string) =
    { 0 .. row.Length } |> Seq.choose (findDigit texts row) |> Seq.map fst

let calibration digits = 10 * Seq.head digits + Seq.last digits

let solve (input: string array) =
    let result1 = input |> Array.sumBy (findDigits directDigits >> calibration)
    let result2 = input |> Array.sumBy (findDigits allDigits >> calibration)

    result1, result2, 55208, 54578

DayUtils.runDay solve
