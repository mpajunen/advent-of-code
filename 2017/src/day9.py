import common.day as day


def main():
    data = day.read_input(9, True)

    day.solve_day(
        data,
        (solve, (17390, 7825)),
    )


def remove_ignored(incoming):
    ignore = False
    out = []

    for char in incoming:
        if ignore:
            ignore = False
        elif char == '!':
            ignore = True
        else:
            out.append(char)

    return out


def remove_garbage(incoming):
    garbage = False
    count = 0
    out = []

    for char in incoming:
        if garbage:
            if char == '>':
                garbage = False
            else:
                count += 1
        elif char == '<':
            garbage = True
        else:
            out.append(char)

    return out, count


def solve1(incoming):
    score = 0
    depth = 0

    for char in incoming:
        if char == '{':
            depth += 1
        elif char == '}':
            score += depth
            depth -= 1

    return score


def solve(raw_data):
    data, garbage_count = remove_garbage(remove_ignored(raw_data))

    return solve1(data), garbage_count


if __name__ == "__main__":
    main()
