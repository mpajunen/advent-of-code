def find(start, find_neighbors):
    prev_length = 0
    group = {start}

    while len(group) != prev_length:
        prev_length = len(group)
        group |= find_neighbors(group)

    return group


def find_all(start, find_neighbors):
    items = start.copy()
    groups = []

    while len(items) != 0:
        group = find(items.pop(), find_neighbors)
        items -= group
        groups.append(group)

    return groups
