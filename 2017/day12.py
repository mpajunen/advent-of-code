import common.day as common


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


def find_group(start, find_neighbors):
    prev_length = 0
    group = {start}

    while len(group) != prev_length:
        prev_length = len(group)
        group |= find_neighbors(group)

    return group


def find_groups(start, find_neighbors):
    items = start.copy()
    groups = []

    while len(items) != 0:
        group = find_group(items.pop(), find_neighbors)
        items -= group
        groups.append(group)

    return groups


def solve1(neighbors):
    def find_neighbors(group):
        return {n for g in group for n in neighbors[g]}

    zero_group = find_group(0, find_neighbors)

    return len(zero_group)


def solve2(neighbors):
    def find_neighbors(group):
        return {n for g in group for n in neighbors[g]}

    items = set(range(0, len(neighbors)))
    groups = find_groups(items, find_neighbors)

    return len(groups)


if __name__ == "__main__":
    main()
