module Assembunny

type Instruction =
    | CopyValue of int * string
    | CopyRegister of string * string
    | Increment of string
    | Decrement of string
    | JumpValue of int * int
    | JumpRegister of string * int

let parseInstruction =
    function
    | Input.ParseRegex "cpy (\d+) (\w)" [ value; register ] -> CopyValue(int value, register)
    | Input.ParseRegex "cpy (\w) (\w)" [ from; register ] -> CopyRegister(from, register)
    | Input.ParseRegex "inc (\w)" [ register ] -> Increment(register)
    | Input.ParseRegex "dec (\w)" [ register ] -> Decrement(register)
    | Input.ParseRegex "jnz (\d+) (-?\d+)" [ value; offset ] -> JumpValue(int value, int offset)
    | Input.ParseRegex "jnz (\w) (-?\d+)" [ register; offset ] -> JumpRegister(register, int offset)
    | s -> failwith $"Unknown instruction {s}"

let execInstruction (registers, ip) instruction =
    match instruction with
    | CopyValue(value, register) -> registers |> Map.add register value, ip + 1
    | CopyRegister(from, register) -> registers |> Map.add register registers[from], ip + 1
    | Increment(register) -> registers |> Map.add register (registers[register] + 1), ip + 1
    | Decrement(register) -> registers |> Map.add register (registers[register] - 1), ip + 1
    | JumpValue(value, offset) -> registers, ip + (if value <> 0 then offset else 1)
    | JumpRegister(register, offset) -> registers, ip + (if registers[register] <> 0 then offset else 1)

let initialRegisters = [ 'a' .. 'd' ] |> List.map (fun c -> string c, 0) |> Map

let execute (instructions: Instruction[]) =
    let rec exec (instructions: Instruction[]) registers ip =
        if ip >= instructions.Length then
            registers
        else
            instructions[ip] |> execInstruction (registers, ip) ||> exec instructions

    exec instructions initialRegisters 0
