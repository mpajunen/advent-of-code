def x(point): return point[0]


def y(point): return point[1]


def z(point): return point[2]


def add(a, b):
    return x(a) + x(b), y(a) + y(b), z(a) + z(b)


def manhattan_distance(a, b=(0, 0, 0)):
    return abs(x(a) - x(b)) + abs(y(a) - y(b)) + abs(z(a) - z(b))
