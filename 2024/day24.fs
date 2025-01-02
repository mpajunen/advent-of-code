module Year2024.Day24

type Operation =
    | And
    | Or
    | Xor

type Gate = { A: string; Op: Operation; B: string }

type Branch =
    | Op of Operation * Tree * Tree
    | Input

and Tree = string * Branch

let parseInitial =
    function
    | Input.ParseRegex "(\w+): (\d+)" [ name; value ] -> name, int value
    | s -> failwith $"Invalid initialization {s}"

let parseOperation =
    function
    | "AND" -> And
    | "OR" -> Or
    | "XOR" -> Xor
    | s -> failwith $"Invalid operation {s}"

let operate =
    function
    | And -> (&&&)
    | Or -> (|||)
    | Xor -> (^^^)

let parseGate =
    function
    | Input.ParseRegex "(\w+) (\w+) (\w+) -> (\w+)" [ a; op; b; out ] -> out, { A = a; Op = parseOperation op; B = b }
    | s -> failwith $"Invalid gate {s}"

let getOutGates =
    Map.keys >> Seq.filter (fun (k: string) -> k.StartsWith "z") >> Seq.toList

let toDecimal = List.mapi (fun i b -> (int64 b) <<< i) >> List.sum

let toBits (n: int64) =
    [ 0..44 ] |> List.map (fun i -> n >>> i &&& 1 |> int)

let getWire prefix n =
    if n >= 10 then $"{prefix}{n}" else $"{prefix}0{n}"

let toInputs x y =
    let xBits = x |> toBits |> List.mapi (fun i b -> getWire 'x' i, b)
    let yBits = y |> toBits |> List.mapi (fun i b -> getWire 'y' i, b)

    (xBits @ yBits) |> Map

let getTree (gates: Map<string, Gate>) =
    let rec getSubTree wire =
        if not <| gates.ContainsKey wire then
            wire, Input
        else
            wire, Op(gates[wire].Op, getSubTree gates[wire].A, getSubTree gates[wire].B)

    getSubTree

let getOutBit (inputs: Map<string, int>) gates =
    let rec getBit =
        function
        | wire, Input -> inputs[wire]
        | _, Op(op, a, b) -> operate op (getBit a) (getBit b)

    getTree gates >> getBit

let getOutDecimal initial gates =
    gates |> getOutGates |> List.map (getOutBit initial gates) |> toDecimal

let isValid gates bit =
    let n = 1L <<< bit
    let half = n >>> 1

    let check x y =
        getOutBit (toInputs x y) gates (getWire 'z' bit)

    check 0 0 = 0
    && check 0 n = 1
    && check n 0 = 1
    && check half half = 1
    && check n n = 0
    && check (n + half) half = 0
    && check half (n + half) = 0

let tryFindInvalidBit gates =
    [ 1..44 ] |> List.tryFind (not << isValid gates)

let rec getGateOutputs =
    function
    | wire, Op(_, a, b) -> Set.unionMany [ Set [ wire ]; getGateOutputs a; getGateOutputs b ]
    | _, Input -> Set.empty

let rec getMaxInputBit =
    function
    | _, Op(_, a, b) -> max (getMaxInputBit a) (getMaxInputBit b)
    | wire, Input -> wire[1..] |> int

let swap gates a b =
    gates |> Map.add a (gates[b]) |> Map.add b (gates[a])

let findBitFix (gates: Map<string, Gate>) invalidBit =
    let invalidTreeGates = getWire 'z' invalidBit |> getTree gates |> getGateOutputs
    let validTreeGates = getWire 'z' (invalidBit - 1) |> getTree gates |> getGateOutputs

    let invalidOptions = Set.difference invalidTreeGates validTreeGates

    let validOptions =
        gates.Keys
        |> Seq.filter (fun name ->
            name[0] <> 'z' // Not an output
            && not <| Set.contains name invalidTreeGates // Not already in the invalid tree
            && getMaxInputBit (getTree gates name) <= invalidBit // No higher bit inputs
        )

    let isNotInputOf valid invalid =
        getTree gates valid |> getGateOutputs |> Set.contains invalid |> not // Prevent cycles

    Seq.allPairs invalidOptions validOptions
    |> Seq.find (fun (invalid, valid) -> isNotInputOf valid invalid && isValid (swap gates invalid valid) invalidBit)

let rec findInvalidGates gates =
    match tryFindInvalidBit gates with
    | None -> []
    | Some invalidBit ->
        let a, b = invalidBit |> findBitFix gates

        [ a; b ] @ findInvalidGates (swap gates a b)

let solve =
    DayUtils.solveDay (fun input ->
        let splitAt = input |> Array.findIndex ((=) "")
        let initial = input[0 .. splitAt - 1] |> Array.map parseInitial |> Map
        let gates = input[splitAt + 1 ..] |> Array.map parseGate |> Map

        let result1 = getOutDecimal initial gates
        let result2 = findInvalidGates gates |> List.sort |> String.concat ","

        result1, result2, 55114892239566L, "cdj,dhm,gfm,mrb,qjd,z08,z16,z32")
