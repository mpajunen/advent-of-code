import common


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


def find_group(start, neighbors):
    prev_length = 0
    group = {start}

    while len(group) != prev_length:
        prev_length = len(group)
        group |= {n for g in group for n in neighbors[g]}

    return group


def solve1(neighbors):
    zero_group = find_group(0, neighbors)

    return len(zero_group)


def find_groups(start, neighbors):
    items = start.copy()
    groups = []

    while len(items) != 0:
        group = find_group(items.pop(), neighbors)
        items -= group
        groups.append(group)

    return groups


def solve2(neighbors):
    items = set(range(0, len(neighbors)))
    groups = find_groups(items, neighbors)

    return len(groups)


if __name__ == "__main__":
    main()
