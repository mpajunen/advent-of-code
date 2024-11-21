module Hash

open System.Security.Cryptography
open System.Text

let md5Builder = MD5.Create()

let md5 (input: string) =
    input
    |> Encoding.UTF8.GetBytes
    |> md5Builder.ComputeHash
    |> Array.map (_.ToString("x2"))
    |> String.concat ""
