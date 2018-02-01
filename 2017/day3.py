import common.day as day
from common.grid_square import Dir, adjacent_all, move


def main():
    search_square = 347991

    day.solve_day(
        search_square,
        (solve_distance, 480),
        (stress, 349975),
    )


""" Original spiral
17  16  15  14  13
18   5   4   3  12
19   6   1   2  11
20   7   8   9  10
21  22  23---> ...
"""


def find_ring_side(square):
    for ring_side in range(1, 10 ** 999, 2):
        if ring_side ** 2 >= square:
            return ring_side


def solve_distance(square):
    ring_side = find_ring_side(square)
    ring = (ring_side - 1) // 2
    inside_values = (ring_side - 2) ** 2
    ring_steps = square - inside_values
    axis_distance = abs(ring_steps - ring) % (2 * ring)

    return axis_distance + ring


assert solve_distance(2) == 1
assert solve_distance(3) == 2
assert solve_distance(9) == 2
assert solve_distance(10) == 3
assert solve_distance(12) == 3
assert solve_distance(23) == 2
assert solve_distance(1024) == 31

""" Stress spiral
147  142  133  122   59
304    5    4    2   57
330   10    1    1   54
351   11   23   25   26
362  747  806--->   ...
"""


def next_spiral_position(position):
    x, y = position

    if x > abs(y):
        direction = Dir.N
    elif y >= abs(x - 1):
        direction = Dir.W
    elif abs(x) >= abs(y - 1):
        direction = Dir.S
    else:
        direction = Dir.E

    return move(position, direction)


def stress(limit):
    values = {}
    position = 0, 0
    value = 1

    while value < limit:
        values[position] = value
        position = next_spiral_position(position)
        value = sum([values.get(a, 0) for a in adjacent_all(position)])

    return value


if __name__ == "__main__":
    main()
