module IntCode

type Mode =
    | Immediate
    | Position

type Program = int array

let private getMode (flag: int) =
    match flag with
    | 0 -> Position
    | 1 -> Immediate
    | _ -> failwith <| sprintf $"Invalid mode flag {flag}."

let private getDigit num index =
    num % (pown 10 (index + 1)) / (pown 10 index)

let private getModes (instruction: int) =
    [| 2; 3; 4 |] |> Array.map (getDigit instruction >> getMode)

type Computer(program: Program) =
    member val state = Array.indexed program |> Map with get, set
    member val ip = 0 with get, set

    member val input: int array = [||] with get, set
    member val output: int array = [||] with get, set

    member this.readInput() =
        let value = this.input[0]

        this.input <- this.input[1..]

        value

    member this.writeOutput value =
        this.output <- Array.append this.output [| value |]

    member this.readMemory key =
        Map.tryFind key this.state |> Option.defaultValue 0

    member this.read() =
        let value = this.readMemory this.ip

        this.ip <- this.ip + 1

        value

    member this.readParam(mode: Mode) =
        match mode with
        | Immediate -> this.read ()
        | Position -> this.read () |> this.readMemory

    member this.readParams(modes: Mode array) =
        (this.readParam modes[0], this.readParam modes[1])

    member this.readInstruction() =
        let value = this.read ()
        let opCode = value % 100

        let paramModes = getModes value

        opCode, paramModes

    member this.write value =
        let target = this.read ()

        this.state <- Map.add target value this.state

    member this.execute() =
        let (instruction, modes) = this.readInstruction ()

        match instruction with
        | 1 -> this.readParams modes |> fun (a, b) -> a + b |> this.write
        | 2 -> this.readParams modes |> fun (a, b) -> a * b |> this.write
        | 3 -> this.readInput () |> this.write
        | 4 -> this.readParam modes[0] |> this.writeOutput
        | 5 ->
            this.readParams modes
            |> fun (a, b) ->
                if a <> 0 then
                    this.ip <- b
        | 6 ->
            this.readParams modes
            |> fun (a, b) ->
                if a = 0 then
                    this.ip <- b
        | 7 -> this.readParams modes |> fun (a, b) -> (if a < b then 1 else 0) |> this.write
        | 8 -> this.readParams modes |> fun (a, b) -> (if a = b then 1 else 0) |> this.write
        | _ -> failwith <| sprintf $"Invalid instruction {instruction}."

    member this.canRun() =
        match this.state[this.ip] with
        | 3 -> Array.length this.input > 0
        | 99 -> false
        | _ -> true

    member this.isHalted = this.state[this.ip] = 99

    member this.run(input: int array) =
        this.input <- input

        while this.canRun () do
            this.execute ()

        this.output

let parseProgram (input: string) = input.Split "," |> Array.map int

let run program input =
    Computer program |> fun c -> c.run input