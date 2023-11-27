#!/usr/bin/env -S dotnet fsi

#load "../fs-common/DayUtils.fs"

let getBaseFuel mass = mass / 3 - 2

let rec getFuel mass =
    let baseFuel = getBaseFuel mass

    if baseFuel <= 0 then 0 else baseFuel + getFuel baseFuel

let solve(input: string array) =
    let masses = Array.map int input

    let result1 = Array.sumBy getBaseFuel masses
    let result2 = Array.sumBy getFuel masses

    result1, result2, 3337766, 5003788

DayUtils.runDay solve
