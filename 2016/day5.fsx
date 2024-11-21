#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"
#load "../fs-common/Hash.fs"

let getPasswords doorId =
    let mutable i = 0
    let mutable password1 = ""
    let mutable password2 = Map.empty

    while password2.Count < 8 do
        i <- i + 1

        let hash = Hash.md5 (doorId + string i)

        if hash.StartsWith("00000") then
            if password1.Length < 8 then
                password1 <- password1 + hash[5..5]

            if hash[5..5] < "8" then
                let key = int hash[5..5]

                if Map.containsKey key password2 |> not then
                    password2 <- password2 |> Map.add key hash[6..6]

    password1, password2 |> Map.values |> String.concat ""

let solve (input: string array) =
    let result1, result2 = input[0] |> getPasswords

    result1, result2, "c6697b55", "8c35d1ab"

DayUtils.runDay solve
