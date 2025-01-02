module Year2024.Day17

type Registers =
    { mutable A: int64
      mutable B: int64
      mutable C: int64 }

type State =
    { mutable Registers: Registers
      mutable Output: int list
      mutable Ip: int }

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

let execInstruction s =
    let reg = s.Registers

    s.Ip <- s.Ip + 2

    function
    | 0, n -> reg.A <- reg.A / (getDenominator reg n)
    | 1, n -> reg.B <- reg.B ^^^ n
    | 2, n -> reg.B <- (getComboVal reg n) % 8L
    | 3, n ->
        if reg.A <> 0 then
            s.Ip <- n
    | 4, _ -> reg.B <- reg.B ^^^ reg.C
    | 5, n -> s.Output <- s.Output @ [ int ((getComboVal reg n) % 8L) ]
    | 6, n -> reg.B <- reg.A / (getDenominator reg n)
    | 7, n -> reg.C <- reg.A / (getDenominator reg n)
    | instruction -> failwith $"Invalid instruction {instruction}."

let getInstruction (program: int list) s = program[s.Ip], program[s.Ip + 1]

let run program registers =
    let state =
        { Registers = registers
          Output = []
          Ip = 0 }

    while state.Ip < List.length program do
        state |> getInstruction program |> execInstruction state

    state.Output

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

let solve =
    DayUtils.solveDay (fun input ->
        let registers, program = input |> parseComputer

        let result1 = registers |> run program |> List.map string |> String.concat ","
        let result2 = findInitialValue program registers

        result1, result2, "6,5,4,7,1,6,0,3,1", 106086382266778L)
