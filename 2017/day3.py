import math

search_square = 347991

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
    axis_distance = abs((-ring + ring_values) % ring)

    return axis_distance + ring


# assert solve_distance(1) == 0
assert solve_distance(12) == 3
assert solve_distance(23) == 2
assert solve_distance(1024) == 31

result1 = solve_distance(search_square)
print(result1)
assert result1 == 480


stress_spiral = """
147  142  133  122   59
304    5    4    2   57
330   10    1    1   54
351   11   23   25   26
362  747  806--->   ...
"""


def next_spiral_position(position):
    x, y, _ = position
    if x > 0 and x > abs(y):
        return x, y + 1, _
    if y > 0 and abs(x - 1) <= y:
        return x - 1, y, _
    if x < 0 and abs(x) >= abs(y - 1):
        return x, y - 1, _
    else:
        return x + 1, y, _


def stress(limit):
    value = 1
    position = (0, 0, value)  # x, y, value
    positions = [position]
    while value < limit:
        position = next_spiral_position(position)
        adjacent = [v for (x, y, v) in positions if abs(x - position[0]) <= 1 and abs(y - position[1]) <= 1]
        value = sum(adjacent)
        positions.append((position[0], position[1], value))
    return value


result2 = stress(search_square)
print(result2)
assert result2 == 349975
