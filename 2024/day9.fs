module Year2024.Day9

type File = { Id: int; Size: int }

type Block =
    { Files: File list
      Free: int
      Total: int }

let buildBlock index size =
    if index % 2 = 0 then
        { Files = [ { Id = index / 2; Size = size } ]
          Free = 0
          Total = size }
    else
        { Files = []
          Free = size
          Total = size }

let compact canSplit (blocks: Block array) =
    let findSpace required =
        blocks |> Array.findIndex (fun block -> block.Free >= required)

    let rec placeFile file =
        let index = findSpace <| if canSplit then 1 else file.Size
        let block = blocks[index]

        let size = min file.Size block.Free

        blocks[index] <-
            { block with
                Files = blocks[index].Files @ [ { file with Size = size } ]
                Free = block.Free - size }

        if file.Size > size then
            placeFile { file with Size = file.Size - size }

    for index in (Array.length blocks - 1) .. -1 .. 0 do
        let block = blocks[index]

        blocks[index] <-
            { block with
                Files = []
                Free = block.Total }

        block.Files |> List.iter placeFile

    blocks

let blockChecksum startIndex =
    List.collect (fun file -> List.replicate file.Size file.Id)
    >> List.mapi (fun i id -> (id * (startIndex + i)) |> int64)
    >> List.sum

let rec checksum index =
    function
    | [] -> 0L
    | block :: rest -> blockChecksum index block.Files + checksum (index + block.Total) rest

let compactChecksum allowSplit =
    Array.mapi buildBlock >> compact allowSplit >> Array.toList >> checksum 0

let solve = DayUtils.solveDay (fun input ->
    let blockSizes = input[0].ToCharArray() |> Array.map (string >> int)

    let result1 = blockSizes |> compactChecksum true
    let result2 = blockSizes |> compactChecksum false

    result1, result2, 6241633730082L, 6265268809555L)
