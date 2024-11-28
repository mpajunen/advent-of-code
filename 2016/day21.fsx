#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"

type Operation =
    | SwapPosition of int * int
    | SwapLetter of char * char
    | RotateLeft of int
    | RotateRight of int
    | RotateLetter of char
    | Reverse of int * int
    | Move of int * int

let parseOp =
    function
    | Input.ParseRegex "swap position (\d) with position (\d)" [ a; b ] -> SwapPosition(int a, int b)
    | Input.ParseRegex "swap letter (\w) with letter (\w)" [ a; b ] -> SwapLetter(char a, char b)
    | Input.ParseRegex "rotate left (\d) steps?" [ a ] -> RotateLeft(int a)
    | Input.ParseRegex "rotate right (\d) steps?" [ a ] -> RotateRight(int a)
    | Input.ParseRegex "rotate based on position of letter (\w)" [ a ] -> RotateLetter(char a)
    | Input.ParseRegex "reverse positions (\d) through (\d)" [ a; b ] -> Reverse(int a, int b)
    | Input.ParseRegex "move position (\d) to position (\d)" [ a; b ] -> Move(int a, int b)
    | s -> failwith $"Invalid input {s}."

let reverse = Seq.rev >> Seq.map string >> String.concat ""

let rec operate (s: string) =
    function
    | SwapPosition(a, b) -> SwapLetter(s[a], s[b]) |> operate s
    | SwapLetter(a, b) -> s.Replace(a, '_').Replace(b, a).Replace('_', b)
    | RotateLeft(a) -> s[a..] + s[0 .. a - 1]
    | RotateRight(a) -> RotateLeft(s.Length - a) |> operate s
    | RotateLetter(a) ->
        let index = s.IndexOf(a)
        let n = 1 + index + (if index >= 4 then 1 else 0)

        RotateRight(n % s.Length) |> operate s
    | Reverse(a, b) -> s[0 .. a - 1] + (reverse s[a..b]) + s[b + 1 ..]
    | Move(a, b) -> s[0 .. a - 1] + s[a + 1 ..] |> (fun x -> x[0 .. b - 1] + s[a..a] + x[b..])

let reverseOperation (s: string) =
    function
    | RotateLeft(a) -> RotateRight(a)
    | RotateRight(a) -> RotateLeft(a)
    | RotateLetter(a) ->
        let index = s.IndexOf(a)

        let n =
            if index = 0 then 1
            else if index % 2 = 0 then index / 2 + s.Length / 2 + 1
            else (index + 1) / 2

        RotateLeft(n % s.Length)
    | Move(a, b) -> Move(b, a)
    | op -> op

let rec reverseOperate (s: string) = reverseOperation s >> operate s

let solve (input: string array) =
    let operations = input |> Array.map parseOp

    let result1 = operations |> Array.fold operate "abcdefgh"
    let result2 = operations |> Array.rev |> Array.fold reverseOperate "fbgdceah"

    result1, result2, "bgfacdeh", "bdgheacf"

DayUtils.runDay solve
