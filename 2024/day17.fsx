#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Input.fs"

type Registers = { A: int64; B: int64; C: int64 }

type State =
    { Registers: Registers
      Output: int list
      Ip: int }

let parseComputer input =
    let rows = input |> Array.map Input.parseAllInts

    let registers =
        { A = rows[0][0]
          B = rows[1][0]
          C = rows[2][0] }

    registers, rows[4]

let getComboVal reg =
    function
    | 4 -> reg.A
    | 5 -> reg.B
    | 6 -> reg.C
    | x -> int64 x

let getDenominator reg n = getComboVal reg n |> int |> pown 2L

let changeRegisters reg =
    function
    | 0, n ->
        { reg with
            A = reg.A / (getDenominator reg n) }
    | 1, n -> { reg with B = reg.B ^^^ n }
    | 2, n ->
        { reg with
            B = (getComboVal reg n) % 8L }
    | 3, _ -> reg
    | 4, _ -> { reg with B = reg.B ^^^ reg.C }
    | 5, _ -> reg
    | 6, n ->
        { reg with
            B = reg.A / (getDenominator reg n) }
    | 7, n ->
        { reg with
            C = reg.A / (getDenominator reg n) }
    | instruction -> failwith $"Invalid instruction {instruction}."

let changeIp reg ip =
    function
    | 3, n when reg.A <> 0 -> n
    | _ -> ip + 2

let changeOutput reg output =
    function
    | 5, n -> output @ [ int ((getComboVal reg n) % 8L) ]
    | _ -> output

let execInstruction (program: int list) s =
    let instruction = program[s.Ip], program[s.Ip + 1]

    { Registers = changeRegisters s.Registers instruction
      Output = changeOutput s.Registers s.Output instruction
      Ip = changeIp s.Registers s.Ip instruction }

let rec exec program =
    function
    | state when state.Ip >= List.length program -> state.Output
    | state -> state |> execInstruction program |> exec program

let init registers =
    { Registers = registers
      Output = []
      Ip = 0 }

let run program = init >> exec program

let getA = List.rev >> List.mapi (fun i x -> int64 x * pown 8L i) >> List.sum

// Looking at the output, we can note:
// - The output has one digit per digit of the number in register A in base 8.
// - The first n digits of this number determine the nth last digit of the output.
let findInitialValue program registers =
    let producesMatchingEnd digits =
        let output = { registers with A = getA digits } |> run program

        output = program[(program.Length - output.Length) ..]

    let rec findDigits digits =
        if List.length digits = List.length program then
            [ digits ]
        else
            [ 0..7 ]
            |> List.map (fun x -> digits @ [ x ])
            |> List.filter producesMatchingEnd
            |> List.collect findDigits

    findDigits [] |> List.head |> getA

DayUtils.runDay (fun input ->
    let registers, program = input |> parseComputer

    let result1 = registers |> run program |> List.map string |> String.concat ","
    let result2 = findInitialValue program registers

    result1, result2, "6,5,4,7,1,6,0,3,1", 106086382266778L)
