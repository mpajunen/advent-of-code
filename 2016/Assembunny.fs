module Assembunny

type Source =
    | Register of string
    | Value of int

type Instruction =
    | Copy of Source * Source
    | Increment of string
    | Decrement of string
    | JumpNonZero of Source * Source
    | Toggle of string
    | Output of string

type State =
    { Instructions: Instruction[]
      Replacements: Map<int, State -> State>
      Registers: Map<string, int>
      Ip: int
      Output: int option }

let parseSource =
    function
    | Input.ParseRegex "(-?\d+)" [ value ] -> Value(int value)
    | s -> Register(s)

let parseInstruction =
    function
    | Input.ParseRegex "cpy (-?\w+) (\w)" [ source; register ] -> Copy(parseSource source, Register(register))
    | Input.ParseRegex "inc (\w)" [ register ] -> Increment(register)
    | Input.ParseRegex "dec (\w)" [ register ] -> Decrement(register)
    | Input.ParseRegex "jnz (-?\w+) (-?\w+)" [ source; offset ] -> JumpNonZero(parseSource source, parseSource offset)
    | Input.ParseRegex "tgl (\w)" [ register ] -> Toggle(register) // Value not supported
    | Input.ParseRegex "out (\w)" [ register ] -> Output(register) // Value not supported
    | s -> failwith $"Unknown instruction {s}"

let getValue (registers: Map<string, int>) =
    function
    | Register(register) -> registers[register]
    | Value(value) -> value

let changeRegisters s =
    function
    | Copy(source, register) ->
        match register with
        | Register r -> getValue s.Registers source |> Map.add r
        | Value _ -> id
    | Increment r -> s.Registers[r] + 1 |> Map.add r
    | Decrement r -> s.Registers[r] - 1 |> Map.add r
    | _ -> id

let changeIp s =
    function
    | JumpNonZero(source, offset) ->
        if (getValue s.Registers source) <> 0 then
            (getValue s.Registers offset)
        else
            1
    | _ -> 1

let toggleInstruction =
    function
    | Copy(source, register) -> JumpNonZero(source, register)
    | Increment(register) -> Decrement(register)
    | Decrement(register) -> Increment(register)
    | JumpNonZero(source, offset) -> Copy(source, offset)
    | Toggle(offset) -> Increment(offset)
    | Output(register) -> Increment(register)

let changeInstructions state =
    function
    | Toggle(register) ->
        let index = state.Ip + state.Registers[register]

        Array.mapi (fun i -> if i = index then toggleInstruction else id)
    | _ -> id

let changeOutput s =
    function
    | Output(register) -> Some s.Registers[register]
    | _ -> None

let execInstruction s instruction =
    { s with
        Instructions = s.Instructions |> changeInstructions s instruction
        Registers = s.Registers |> changeRegisters s instruction
        Ip = s.Ip + changeIp s instruction
        Output = changeOutput s instruction }

let initialRegisters = [ 'a' .. 'd' ] |> List.map (fun c -> string c, 0) |> Map

let initialState replacements registers instructions =
    { Instructions = instructions
      Replacements = replacements
      Registers = registers
      Ip = 0
      Output = None }

let execStep state =
    if state.Replacements.ContainsKey state.Ip then
        state |> state.Replacements[state.Ip]
    else
        state.Instructions[state.Ip] |> execInstruction state

let rec exec state =
    if state.Ip >= state.Instructions.Length then
        state.Registers
    else
        state |> execStep |> exec

let rec execToOutput initial =
    let mutable state = initial

    seq {
        while true do
            state <- state |> execStep

            if state.Output.IsSome then
                yield state.Output.Value
    }

let execute = initialState Map.empty initialRegisters >> exec
