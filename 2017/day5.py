import common.day as common


def main():
    data = common.read_input(5)

    common.solve_day(
        data,
        (solve1, 396086),
        (solve2, 28675390),
    )


def move(values, change):
    length = len(values)
    jumps = 0
    position = 0

    while position < length:
        jump = values[position]
        jumps += 1
        values[position] = change(jump)
        position += jump

    return jumps


def solve1(raw):
    return move(raw, lambda x: x + 1)


def add_or_remove(value):
    return value - 1 if value >= 3 else value + 1


def solve2(raw):
    return move(raw, add_or_remove)


if __name__ == "__main__":
    main()
