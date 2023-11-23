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

type Move = { Dir: Dir; Steps: int }

module Move =
    let findDir (dir: char) =
        match dir with
        | 'D' -> Down
        | 'L' -> Left
        | 'R' -> Right
        | 'U' -> Up
        | _ -> raise <| new System.Exception(sprintf "Invalid direction %c." dir)

    let unit (dir: Dir) =
        match dir with
        | Down -> { X = 0; Y = 1 }
        | Left -> { X = -1; Y = 0 }
        | Right -> { X = 1; Y = 0 }
        | Up -> { X = 0; Y = -1 }

    let private moveVec (move: Move) = multiply (unit move.Dir) move.Steps

    let apply (point: Vec) (move: Move) = add point <| moveVec move
