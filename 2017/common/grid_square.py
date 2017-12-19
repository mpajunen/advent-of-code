units_main = {
    'n': (0, 1),
    'e': (1, 0),
    's': (0, -1),
    'w': (-1, 0),
}

units_intermediate = {
    'ne': (1, 1),
    'se': (1, -1),
    'sw': (-1, -1),
    'nw': (-1, 1),
}

units_all = {**units_main, **units_intermediate}


def x(point): return point[0]


def y(point): return point[1]


def add(a, b):
    return x(a) + x(b), y(a) + y(b)


default_ignored = [' ']


def build_char_grid(rows, ignored=default_ignored):
    # South = down = unit vector (0, -1)
    return {(j, -i): v for i, row in enumerate(rows) for j, v in enumerate(row) if v not in ignored}


def get_path(step, position, direction):
    path = []

    while direction:
        path.append(position)
        position, direction = step(position, direction)

    return path


def is_opposite(a, b):
    return add(units_all[a], units_all[b]) == (0, 0)


def manhattan_distance(target, start=(0, 0)):
    return abs(x(target) - x(start)) + abs(y(target) - y(start))


def move(point, direction, distance=1):
    dx, dy = units_all[direction]

    return x(point) + dx * distance, y(point) + dy * distance


def adjacent_main(point):
    return [add(point, u) for u in units_main.values()]


def adjacent_all(point):
    return [add(point, u) for u in units_all.values()]
