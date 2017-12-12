import common

day = 12
raw_data = common.read_raw_input(day)


def build_neighbors(row):
    return [int(n) for n in row.split(' <-> ')[1].split(', ')]


data = common.process_list(
    raw_data,
    modify=build_neighbors
)


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


result1 = solve1(data)
print(result1)
assert result1 == 169


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


result2 = solve2(data)
print(result2)
assert result2 == 179
