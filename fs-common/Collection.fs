module Collection

let splitOn (predicate: 'a -> bool) (source: 'a array) =
    let loop item =
        function
        | [] -> [ [ item ] ]
        | head :: tail ->
            if predicate item then
                [] :: head :: tail
            else
                (item :: head) :: tail

    Array.foldBack loop source [] |> List.map List.toArray |> List.toArray
