#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"

open Vec2

type Side =
    | Inner
    | Outer

type Portal = { Name: string; Side: Side }

type PortalWithPosition =
    { Name: string
      Position: Vec
      Side: Side }

type Route = Portal * int
type Routes = Map<Portal, Route list>

let isPortalTile c = c >= 'A' && c <= 'Z'
let isCorridor c = c = '.'

let START = "AA"
let END = "ZZ"

let swapSide =
    function
    | Inner -> Outer
    | Outer -> Inner

let isOuter (grid: Grid<char>) p =
    let size = Grid.size grid

    p.X <= 1 || p.Y <= 1 || p.X = size.X - 2 || p.Y = size.Y - 2

let buildRoutes grid =
    let getPortal (p, tile) =
        if isPortalTile tile then
            let adjacent = Move.adjacent p |> List.filter (Grid.isWithin grid)

            let otherLetterPosition =
                adjacent
                |> List.map (fun p -> p, Grid.get grid p)
                |> List.tryFind (fun (_, c) -> isPortalTile c)

            let space = adjacent |> List.map (Grid.get grid) |> List.tryFind isCorridor

            match otherLetterPosition, space with
            | Some(pOther, other), Some _ ->
                let name =
                    if pOther.X < p.X || pOther.Y < p.Y then
                        $"{other}{tile}"
                    else
                        $"{tile}{other}"

                let postfix =
                    if name = START || name = END then ""
                    else if isOuter grid p then "-o"
                    else "-i"

                Some
                    { Name = name
                      Position = p
                      Side = if isOuter grid p then Outer else Inner }
            | _ -> None
        else
            None

    let portals = Grid.entries grid |> Seq.choose getPortal |> Seq.toList
    let portalsByPosition = portals |> List.map (fun p -> p.Position, p) |> Map.ofList

    let rec findRoutes path =
        let position = List.head path

        Move.adjacent position
        |> List.filter (fun p -> List.contains p path |> not)
        |> List.collect (fun p ->
            match Grid.get grid p with
            | '.' -> findRoutes (p :: path)
            | '#' -> []
            | _ ->
                match Map.tryFind p portalsByPosition with
                | Some d ->
                    [ { Name = d.Name
                        Side =
                          if d.Name = START || d.Name = END then
                              d.Side
                          else
                              swapSide d.Side },
                      List.length path - 1 ] // Step to portal takes 1, not 2
                | None -> [])

    let routes =
        portals
        |> List.map (fun p -> { Name = p.Name; Side = p.Side }, findRoutes [ p.Position ])
        |> Map

    routes

let fastestRoute (routes: Routes) =
    let rec findRoute (path: Portal list) distance =
        let current = List.head path

        if current.Name = END then
            distance
        else
            let options =
                routes[current]
                |> List.filter (fun (p, _) -> List.contains p path |> not)
                |> List.map (fun (p, d) -> findRoute (p :: path) (distance + d))

            if List.length options = 0 then
                999_999
            else
                List.min options

    findRoute [ { Name = START; Side = Outer } ] 0 - 1 // Start is not at portal, but next to it

type RecursivePosition = { Portal: Portal; Level: int }

let isAccessibleRecursive (p: RecursivePosition) =
    if p.Portal.Name = START || p.Portal.Name = END then
        p.Level = 0
    else if p.Portal.Side = Outer then
        p.Level > 0
    else
        p.Level >= 0

let targetLevel level (portal: Portal) =
    if portal.Name = START || portal.Name = END then level
    else if portal.Side = Outer then level + 1
    else level - 1

let fastestRecursiveRoute (routes: Routes) =
    let mutable visited = Set.empty

    let mutable frontier =
        [ { Portal = { Name = START; Side = Outer }
            Level = 0 },
          0 ]

    let mutable candidate = 999_999

    let findNextPositions (s: RecursivePosition) distance =
        visited <- visited.Add s

        routes[s.Portal]
        |> List.choose (fun (p, d) ->
            let levelPortal =
                { Portal = p
                  Level = targetLevel s.Level p }

            if isAccessibleRecursive levelPortal && Set.contains levelPortal visited |> not then
                Some(levelPortal, distance + d)
            else
                None)

    let rec findRoute () =
        let current, distance = List.head frontier

        if distance > candidate then
            candidate
        else if current.Portal.Name = END && current.Level = 0 then
            candidate <- distance - 1 // Start is not at portal, but next to it

            findRoute ()
        else
            let nextPositions = findNextPositions current distance

            frontier <- List.tail frontier @ nextPositions |> List.sortBy snd

            findRoute ()

    findRoute ()

let solve (input: string array) =
    let routes = input |> Grid.fromRows |> buildRoutes

    let result1 = fastestRoute routes
    let result2 = fastestRecursiveRoute routes

    result1, result2, 632, 7162

DayUtils.runDay solve
