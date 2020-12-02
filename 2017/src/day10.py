import common.day as day
from common.hash_knot import knot, knot_bytes
from common.string import cat, hex_byte


def main():
    data = day.read_input(10)

    day.solve_day(
        data,
        (solve1, 1935),
        (solve2, 'dc7e7dee710d4c7201ce42713e6b8359'),
    )


def solve1(incoming):
    data = day.process_list(
        incoming.split(','),
        modify=int,
    )

    [first, second, *_] = knot(data)

    return first * second


def solve2(incoming):
    hexed = map(hex_byte, knot_bytes(list(incoming)))

    return cat(hexed)


if __name__ == "__main__":
    main()
