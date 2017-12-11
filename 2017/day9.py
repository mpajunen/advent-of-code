import common

day = 9
raw_data = common.read_input(day, True)


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


data, garbage_count = remove_garbage(remove_ignored(raw_data))


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


result1 = solve1(data)
print(result1)
assert result1 == 17390

result2 = garbage_count
print(result2)
assert result2 == 7825
