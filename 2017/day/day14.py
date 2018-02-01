import common.day as day
from common.grid_square import adjacent_main
from common.group import find_all
from common.hash_knot import knot_bytes
from common.string import bin_byte, cat

knot_count = 128


def main():
    data = 'wenycdww'

    day.solve_day(
        data,
        (solve1, 8226),
        (solve2, 1128),
    )


def get_knots(incoming):
    names = [incoming + '-' + str(i) for i in range(knot_count)]

    return [knot_bytes(list(n)) for n in names]


def solve1(incoming):
    knots = get_knots(incoming)

    counts = [bin(n).count("1") for row in knots for n in row]

    return sum(counts)


def get_flags(incoming):
    all_flags = {}

    for i, row in enumerate(get_knots(incoming)):
        chars = cat(map(bin_byte, row))
        row_flags = {(i, j): c == '1' for j, c in enumerate(chars)}

        all_flags = {**all_flags, **row_flags}

    return all_flags


def solve2(incoming):
    flags = get_flags(incoming)

    all_true = {point for point, value in flags.items() if value}

    def find_neighbors(group):
        return {n for point in group for n in adjacent_main(point) if flags.get(n)}

    groups = find_all(all_true, find_neighbors)

    return len(groups)


if __name__ == "__main__":
    main()
