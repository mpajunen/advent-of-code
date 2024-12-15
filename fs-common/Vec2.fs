module Vec2

type Vec =
    { X: int
      Y: int }

    static member inline (+)(a: Vec, b: Vec) = { X = a.X + b.X; Y = a.Y + b.Y }

    static member inline (-)(a: Vec, b: Vec) = { X = a.X - b.X; Y = a.Y - b.Y }

    static member inline (*)(vec: Vec, multiplier: int) =
        { X = vec.X * multiplier
          Y = vec.Y * multiplier }

    static member inline length(v: Vec) = abs v.X + abs v.Y

    static member inline manhattan (a: Vec) (b: Vec) = abs (a.X - b.X) + abs (a.Y - b.Y)

let origin = { X = 0; Y = 0 }

module Vec =
    let create y x = { X = x; Y = y }

    let unitsCardinal =
        [ 1, 0; 0, 1; -1, 0; 0, -1 ] |> List.map (fun (x, y) -> { X = x; Y = y })

    let unitsDiagonal =
        [ 1, 1; -1, 1; -1, -1; 1, -1 ] |> List.map (fun (x, y) -> { X = x; Y = y })

    let unitsAll =
        [ 1, 0; 1, 1; 0, 1; -1, 1; -1, 0; -1, -1; 0, -1; 1, -1 ]
        |> List.map (fun (x, y) -> { X = x; Y = y })

type Line = Vec * Vec

module Line =
    let private isCommonX ((a, b): Line) (x: int) = min a.X b.X <= x && x <= max a.X b.X

    let private isCommonY ((a, b): Line) (y: int) = min a.Y b.Y <= y && y <= max a.Y b.Y

    let includesPoint (point: Vec) ((a, b): Line) =
        Vec.manhattan a point + Vec.manhattan point b = Vec.manhattan a b

    let getIntersection (a: Line) (b: Line) : Option<Vec> =
        let a1, a2 = a
        let b1, b2 = b

        match (a1.X = a2.X, b1.X = b2.X) with
        | (true, false) ->
            if (isCommonX b a1.X) && (isCommonY a b1.Y) then
                Some { X = a1.X; Y = b1.Y }
            else
                None
        | (false, true) ->
            if (isCommonX a b1.X) && (isCommonY b a1.Y) then
                Some { X = b1.X; Y = a1.Y }
            else
                None
        | (_, _) -> None

    let points (line: Line) =
        let a, b = line

        if a.X = b.X then
            [ for y in min a.Y b.Y .. max a.Y b.Y -> { X = a.X; Y = y } ]
        else
            [ for x in min a.X b.X .. max a.X b.X -> { X = x; Y = a.Y } ]

type Dir =
    | Down
    | Left
    | Right
    | Up

    static member unit(dir: Dir) =
        match dir with
        | Dir.Down -> { X = 0; Y = 1 }
        | Dir.Left -> { X = -1; Y = 0 }
        | Dir.Right -> { X = 1; Y = 0 }
        | Dir.Up -> { X = 0; Y = -1 }

    static member (+)(a: Dir, b: Vec) = Dir.unit a + b

    static member (+)(a: Vec, b: Dir) = a + Dir.unit b

type Turn =
    | Left
    | Right

type Move = { Dir: Dir; Steps: int }

module Move =
    let create dir steps = { Dir = dir; Steps = steps }

    let findDir (dir: char) =
        match dir with
        | 'v'
        | 'D' -> Dir.Down
        | '<'
        | 'L' -> Dir.Left
        | '>'
        | 'R' -> Dir.Right
        | '^'
        | 'U' -> Dir.Up
        | _ -> failwith $"Invalid direction {dir}."

    let toVec (move: Move) = Dir.unit move.Dir * move.Steps

    let apply (point: Vec) (move: Move) = point + toVec move

    let directions = [ Dir.Up; Dir.Right; Dir.Down; Dir.Left ]

    let private turn_ offset from =
        List.findIndex (fun d -> d = from) directions
        |> fun index -> directions[(index + offset + directions.Length) % directions.Length]

    let turn from =
        function
        | Turn.Left -> turn_ -1 from
        | Turn.Right -> turn_ 1 from

    let turnLeft = turn_ -1

    let turnRight = turn_ 1

    let adjacent (point: Vec) =
        Vec.unitsCardinal |> List.map ((+) point)

type Actor = { Position: Vec; Facing: Dir }

