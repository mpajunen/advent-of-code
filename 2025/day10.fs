module Year2025.Day10

let parseIndicator =
    function
    | '#' -> Some true
    | '.' -> Some false
    | _ -> None

type Machine =
    { Indicators: bool array
      Buttons: int list list
      Joltage: int list }

let parseRow (row: string) =
    let groups = row.Split ' '

    { Indicators = groups[0] |> Seq.choose parseIndicator |> Seq.toArray
      Buttons = groups[1 .. groups.Length - 2] |> Array.map Input.parseAllInts |> Array.toList
      Joltage = groups[groups.Length - 1] |> Input.parseAllInts }

let getToggled machine =
    List.collect (fun i -> machine.Buttons[i])
    >> List.countBy id
    >> List.filter (fun (_, c) -> c % 2 = 1)
    >> List.map fst

let getCombinations machine count =
    let rec combinations start =
        function
        | 0 -> [ [] ]
        | countLeft ->
            [ for i in start .. machine.Buttons.Length - countLeft do
                  for tail in combinations (i + 1) (countLeft - 1) do
                      yield i :: tail ]

    combinations 0 count

let getIndicatorMinPresses (machine: Machine) =
    let isMatch presses =
        let toggled = getToggled machine presses

        machine.Indicators
        |> Array.indexed
        |> Array.forall (fun (i, state) -> List.contains i toggled = state)

    let rec getMin n =
        if getCombinations machine n |> List.exists isMatch then
            n
        else
            getMin (n + 1)

    getMin 1

type Equation = Map<char, int>

let getTermChar index = char (int 'A' + index)

module Equation =

    let CONST = '_'

    let constVal = Map.tryFind CONST >> Option.defaultValue 0

    let termVals = Map.remove CONST >> Map.toList

    let termVal term =
        Map.tryFind term >> Option.defaultValue 0

    let terms = termVals >> List.map fst

    let toString eq =
        let otherTerms =
            eq
            |> termVals
            |> List.map (function
                | k, 1 -> sprintf "%c" k
                | k, -1 -> sprintf "-%c" k
                | k, v -> sprintf "%d%c" v k)
            |> String.concat " + "

        sprintf "%s = %d" otherTerms -(constVal eq)

    let simplify eq =
        let coefficients = eq |> termVals |> List.map (snd >> abs)

        if coefficients.Length < 1 || List.min coefficients <= 1 then
            eq
        else
            let divisor =
                [ 2 .. List.min coefficients ]
                |> List.tryFind (fun d -> Map.forall (fun _ v -> v % d = 0) eq)
                |> Option.defaultValue 1

            eq |> Map.map (fun _ v -> v / divisor)

    let simplifyMany =
        List.map simplify
        >> List.distinct
        >> List.sortBy (constVal >> abs)
        >> List.sortBy _.Count

    let getTermMax term =
        List.filter (Map.containsKey term) >> List.map (constVal >> abs) >> List.min

    let getTermMaximums eqs =
        eqs
        |> List.collect terms
        |> List.map (fun term -> term, getTermMax term eqs)
        |> Map.ofList

    let assignEqValue term value eq =
        match eq |> termVal term with
        | 0 -> eq
        | coeff -> eq |> Map.remove term |> Map.add CONST (constVal eq + coeff * value)

    let assignValue eqs term value =
        eqs |> List.map (assignEqValue term value)

module SymbolicSolver =
    let setTerm eq term coefficient =
        let existing = eq |> Equation.termVal term

        match existing + coefficient with
        | 0 -> eq |> Map.remove term
        | newCoefficient -> eq |> Map.add term newCoefficient

    let combine (term, coefficient) otherEq targetEq =
        match targetEq |> Equation.termVal term with
        | 0 -> targetEq
        | targetCoefficient ->
            let targetMultiplied = targetEq |> Map.map (fun _ v -> v * coefficient)

            otherEq
            |> Map.map (fun _ v -> v * -targetCoefficient)
            |> Map.fold setTerm targetMultiplied
            |> Map.remove term

    let combineMany (term, coefficient) sourceEq =
        let remaining = sourceEq |> Map.filter (fun t _ -> t <> term)

        List.map (combine (term, coefficient) remaining)

    let findTermToReduce = Equation.termVals >> List.sortBy (snd >> abs) >> List.tryHead

    let solve =
        let rec loop eqs =
            match eqs |> Equation.simplifyMany with
            | [] -> []
            | eq :: remainingEqs ->
                match eq |> findTermToReduce with
                | None -> eq :: loop remainingEqs
                | Some term -> eq :: loop (combineMany term eq remainingEqs)

        loop >> loop // Second pass to assign reduced terms

module NumericSolver =
    let INVALID = 'X', 999_999

    let getTermRanges maximums =
        Equation.terms >> List.map (fun term -> term, [ 0 .. Map.find term maximums ])

    let findValidAssignments termMaximums eq =
        let constVal = Equation.constVal eq

        let getTotal =
            Map.toList >> List.sumBy (fun (term, value) -> value * Map.find term eq)

        let rec loop assigned =
            function
            | [] when getTotal assigned + constVal = 0 -> [ assigned ]
            | [] -> []
            | (term, values) :: rest -> values |> List.collect (fun v -> loop (Map.add term v assigned) rest)

        getTermRanges termMaximums eq |> loop Map.empty

    let getMinTotal termMaximums =
        let rec loop eqs =
            match eqs |> Equation.simplifyMany with
            | [] -> []
            | eq :: remainingEqs ->
                match findValidAssignments termMaximums eq with
                | [] -> [ INVALID ]
                | assignments ->
                    assignments
                    |> List.map (fun assignment ->
                        (assignment |> Map.toList)
                        @ (Map.fold Equation.assignValue remainingEqs assignment |> loop))
                    |> List.minBy (List.sumBy snd)

        loop

let createEq (machine: Machine) counterIndex jolt =
    machine.Buttons
    |> List.indexed
    |> List.filter (fun (_, buttonCounters) -> List.contains counterIndex buttonCounters)
    |> List.map (fun (buttonIndex, _) -> buttonIndex |> getTermChar, 1)
    |> Map.ofList
    |> Map.add Equation.CONST -jolt

let getJoltageMinPresses machine =
    let eqs = machine.Joltage |> List.mapi (createEq machine) |> Equation.simplifyMany

    let termMaximums = Equation.getTermMaximums eqs

    eqs
    |> SymbolicSolver.solve
    |> NumericSolver.getMinTotal termMaximums
    |> List.sumBy snd

let solve =
    DayUtils.solveDay (fun input ->
        let machines = input |> Array.map parseRow

        let result1 = machines |> Array.sumBy getIndicatorMinPresses
        let result2 = machines |> Array.sumBy getJoltageMinPresses

        result1, result2, 520, 20626)
