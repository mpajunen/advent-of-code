import math

import common.day as common
from common.grid_square import adjacent_all, move


def main():
    search_square = 347991

    common.solve_day(
        search_square,
        (solve_distance, 480),
        (stress, 349975),
    )


original_spiral = """
17  16  15  14  13
18   5   4   3  12
19   6   1   2  11
20   7   8   9  10
21  22  23---> ...
"""


def solve_distance(square):
    ring_side = math.ceil(math.sqrt(square))
    if ring_side % 2 == 0:
        ring_side += 1
    ring = (ring_side - 1) // 2
    inside_values = (ring_side - 2) ** 2
    ring_values = square - inside_values
    axis_distance = abs((ring_values - ring) % ring)

    return axis_distance + ring


assert solve_distance(12) == 3
assert solve_distance(23) == 2
assert solve_distance(1024) == 31

stress_spiral = """
147  142  133  122   59
304    5    4    2   57
330   10    1    1   54
351   11   23   25   26
362  747  806--->   ...
"""


def next_spiral_position(position):
    x, y = position

    if x > abs(y):
        direction = 'n'
    elif y >= abs(x - 1):
        direction = 'w'
    elif abs(x) >= abs(y - 1):
        direction = 's'
    else:
        direction = 'e'

    return move(position, direction)


def stress(limit):
    position = 0, 0
    value = 1
    values = {position: value}

    while value < limit:
        position = next_spiral_position(position)
        value = sum([values.get(a, 0) for a in adjacent_all(position)])
        values[position] = value

    return value


if __name__ == "__main__":
    main()