module Actor =
    let create y x facing =
        { Position = Vec.create y x
          Facing = facing }

    let turn (turn: Turn) (actor: Actor) =
        { actor with
            Facing = Move.turn actor.Facing turn }

    let forward (actor: Actor) =
        { actor with
            Position = actor.Position + actor.Facing }

    let forwardSteps (steps: int) (actor: Actor) =
        { actor with
            Position = Move.apply actor.Position <| Move.create actor.Facing steps }

type Area = { Min: Vec; Max: Vec }

module Area =
    let getLimits (vectors: Vec seq) : Area =
        let allX = vectors |> Seq.map (fun v -> v.X)
        let allY = vectors |> Seq.map (fun v -> v.Y)

        { Min = { X = Seq.min allX; Y = Seq.min allY }
          Max = { X = Seq.max allX; Y = Seq.max allY } }

type Grid<'a> = 'a array2d

module Grid =
    let cols (grid: Grid<'a>) =
        [| for x in 0 .. Array2D.length2 grid - 1 do
               yield grid[*, x] |]

    let countBy (projection: 'a -> 'b) (grid: Grid<'a>) =
        grid |> Seq.cast |> Seq.countBy projection

    let countOf (projection: 'a -> bool) =
        countBy projection >> Map >> Map.find true

    let entries (grid: Grid<'a>) =
        seq {
            for y in 0 .. (grid.GetLength 0 - 1) do
                for x in 0 .. (grid.GetLength 1 - 1) do
                    { X = x; Y = y }, grid[y, x]
        }

    let values (grid: Grid<'a>) = grid |> entries |> Seq.map snd

    let keys (grid: Grid<'a>) = grid |> entries |> Seq.map fst

    let private matchingKeys predicate (grid: Grid<'a>) =
        seq {
            for y in 0 .. (grid.GetLength 0 - 1) do
                for x in 0 .. (grid.GetLength 1 - 1) do
                    if predicate grid.[y, x] then
                        yield Some({ X = x; Y = y })
                    else
                        yield None
        }

    let findKey predicate = matchingKeys predicate >> Seq.pick id

    let findKeys predicate = matchingKeys predicate >> Seq.choose id

    let fromRows (source: string array) =
        source |> Array.map _.ToCharArray() |> array2D

    let fromString (source: string) = source.Trim().Split '\n' |> fromRows

    let fromSparseMap (defaultValue: 'a) (source: Map<Vec, 'a>) : Grid<'a> =
        let limits = Map.keys source |> Area.getLimits

        let rows = (limits.Max.Y - limits.Min.Y + 1)
        let columns = (limits.Max.X - limits.Min.X + 1)

        let getPosition row col : Vec =
            { X = col + limits.Min.X
              Y = row + limits.Min.Y }

        let getCell row col =
            Map.tryFind (getPosition row col) source |> Option.defaultValue defaultValue

        Array2D.init rows columns getCell

    let get (grid: Grid<'a>) (p: Vec) = grid.[p.Y, p.X]

    let mapi (projection: Vec -> 'a -> 'b) =
        Array2D.mapi (fun y x value -> projection { X = x; Y = y } value)

    let isWithin (grid: Grid<'a>) (p: Vec) =
        p.X >= 0 && p.X < Array2D.length2 grid && p.Y >= 0 && p.Y < Array2D.length1 grid

    let tryGet (grid: Grid<'a>) (p: Vec) =
        if isWithin grid p then Some grid.[p.Y, p.X] else None

    let adjacentPositions (grid: Grid<'a>) (p: Vec) =
        Move.adjacent p |> List.filter (isWithin grid)

    let rows (grid: Grid<'a>) =
        [| for y in 0 .. Array2D.length1 grid - 1 do
               yield grid[y, *] |]

    let set (grid: Grid<'a>) (p: Vec) (value: 'a) = grid.[p.Y, p.X] <- value

    let size (grid: Grid<'a>) =
        { X = Array2D.length2 grid
          Y = Array2D.length1 grid }

    let rotate (grid: Grid<'a>) = grid |> cols |> Array.rev |> array2D

    let rotations (grid: Grid<'a>) =
        List.scan (fun acc _ -> acc |> rotate) grid [ 1..3 ]

    let toString (grid: Grid<'a>) : string =
        let rowToString row =
            [| for col in 0 .. Array2D.length2 grid - 1 -> string grid.[row, col] |]
            |> String.concat ""

        [| for row in 0 .. Array2D.length1 grid - 1 -> rowToString row |]
        |> String.concat "\n"
