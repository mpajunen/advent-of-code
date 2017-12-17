import common.day as common
import day10
import day12
from common.grid_square import adjacent_main
from common.string import bin_byte, cat


def main():
    data = 'wenycdww'

    common.solve_day(
        data,
        (solve1, 8226),
        (solve2, 1128),
    )


def solve1(incoming):
    knots = [day10.knot_bytes(incoming + '-' + str(i)) for i in range(128)]

    counts = [bin(n).count("1") for row in knots for n in row]

    return sum(counts)


def get_flag_lists(incoming):
    all_flags = []

    for i in range(128):
        row = day10.knot_bytes(incoming + '-' + str(i))
        chars = cat(map(bin_byte, row))
        flags = [c == '1' for c in list(chars)]

        all_flags.append(flags)

    return all_flags


def find_groups(items, flags):
    def find_neighbors(group):
        return {n for point in group for n in adjacent_main(point) if flags.get(n)}

    return day12.find_groups(items, find_neighbors)


def solve2(incoming):
    flags = get_flag_lists(incoming)

    all_true = set()

    for y, row in enumerate(flags):
        for x, flag in enumerate(row):
            if flag:
                all_true.add((x, y))

    groups = find_groups(all_true, flags)

    result = len(groups)

    return result


if __name__ == "__main__":
    main()
