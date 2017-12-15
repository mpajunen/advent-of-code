import common
import day10
import day12


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
        binary = [bin(n)[2:].rjust(8, '0') for n in row]
        chars = ''.join(binary)
        flags = [c == '1' for c in list(chars)]

        all_flags.append(flags)

    return all_flags


unit_vectors = [(0, 1), (1, 0), (0, -1), (-1, 0)]


def find_groups(items, flags):
    def find_neighbors(group):
        neighbors = set()
        for (x, y) in group:
            for (dx, dy) in unit_vectors:
                tx, ty = x + dx, y + dy

                if 0 <= tx < 128 and 0 <= ty < 128 and flags[ty][tx]:
                    neighbors.add((tx, ty))

        return neighbors

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
