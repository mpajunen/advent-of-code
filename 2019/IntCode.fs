module IntCode

type Computer(program: int array) =
    member val state = Array.copy program
    member val ip = 0 with get, set

    member this.read() =
        let value = this.state[this.ip]

        this.ip <- this.ip + 1

        value

    member this.readParam() = this.state[this.read ()]

    member this.readParams() = (this.readParam (), this.readParam ())

    member this.write value =
        let target = this.read ()

        this.state[target] <- value

    member this.execute() =
        let instruction = this.read ()

        match instruction with
        | 1 -> this.readParams () |> fun (a, b) -> a + b |> this.write
        | 2 -> this.readParams () |> fun (a, b) -> a * b |> this.write
        | _ -> failwith <| sprintf $"Invalid instruction {instruction}."

    member this.run() =
        while this.state[this.ip] <> 99 do
            this.execute ()
