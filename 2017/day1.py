import common


def solve(string, offset):
    digits = [int(i) for i in list(string)]
    next_digits = digits[offset:] + digits[:offset]
    pairs = zip(digits, next_digits)
    matches = [i for (i, j) in pairs if i == j]

    return sum(matches)


row = common.read_input(1)[0]

result1 = solve(row, 1)
print(result1)
assert result1 == 997


def solve_halfway(string):
    return solve(string, len(string) // 2)


assert solve_halfway("1212") == 6


result2 = solve_halfway(row)
print(result2)
assert result2 == 1358
