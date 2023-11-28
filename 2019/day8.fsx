#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let HEIGHT = 6
let WIDTH = 25
let LAYER_SIZE = HEIGHT * WIDTH

let combinePixels (current: char) (next: char) =
    match current with
    | '2' -> next
    | _ -> current

let combineLayers = Array.map2 combinePixels

let toImage layer =
    layer
    |> Array.map (fun pixel -> if pixel = '1' then "#" else " ")
    |> Array.chunkBySize WIDTH
    |> Array.map (String.concat "")
    |> String.concat "\n"

let solve (input: string array) =
    let layers = input[0] |> Seq.toArray |> Array.chunkBySize LAYER_SIZE

    let checkCounts =
        layers |> Array.map (Array.countBy id >> Map) |> Array.minBy (Map.find '0')

    let result1 = Map.find '1' checkCounts * Map.find '2' checkCounts
    let result2 = Array.fold combineLayers layers[0] layers[1..] |> toImage

    result1,
    result2,
    1806,
    "  ##  ##  #### ###   ##  
   # #  # #    #  # #  # 
   # #  # ###  #  # #  # 
   # #### #    ###  #### 
#  # #  # #    # #  #  # 
 ##  #  # #    #  # #  # "

DayUtils.runDay solve
