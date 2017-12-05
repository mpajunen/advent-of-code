import common

day = 5
data = common.read_input(day)


def move(original, change):
    length = len(original)
    jumps = 0
    position = 0
    values = original

    while position < length:
        jump = values[position]
        jumps += 1
        values[position] = change(jump)
        position += jump

    return jumps


def solve1(raw):
    return move(raw, lambda x: x + 1)


result1 = solve1(list(data))
print(result1)
assert result1 == 396086


def add_or_remove(value):
    return value - 1 if value >= 3 else value + 1


def solve2(raw):
    return move(raw, add_or_remove)


result2 = solve2(list(data))
print(result2)
assert result2 == 28675390
