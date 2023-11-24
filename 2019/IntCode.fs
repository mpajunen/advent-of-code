module IntCode

type Mode =
    | Immediate
    | Position

let private getMode (flag: int) =
    match flag with
    | 0 -> Position
    | 1 -> Immediate
    | _ -> failwith <| sprintf $"Invalid mode flag {flag}."

let private getDigit num index =
    num % (pown 10 (index + 1)) / (pown 10 index)

let private getModes (instruction: int) =
    [| 2; 3; 4 |] |> Array.map (getDigit instruction >> getMode)

type Computer(program: int array) =
    member val state = Array.copy program
    member val ip = 0 with get, set

    member val input: int array = [||] with get, set
    member val output: int array = [||] with get, set

    member this.readInput() =
        let value = this.input[0]

        this.input <- this.input[1..]

        value

    member this.writeOutput value =
        this.output <- Array.append this.output [| value |]

    member this.read() =
        let value = this.state[this.ip]

        this.ip <- this.ip + 1

        value

    member this.readParam(mode: Mode) =
        match mode with
        | Immediate -> this.read ()
        | Position -> this.state[this.read ()]

    member this.readParams(modes: Mode array) =
        (this.readParam modes[0], this.readParam modes[1])

    member this.readInstruction() =
        let value = this.read ()
        let opCode = value % 100

        let paramModes = getModes value

        opCode, paramModes

    member this.write value =
        let target = this.read ()

        this.state[target] <- value

    member this.execute() =
        let (instruction, modes) = this.readInstruction ()

        match instruction with
        | 1 -> this.readParams modes |> fun (a, b) -> a + b |> this.write
        | 2 -> this.readParams modes |> fun (a, b) -> a * b |> this.write
        | 3 -> this.readInput () |> this.write
        | 4 -> this.readParam modes[0] |> this.writeOutput
        | _ -> failwith <| sprintf $"Invalid instruction {instruction}."

    member this.run(input: int array) =
        this.input <- input

        while this.state[this.ip] <> 99 do
            this.execute ()

        this.output

let run program input =
    Computer program |> fun c -> c.run input
