#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Vec2.fs"
#load "./IntCode.fs"

let parseTurn =
    function
    | 0 -> Vec2.Turn.Left
    | 1 -> Vec2.Turn.Right
    | turn -> failwith <| sprintf $"Invalid turn {turn}!"

let paint program originColor =
    let computer = IntCode.Computer program

    let paintNext (color: int) =
        let out = computer.run [| color |]

        int out[out.Length - 2], int out[out.Length - 1]

    let rec doPaint (robot: Vec2.Actor) painted =
        let color, turn =
            Map.tryFind robot.Position painted |> Option.defaultValue 0 |> paintNext

        let newPainted = Map.add robot.Position color painted
        let movedRobot = robot |> Vec2.Actor.turn (parseTurn turn) |> Vec2.Actor.forward

        if computer.isHalted then
            newPainted
        else
            doPaint movedRobot newPainted

    let startPainted = Map [ (Vec2.origin, originColor) ]

    doPaint
        { Position = Vec2.origin
          Facing = Vec2.Up }
        startPainted

let draw painted =
    painted
    |> Vec2.Grid.fromSparseMap 0
    |> Array2D.map (fun v -> if v = 1 then "#" else " ")
    |> Vec2.Grid.toString

let solve (input: string array) =
    let program = IntCode.parseProgram input[0]

    let result1 = paint program 0 |> Map.count
    let result2 = paint program 1 |> draw

    result1,
    result2,
    2219,
    " #  #  ##  #### #  # #     ##  ###  ####   
 #  # #  # #    #  # #    #  # #  # #      
 #### #  # ###  #  # #    #  # #  # ###    
 #  # #### #    #  # #    #### ###  #      
 #  # #  # #    #  # #    #  # #    #      
 #  # #  # #     ##  #### #  # #    ####   "

DayUtils.runDay solve
