module Vec2

type Vec = { X: int; Y: int }

let origin = { X = 0; Y = 0 }

let manhattan (a: Vec) (b: Vec) = abs (a.X - b.X) + abs (a.Y - b.Y)

let add (a: Vec) (b: Vec) = { X = a.X + b.X; Y = a.Y + b.Y }

let subtract (a: Vec) (b: Vec) = { X = a.X - b.X; Y = a.Y - b.Y }

let multiply (vec: Vec) (multiplier: int) =
    { X = vec.X * multiplier
      Y = vec.Y * multiplier }


type Line = Vec * Vec

module Line =
    let private isCommonX ((a, b): Line) (x: int) = min a.X b.X <= x && x <= max a.X b.X

    let private isCommonY ((a, b): Line) (y: int) = min a.Y b.Y <= y && y <= max a.Y b.Y

    let includesPoint (point: Vec) ((a, b): Line) =
        manhattan a point + manhattan point b = manhattan a b

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

type Dir =
    | Down
    | Left
    | Right
    | Up

type Turn =
    | Left
    | Right

type Move = { Dir: Dir; Steps: int }

module Move =
    let findDir (dir: char) =
        match dir with
        | 'D' -> Dir.Down
        | 'L' -> Dir.Left
        | 'R' -> Dir.Right
        | 'U' -> Dir.Up
        | _ -> raise <| new System.Exception(sprintf "Invalid direction %c." dir)

    let unit (dir: Dir) =
        match dir with
        | Dir.Down -> { X = 0; Y = 1 }
        | Dir.Left -> { X = -1; Y = 0 }
        | Dir.Right -> { X = 1; Y = 0 }
        | Dir.Up -> { X = 0; Y = -1 }

    let private moveVec (move: Move) = multiply (unit move.Dir) move.Steps

    let apply (point: Vec) (move: Move) = add point <| moveVec move

    let private directions = [ Dir.Up; Dir.Right; Dir.Down; Dir.Left ]

    let private turn_ offset from =
        List.findIndex (fun d -> d = from) directions
        |> fun index -> directions[(index + offset + directions.Length) % directions.Length]

    let turn from =
        function
        | Turn.Left -> turn_ -1 from
        | Turn.Right -> turn_ 1 from

    let turnLeft = turn_ -1

    let turnRight = turn_ 1

type Actor = { Position: Vec; Facing: Dir }

module Actor =
    let turn (turn: Turn) (actor: Actor) =
        { actor with
            Facing = Move.turn actor.Facing turn }

    let forward (actor: Actor) =
        { actor with
            Position = add actor.Position <| Move.unit actor.Facing }


type Area = { Min: Vec; Max: Vec }

module Area =
    let getLimits (vectors: Vec seq) : Area =
        let allX = vectors |> Seq.map (fun v -> v.X)
        let allY = vectors |> Seq.map (fun v -> v.Y)

        { Min = { X = Seq.min allX; Y = Seq.min allY }
          Max = { X = Seq.max allX; Y = Seq.max allY } }

type Grid<'a> = 'a array2d

module Grid =
    let fromSparseMap (defaultValue: 'a) (source: Map<Vec, 'a>) : Grid<'a> =
        let limits = Map.keys source |> Area.getLimits

        let rows = (limits.Max.Y - limits.Min.Y + 1)
        let columns = (limits.Max.X - limits.Min.X + 1)

        let getPosition row col : Vec =
            { X = col - limits.Min.X
              Y = row - limits.Min.Y }

        let getCell row col =
            Map.tryFind (getPosition row col) source |> Option.defaultValue defaultValue

        Array2D.init rows columns getCell

    let toString (grid: Grid<'a>) : string =
        let rowToString row =
            [| for col in 0 .. Array2D.length2 grid - 1 -> string grid.[row, col] |]
            |> String.concat ""

        [| for row in 0 .. Array2D.length1 grid - 1 -> rowToString row |]
        |> String.concat "\n"
