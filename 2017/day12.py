import common.day as common
from common.group import find, find_all


def main():
    raw_data = common.read_raw_input(12)
    data = common.process_list(
        raw_data,
        modify=build_neighbors
    )

    common.solve_day(
        data,
        (solve1, 169),
        (solve2, 179),
    )


def build_neighbors(row):
    return [int(n) for n in row.split(' <-> ')[1].split(', ')]


def solve1(neighbors):
    def find_neighbors(group):
        return {n for g in group for n in neighbors[g]}

    zero_group = find(0, find_neighbors)

    return len(zero_group)


def solve2(neighbors):
    def find_neighbors(group):
        return {n for g in group for n in neighbors[g]}

    items = set(range(0, len(neighbors)))
    groups = find_all(items, find_neighbors)

    return len(groups)


if __name__ == "__main__":
    main()
