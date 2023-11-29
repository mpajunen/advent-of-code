module IntCode

type Mode =
    | Immediate
    | Position
    | Relative

type Program = int64 array

let private getMode (flag: int) =
    match flag with
    | 0 -> Position
    | 1 -> Immediate
    | 2 -> Relative
    | _ -> failwith <| sprintf $"Invalid mode flag {flag}."

let private getDigit num index =
    num % (pown 10 (index + 1)) / (pown 10 index)

let private getModes (instruction: int) =
    [| 2; 3; 4 |] |> Array.map (getDigit instruction >> getMode)

type Computer(program: Program) =
    member val state = Array.indexed program |> Array.map (fun (k, v) -> int64 k, v) |> Map with get, set
    member val ip = 0L with get, set
    member val relativeBase = 0L with get, set

    member val input: int64 array = [||] with get, set
    member val output: int64 array = [||] with get, set

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

        this.ip <- this.ip + 1L

        value

    member this.readParam(mode: Mode) =
        match mode with
        | Immediate -> this.read ()
        | Position -> this.read () |> this.readMemory
        | Relative -> this.read () + this.relativeBase |> this.readMemory

    member this.readParams(modes: Mode array) =
        (this.readParam modes[0], this.readParam modes[1])

    member this.readInstruction() =
        let value = this.read () |> int
        let opCode = value % 100

        let paramModes = getModes value

        opCode, paramModes

    member this.write (mode: Mode) value =
        let target =
            match mode with
            | Immediate -> failwith <| sprintf "Can't write in immediate mode."
            | Position -> this.read ()
            | Relative -> this.read () + this.relativeBase

        this.state <- Map.add target value this.state

    member this.execute() =
        let (instruction, modes) = this.readInstruction ()

        match instruction with
        | 1 -> this.readParams modes |> fun (a, b) -> a + b |> this.write modes[2]
        | 2 -> this.readParams modes |> fun (a, b) -> a * b |> this.write modes[2]
        | 3 -> this.readInput () |> this.write modes[0]
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
        | 7 ->
            this.readParams modes
            |> fun (a, b) -> (if a < b then 1L else 0L) |> this.write modes[2]
        | 8 ->
            this.readParams modes
            |> fun (a, b) -> (if a = b then 1L else 0L) |> this.write modes[2]
        | 9 -> this.readParam modes[0] |> fun v -> this.relativeBase <- this.relativeBase + v
        | _ -> failwith <| sprintf $"Invalid instruction {instruction}."

    member this.canRun() =
        match int this.state[this.ip] with
        | 3 -> Array.length this.input > 0
        | 99 -> false
        | _ -> true

    member this.isHalted = this.state[this.ip] = 99

    member this.run(input: int64 array) =
        this.input <- input

        while this.canRun () do
            this.execute ()

        this.output

let parseProgram (input: string) = input.Split "," |> Array.map int64

let run program input =
    Computer program |> fun c -> c.run input
