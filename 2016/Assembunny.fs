module Assembunny

type Source =
    | Register of string
    | Value of int

type Instruction =
    | Copy of Source * string
    | Increment of string
    | Decrement of string
    | JumpNonZero of Source * int

type State =
    { Instructions: Instruction[]
      Registers: Map<string, int>
      Ip: int }

let parseSource =
    function
    | Input.ParseRegex "(\d+)" [ value ] -> Value(int value)
    | s -> Register(s)

let parseInstruction =
    function
    | Input.ParseRegex "cpy (\w+) (\w)" [ source; register ] -> Copy(parseSource source, register)
    | Input.ParseRegex "inc (\w)" [ register ] -> Increment(register)
    | Input.ParseRegex "dec (\w)" [ register ] -> Decrement(register)
    | Input.ParseRegex "jnz (\w+) (-?\d+)" [ source; offset ] -> JumpNonZero(parseSource source, int offset)
    | s -> failwith $"Unknown instruction {s}"

let getValue (registers: Map<string, int>) =
    function
    | Register(register) -> registers[register]
    | Value(value) -> value

let changeRegisters s =
    function
    | Copy(source, r) -> getValue s.Registers source |> Map.add r
    | Increment r -> s.Registers[r] + 1 |> Map.add r
    | Decrement r -> s.Registers[r] - 1 |> Map.add r
    | _ -> id

let changeIp s =
    function
    | JumpNonZero(source, offset) -> if (getValue s.Registers source) <> 0 then offset else 1
    | _ -> 1

let execInstruction s instruction =
    { s with
        Registers = s.Registers |> changeRegisters s instruction
        Ip = s.Ip + changeIp s instruction }

let initialRegisters = [ 'a' .. 'd' ] |> List.map (fun c -> string c, 0) |> Map

let initialState registers instructions =
    { Instructions = instructions
      Registers = registers
      Ip = 0 }

let rec exec state =
    if state.Ip >= state.Instructions.Length then
        state.Registers
    else
        state.Instructions[state.Ip] |> execInstruction state |> exec

let execute = initialState initialRegisters >> exec
