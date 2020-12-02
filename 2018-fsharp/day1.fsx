let readLines filePath = System.IO.File.ReadAllLines(filePath)

let path = System.IO.Path.Combine(__SOURCE_DIRECTORY__, ".." , "2018/input/day1.txt")

let lines = readLines path

let numbers = Array.map int lines

let total = Array.sum numbers

printfn "Result 1: %d" total

let sums = (Array.scan (+) 0 numbers).[1..]

let rec findFirstDouble found previous = 
    let index = Set.count found % numbers.Length
    let current = previous + numbers.[index]

    if Set.contains current found then
        current
    else
        findFirstDouble (Set.add current found) current


let findFirstFast () =
    let mutable current = 0
    let mutable found = Set.empty

    while not (Set.contains current found) do    
        found <- Set.add current found

        let index = Set.count found % numbers.Length
        current <- current + numbers.[index]

    current    

let firstDouble = findFirstFast ()

printfn "Result 2: %d" firstDouble


// while not (Set.contains current found) do



// let checkFound (found, first) num =
   // match Set.contains num found, first with
    //| true, None -> found, Some num
    //| true, _ -> found, first
    //| false, _ -> Set.add num found, first

//let (_, first) = Array.fold checkFound (Set.empty, None) sums

// printf "Resu %s" first

// for n in sums do
   // printfn "%d" (n)

// for n in Option.toArray first do
   // printfn "Result 2: %d" (n)
