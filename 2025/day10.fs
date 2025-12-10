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

let solve =
    DayUtils.solveDay (fun input ->
        let machines = input |> Array.map parseRow

        let result1 = machines |> Array.sumBy getIndicatorMinPresses
        let result2 = 0

        result1, result2, 520, 0)
