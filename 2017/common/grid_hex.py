flat_units = {
    'n': (0, -1),
    'ne': (1, -1),
    'se': (1, 0),
    's': (0, 1),
    'sw': (-1, 1),
    'nw': (-1, 0),
}

pointy_units = {
    'ne': (1, -1),
    'e': (1, 0),
    'se': (0, 1),
    'sw': (-1, 1),
    'w': (-1, 0),
    'nw': (0, -1),
}


def q(point): return point[0]


def r(point): return point[1]


def add(a, b):
    return q(a) + q(b), r(a) + r(b)


def flat_adjacent(point):
    return [add(point, u) for u in flat_units.values()]


def flat_distance(target, start=(0, 0)):
    dq, dr = q(target) - q(start), r(target) - r(start)
    aq, ar = abs(dq), abs(dr)

    # Find sectors where a single step can bring us
    # towards the target on both q and r axes.
    if dq > 0 > dr or dr > 0 > dq:
        return max(aq, ar)
    else:
        return aq + ar


def flat_move(point, direction, distance=1):
    dq, dr = flat_units[direction]

    return q(point) + dq * distance, r(point) + dr * distance
